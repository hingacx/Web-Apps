
// Update Bill Request.
/*
document.getElementById('updateBill').addEventListener('click', function(event){
    var req = new XMLHttpRequest();
    var payload = {bill_ID:null, amount:null};
    payload.bill_ID = document.getElementById('updatebill_ID').value;
    payload.amount = document.getElementById('updateAmount').value;
    req.open('PUT', 'http://localhost:9564/bills', true);
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
  
  // Delete Bill Request.
  document.getElementById('deleteBill').addEventListener('click', function(event){
      var req = new XMLHttpRequest();
      var payload = {bill_ID:null};
      payload.bill_ID = document.getElementById('deletebill_ID').value;
      req.open('DELETE', 'http://flip1.engr.oregonstate.edu:7667/bills', true);
      req.setRequestHeader('Content-Type', 'application/json');
      req.addEventListener('load',function(){
        if(req.status >= 200 && req.status < 400){
          var response = JSON.parse(req.responseText);
          console.log(response);
        } else {
          console.log("Error in network request: " + req.statusText);
        }});
      req.send(JSON.stringify(payload));
    // event.preventDefault();
    });
  