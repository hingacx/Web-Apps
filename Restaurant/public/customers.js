
// Update Customer Request.
/*
document.getElementById('updateCustomer').addEventListener('click', function(event){
  var req = new XMLHttpRequest();
  var payload = {customer_ID:null, first_name:null, last_name:null, email:null };
  payload.customer_ID = document.getElementById('updatecustomer_ID').value;
  payload.first_name = document.getElementById('updateFname').value;
  payload.last_name = document.getElementById('updateLname').value;
  payload.email = document.getElementById('updateEmail').value;
  req.open('PUT', 'http://flip1.engr.oregonstate.edu:7667/customers', true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.addEventListener('load',function(){
    if(req.status >= 200 && req.status < 400){
      var response = JSON.parse(req.responseText);
      console.log(response);
      console.log('complete')
    } else {
      console.log("Error in network request: " + req.statusText);
    }});
  req.send(JSON.stringify(payload));
// event.preventDefault();
});
*/


// Update Customer Rewards Request.
document.getElementById('updateCustReward').addEventListener('click', function(event){
  var req = new XMLHttpRequest();
  var payload = {customer_ID:null, reward_ID:null};
  payload.customer_ID = document.getElementById('theCustomer').value;
  payload.reward_ID = document.getElementById('theReward').value;
  req.open('PUT', 'http://flip1.engr.oregonstate.edu:7667/custreward', true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.addEventListener('load',function(){
    if(req.status >= 200 && req.status < 400){
      var response = JSON.parse(req.responseText);
      console.log(response);
      console.log('complete')
    } else {
      console.log("Error in network request: " + req.statusText);
    }});
  req.send(JSON.stringify(payload));
// event.preventDefault();
});


// Delete Customer Request.
document.getElementById('deleteCustomer').addEventListener('click', function(event){
    var req = new XMLHttpRequest();
    var payload = {customer_ID:null};
    payload.customer_ID = document.getElementById('deletecustomer_ID').value;
    req.open('DELETE', 'http://flip1.engr.oregonstate.edu:7667/customers', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
        var response = JSON.parse(req.responseText);
        console.log(response);
        console.log('complete')
      } else {
        console.log("Error in network request: " + req.statusText);
      }});
    req.send(JSON.stringify(payload));
  // event.preventDefault();
  });

