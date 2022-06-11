from flask import Blueprint, request
from google.cloud import datastore
from helper import validate_mimetype, get_collection, validate_request, create_entity, get_entity, validate_entity, \
    update_entity, delete_foods
import constants


bp = Blueprint('foods', __name__, url_prefix='/foods')
client = datastore.Client()


# Attributes a food entity should contain
food_attributes = {'name', 'calories', 'vegetarian'}


@bp.route('', methods=['GET', 'POST'])
def get_and_post_foods():
    # Returns a list of foods
    if request.method == 'GET':
        # Checking to see if the request Accept Header is in a valid format.
        chk_content_type = validate_mimetype(None, None, request.accept_mimetypes, 'application/json')
        if chk_content_type is not None:
            return chk_content_type
        return get_collection(constants.foods, request)
    # Create a new food item
    elif request.method == 'POST':
        # Checking to see if the data sent is in the correct format and able to receive data back in the correct format
        chk_content_type = validate_mimetype(request.mimetype, 'application/json', request.accept_mimetypes, 'application/json')
        if chk_content_type is not None:
            return chk_content_type
        # Checking the validity of the data in body of the request
        content = request.get_json()
        chk_content = validate_request(content, food_attributes, 'POST')
        if chk_content is not None:
            return chk_content
        # Creating a new food
        return create_entity(request, constants.foods, content, None)
    else:
        return 'That is a bad method!'


@bp.route('/<food_id>', methods=['GET', 'DELETE', 'PUT', 'PATCH'])
def get_delete_put_and_patch_foods(food_id):
    # Checks to see if the food item exists
    chk_entity = validate_entity(constants.foods, int(food_id), None)
    if chk_entity is not None:
        return chk_entity
    # Returns the food item
    if request.method == 'GET':
        # Checking to see if the request is Accept header is in a valid format.
        chk_content_type = validate_mimetype(None, None, request.accept_mimetypes, 'application/json')
        if chk_content_type is not None:
            return chk_content_type
        return get_entity(constants.foods, int(food_id), request)
    # Deletes the food
    elif request.method == 'DELETE':
        food_key = client.key(constants.foods, int(food_id))
        delete_foods(client.get(food_key))
        client.delete(food_key)
        return '', 204
    # Updates the food item
    elif request.method == 'PUT' or request.method == 'PATCH':
        # Checking to see if the data sent is in the correct format and able to receive data back in the correct format
        chk_content_type = validate_mimetype(request.mimetype, 'application/json', request.accept_mimetypes, 'application/json')
        if chk_content_type is not None:
            return chk_content_type
        # Checking the validity of the data in body of the request
        req_type = 'PUT' if request.method == 'PUT' else 'PATCH'
        content = request.get_json()
        chk_content = validate_request(content, food_attributes, req_type)
        if chk_content is not None:
            return chk_content
        # Update order:
        return update_entity(request, constants.foods, content, int(food_id))
    else:
        return 'That is a bad method!'
