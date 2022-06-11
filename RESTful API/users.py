from flask import Blueprint, request
from google.cloud import datastore
from helper import validate_mimetype
import constants
import json


bp = Blueprint('users', __name__, url_prefix='/users')
client = datastore.Client()


@bp.route('', methods=['GET'])
def get_users():
    if request.method == 'GET':
        # Checking to see if the request Accept Header is in a valid format.
        chk_content_type = validate_mimetype(None, None, request.accept_mimetypes, 'application/json')
        if chk_content_type is not None:
            return chk_content_type
        q = client.query(kind=constants.users)
        results = list(q.fetch())
        for el in results:
            el["id"] = el.key.id
        return json.dumps(results)
    else:
        return 'That is a bad method!'
