Representation of a REST API, built to run on the Google Cloud Platform (GCP).

General Info
* The REST API models a generic restaurant ordering system.
* Client/users can create orders and add items to those orders.
* Client/users can only modify orders they created.
* See the RESTful_docs for indepth information regarding the API endpoints.

General Flow
* A user/client authenticates themselves with the front end login to Google 0Auth.
* The JWT returned is used to authenticate the user/client when making requests to the API.
* Orders created by the client/user use the JWT: Sub property as a means of authorization.
* When updating or modifying an order, this SUB property ensures only the authorized client/user can make a successful request.

*** NOTES ***
* For security purposes, the API is NOT deployed to the GCP.
* In addition, certain variables have been changed for security reasons.
* These security variables have comments on what the variable should represent.
* This REST API is designed for backend requests, meaning a utility program such as Postman must be used.
* Languages used -> Frontend: JavaScript/HTML/CSS, Backend: Python/Flask 
