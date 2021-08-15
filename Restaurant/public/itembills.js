  
  // Delete Bill Request.
  document.getElementById('deleteItemBills').addEventListener('click', function(event){
    var req = new XMLHttpRequest();
    var payload = {ib_ID:null};
    payload.ib_ID = document.getElementById('deleteItemBills_ID').value;
    req.open('DELETE', 'http://flip1.engr.oregonstate.edu:7667/itembills', true);
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


  
// Update Bill Request USED from bills.js
document.getElementById('updateBill').addEventListener('click', function(event){
    var req = new XMLHttpRequest();
    var payload = {bill_ID:null, amount:null};
    payload.bill_ID = document.getElementById('updatebill_ID').value;
    payload.amount = document.getElementById('updateAmount').value;
    req.open('PUT', 'http://flip1.engr.oregonstate.edu:7667/itembills', true);
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