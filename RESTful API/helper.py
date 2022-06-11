from google.cloud import datastore
from google.auth.transport import requests as google_auth_request
from google.oauth2 import id_token
import constants
import json

client = datastore.Client()


def get_collection(entity, request):
    """Returns an array with all the listings within the entity"""
    q = client.query(kind=entity)
    count = len(list(q.fetch()))
    q_limit = int(request.args.get('limit', '5'))
    q_offset = int(request.args.get('offset', '0'))
    l_iterator = q.fetch(limit=q_limit, offset=q_offset)
    next_page = list(next(l_iterator.pages))
    for page in next_page:
            self_url = request.base_url + "/" + str(page.key.id)
            page['self'] = self_url
    results = {entity: next_page, 'total_items': count}
    # Checking if there are additional results
    if l_iterator.next_page_token:
        next_offset = q_offset + q_limit
        next_url = request.base_url + "?limit=" + str(q_limit) + "&offset=" + str(next_offset)
        results['next'] = next_url
    return results


def get_protected(entity, request, sub):
    """Returns an array with all the entities related to the user"""
    q = client.query(kind=entity)
    count = len(list(q.fetch()))
    q_limit = int(request.args.get('limit', '5'))
    q_offset = int(request.args.get('offset', '0'))
    l_iterator = q.fetch(limit=q_limit, offset=q_offset)
    next_page = list(next(l_iterator.pages))
    display = []
    for page in next_page:
        if page['customer_id'] == sub:
            self_url = request.base_url + "/" + str(page.key.id)
            page['self'] = self_url
            display.append(page)
    results = {entity: display, 'total_items': count}
    # Checking if there are additional results
    if l_iterator.next_page_token:
        next_offset = q_offset + q_limit
        next_url = request.base_url + "?limit=" + str(q_limit) + "&offset=" + str(next_offset)
        results['next'] = next_url
    return results


def get_entity(entity, e_id, request):
    """Returns the entity"""
    entity_key = client.key(entity, e_id)
    entity = client.get(entity_key)
    entity["self"] = request.base_url
    return json.dumps(entity)


def validate_mimetype(req=None, req_type=None, accept=None, accept_type=None):
    """Validate the proper formats for data being sent from the client
        and received from the client"""
    err = {'Error': 'The request body needs to be in JSON format'}
    err1 = {'Error': 'Server is unable to provide the Content-Type requested'}
    if req is not None and req != req_type:
        return err, 415
    elif accept is not None and accept_type not in accept:
        return err1, 406
    return None


def validate_request(content, attributes, method):
    """Validate the data for a new User"""
    err = {'Error': 'The request object contains an invalid attribute'}
    err1 = {'Error': 'The request object is missing at least one of the required attributes'}
    # If an attribute is missing or too many attributes, abort and return a 400 error
    count = 0
    for param in content:
        count += 1
        if param not in attributes:
            return err, 400
    if count < len(attributes) and (method == 'POST' or method == 'PUT'):
        return err1, 400
    return None


def validate_entity(entity, e_id, sub=None):
    """Validates the entity if it exists or does the user have authorization to it"""
    err = {'Error': 'No order with this order_id exists'}
    err1 = {'Error': 'The order is owned by someone else'}
    err2 = {'Error': 'No food with this food_id exists'}
    entity_key = client.key(entity, e_id)
    the_entity = client.get(entity_key)
    if the_entity is None:
        if entity == 'orders':
            return err, 404
        return err2, 404
    if sub is not None and the_entity['customer_id'] != sub:
        if entity == 'orders':
            return err1, 403
    return None


def already_exists(entity, content, identifier):
    """Checks to see if the respective entity is already created"""
    err = {'Error': 'A entity with that name already exists'}
    # Checking to see if an entity with that identifier already exists
    q = client.query(kind=entity)
    results = list(q.fetch())
    data = content[identifier]
    for item in results:
        if item[identifier] == data:
            return err, 401
    return None


def create_entity(request, entity, content, sub):
    """Creates a new entity in the Datastore"""
    new_entity = datastore.Entity(key=client.key(entity))
    for item in content:
        new_entity[item] = content[item]
    if entity == 'orders':
        new_entity['items'] = []
        new_entity['customer_id'] = sub
    if entity == 'foods':
        new_entity['orders'] = []
    client.put(new_entity)
    new_entity['id'] = new_entity.key.id
    client.put(new_entity)
    self_url = request.base_url + "/" + str(new_entity.key.id)
    new_entity['self'] = self_url
    return json.dumps(new_entity), 201


def create_user(sub_id, first_name, last_name):
    """Creates a new User entity if they don't exist"""
    # Checking to see if a Customer with that name and sub id exists
    q = client.query(kind=constants.users)
    users = list(q.fetch())
    # If a user with the sub_id already exists, return
    for user in users:
        if user['user_id'] == sub_id:
            return
    # Create a new entity
    new_entity = datastore.Entity(key=client.key(constants.users))
    new_entity.update({'user_id': sub_id, 'first_name': first_name, 'last_name': last_name})
    client.put(new_entity)


def update_entity(request, entity, content, e_id):
    """Updates the entity"""
    entity_key = client.key(entity, e_id)
    the_entity = client.get(entity_key)
    order_arr = None
    # If a food item is changed, keep track of orders that contain food item
    if entity == 'foods':
        order_arr = delete_foods(the_entity)
    for item in content:
        the_entity[item] = content[item]
    client.put(the_entity)
    the_entity['self'] = request.base_url
    # If a food item has changed, update the orders that contained the food item
    if order_arr is not None:
        q = client.query(kind=constants.orders)
        orders = list(q.fetch())
        for od in orders:
            if od['id'] in order_arr:
                od['items'].append({'id': the_entity['id'], 'name': the_entity['name'],
                'calories': the_entity['calories'], 'vegetarian': the_entity['vegetarian']})
                client.put(od)
    return json.dumps(the_entity)


def delete_orders(order):
    """Deletes orders from food items if contained"""
    order_id = order['id']
    q = client.query(kind=constants.foods)
    foods = list(q.fetch())
    for fd in foods:
        for od in fd['orders']:
            if od['id'] == order_id:
                fd['orders'].remove(od)
                client.put(fd)


def delete_foods(food):
    """Deletes food items from orders if contained"""
    food_id = food['id']
    q = client.query(kind=constants.orders)
    orders = list(q.fetch())
    order_arr = []
    for od in orders:
        for fd in od['items']:
            if fd['id'] == food_id:
                od['items'].remove(fd)
                order_arr.append(od['id'])
                client.put(od)
    return order_arr

def check_for_jwt(request):
    """Checks to see if a JWT was sent in the request"""
    err = {'Error': 'No JWT provided'}
    err1 = {'Error': 'Error: The JWT is invalid'}
    if 'authorization' not in request.headers:
        #return err, 401
        return {'status': 401, 'content': err}
    valid_jwt = validate_jwt(get_req_jwt(request))
    if valid_jwt['status'] != 200:
        return {'status': 401, 'content': err1}
    return {'status': 200, 'content': valid_jwt['sub']}


def get_req_jwt(request):
    """Retrieves the JWT from the request"""
    jwt_header = request.headers["authorization"]
    return jwt_header[7:]


def validate_jwt(jwt):
    """Sends the JWT to google for verification and returns the response"""
    req = google_auth_request.Request()
    try:
        idinfo = id_token.verify_oauth2_token(jwt, req, constants.client_id)
        return {'status': 200, 'sub': idinfo['sub']}
    except ValueError:
        # Invalid token
        return {'status': 401, 'sub': None}
