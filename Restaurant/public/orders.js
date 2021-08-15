  // Delete Item Request.
  document.getElementById('deleteOrder').addEventListener('click', function(event){
    var req = new XMLHttpRequest();
    var payload = {order_ID:null};
    payload.order_ID = document.getElementById('deleteOrder_ID').value;
    req.open('DELETE', 'http://flip1.engr.oregonstate.edu:7667/orders', true);
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