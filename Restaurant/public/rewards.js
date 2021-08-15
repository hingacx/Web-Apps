
// Update Reward Request.
document.getElementById('updateReward').addEventListener('click', function(event){
    var req = new XMLHttpRequest();
    var payload = {reward_ID:null, description:null};
    payload.reward_ID = document.getElementById('updatereward_ID').value;
    payload.description = document.getElementById('updateDescription').value;
    req.open('PUT', 'http://flip1.engr.oregonstate.edu:7667/rewards', true);
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
  
  
  // Delete Reward Request.
  document.getElementById('deleteReward').addEventListener('click', function(event){
      var req = new XMLHttpRequest();
      var payload = {reward_ID:null};
      payload.reward_ID = document.getElementById('deletereward_ID').value;
      req.open('DELETE', 'http://flip1.engr.oregonstate.edu:7667/rewards', true);
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
  