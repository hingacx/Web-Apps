from google.cloud import datastore
from flask import Flask, render_template, request, redirect
from helper import validate_jwt, create_user
import requests
import constants
import orders
import foods
import users


app = Flask(__name__)
app.register_blueprint(orders.bp)
app.register_blueprint(users.bp)
app.register_blueprint(foods.bp)
client = datastore.Client()


@app.route('/')
def root():
    """Render the welcome page"""
    auth_url = request.base_url + "auth"
    return render_template('index.html', auth_url=auth_url)


@app.route('/auth', methods=['GET'])
def auth():
    """Route to make an authentication request"""
    google_oauth2 = "https://accounts.google.com/o/oauth2/v2/auth"
    client_id = constants.client_id
    redirect_uri = constants.redirect_url
    response_type = "code"
    scope = "https://www.googleapis.com/auth/userinfo.profile"
    secret = "NotSoSecret1000"
    full_url = google_oauth2 + "?client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&response_type=" + response_type + "&scope=" + scope + "&state=" + secret
    return redirect(full_url)


@app.route('/oauth2', methods=['GET'])
def oauth2():
    err = {'Error': 'JWT is invalid'}
    token_url = "https://oauth2.googleapis.com/token"
    people_url = "https://people.googleapis.com/v1/people/me?personFields=names"
    client_id = constants.client_id
    client_secret = constants.client_secret
    code = request.args["code"]
    grant_type = "authorization_code"
    redirect_uri = constants.redirect_url
    req = requests.post(token_url, {"client_id": client_id, "client_secret": client_secret, "code": code, "grant_type": grant_type, "redirect_uri": redirect_uri})
    # Getting the JET token
    jwt_token = req.json()["id_token"]
    chk_jwt = validate_jwt(jwt_token)
    if chk_jwt['status'] != 200:
        return err, 401
    sub_id = chk_jwt['sub']
    # Getting the access token
    access_token = req.json()["access_token"]
    headers = {"Authorization": "Bearer " + access_token}
    people_req = requests.get(people_url, headers=headers).json()
    first_name = people_req["names"][0]["givenName"]
    last_name = people_req["names"][0]["familyName"]
    # Create a new User if they don't exist
    create_user(sub_id, first_name, last_name)
    return render_template('info.html', jwt=jwt_token, home_page=request.root_url, sub=sub_id)


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000, debug=True)
