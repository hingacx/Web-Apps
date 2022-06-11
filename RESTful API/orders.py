from flask import Blueprint, request
from google.cloud import datastore
from helper import validate_mimetype, validate_request, create_entity, check_for_jwt, \
     validate_entity, get_protected, get_entity, update_entity, delete_orders
import json
import constants


bp = Blueprint('orders', __name__, url_prefix='/orders')
client = datastore.Client()

# Attributes an order entity should contain
order_attributes = {'order_type', 'priority', 'amount'}


@bp.route('', methods=['GET', 'POST'])
def get_and_post_orders():
    # Checking to see if a JWT was provided and is legit
    chk_jwt = check_for_jwt(request)
    if chk_jwt['status'] != 200:
        return chk_jwt['content'], chk_jwt['status']
    sub = chk_jwt['content']
    # Returns all the users belonging to the user
    if request.method == 'GET':
        # Checking to see if the request Accept Header is in a valid format.
        chk_content_type = validate_mimetype(None, None, request.accept_mimetypes, 'application/json')
        if chk_content_type is not None:
            return chk_content_type
        return json.dumps(get_protected(constants.orders, request, sub))
    # Create a new order
    elif request.method == 'POST':
        # Checking to see if the data sent is in the correct format and able to receive data back in the correct format
        chk_content_type = validate_mimetype(request.mimetype, 'application/json', request.accept_mimetypes, 'application/json')
        if chk_content_type is not None:
            return chk_content_type
        # Checking the validity of the data in body of the request
        content = request.get_json()
        chk_content = validate_request(content, order_attributes, 'POST')
        if chk_content is not None:
            return chk_content
        # Creating a new order
        return create_entity(request, constants.orders, content, sub)
    else:
        return 'That is a bad method!'


@bp.route('/<order_id>', methods=['GET', 'DELETE', 'PUT', 'PATCH'])
def get_delete_put_and_patch_orders(order_id):
    # Checking to see if a JWT was provided and is legit
    chk_jwt = check_for_jwt(request)
    if chk_jwt['status'] != 200:
        return chk_jwt['content'], chk_jwt['status']
    sub = chk_jwt['content']
    # Checking to see if the order is owned by the user
    chk_entity = validate_entity(constants.orders, int(order_id), sub)
    if chk_entity is not None:
        return chk_entity
    # Returns the order
    if request.method == 'GET':
        # Checking to see if the request is Accept header is in a valid format.
        chk_content_type = validate_mimetype(None, None, request.accept_mimetypes, 'application/json')
        if chk_content_type is not None:
            return chk_content_type
        return get_entity(constants.orders, int(order_id), request)
    # Deletes the order
    elif request.method == 'DELETE':
        order_key = client.key(constants.orders, int(order_id))
        delete_orders(client.get(order_key))
        client.delete(order_key)
        return '', 204
    # Updates the order
    elif request.method == 'PUT' or request.method == 'PATCH':
        # Checking to see if the data sent is in the correct format and able to receive data back in the correct format
        chk_content_type = validate_mimetype(request.mimetype, 'application/json', request.accept_mimetypes, 'application/json')
        if chk_content_type is not None:
            return chk_content_type
        # Checking the validity of the data in body of the request
        req_type = 'PUT' if request.method == 'PUT' else 'PATCH'
        content = request.get_json()
        chk_content = validate_request(content, order_attributes, req_type)
        if chk_content is not None:
            return chk_content
        # Update order:
        return update_entity(request, constants.orders, content, int(order_id))
    else:
        return "That's a bad method!"


@bp.route('/<order_id>/foods/<food_id>', methods=['PATCH', 'DELETE'])
def patch_and_delete_orders_with_foods(order_id, food_id):
    # Checking to if both order and food exists
    chk_order = validate_entity(constants.orders, int(order_id), None)
    chk_food = validate_entity(constants.foods, int(food_id), None)
    if chk_order is not None:
        return chk_order
    if chk_food is not None:
        return chk_food
    # Getting the order and food item
    order_key = client.key(constants.orders, int(order_id))
    order = client.get(order_key)
    food_key = client.key(constants.foods, int(food_id))
    food = client.get(food_key)
    # Add food to an order
    if request.method == 'PATCH':
        for fd in order['items']:
            if fd['id'] == int(food_id):
                return {'Error': 'That food is already on the order'}, 403
        # Adds a food item to an order and adds an order ID to the food
        order['items'].append({'id': int(food_id), 'name': food['name'],
                               'calories': food['calories'], 'vegetarian': food['vegetarian']})
        client.put(order)
        food['orders'].append({'id': int(order_id)})
        client.put(food)
        return '', 204
    elif request.method == 'DELETE':
        for fd in order['items']:
            if fd['id'] == int(food_id):
                order['items'].remove(fd)
                client.put(order)
                break
        for od in food['orders']:
            if od['id'] == int(order_id):
                food['orders'].remove(od)
                client.put(food)
                break
        return '', 204
    else:
        return "That's a bad method!"