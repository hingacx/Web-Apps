
// Update Item Request.
document.getElementById('updateItem').addEventListener('click', function(event){
    var req = new XMLHttpRequest();
    var payload = {item_ID:null, price:null};
    payload.item_ID = document.getElementById('updateitem_ID').value;
    payload.price = document.getElementById('updatePrice').value;
    req.open('PUT', 'http://flip1.engr.oregonstate.edu:7667/items', true);
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
  
  
  // Delete Item Request.
  document.getElementById('deleteItem').addEventListener('click', function(event){
      var req = new XMLHttpRequest();
      var payload = {item_ID:null};
      payload.item_ID = document.getElementById('deleteitem_ID').value;
      req.open('DELETE', 'http://flip1.engr.oregonstate.edu:7667/items', true);
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
  
