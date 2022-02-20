// API Key
const API_key = "289ce770cb9e425782062946824d3c43";

/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 *
 *         START: Section that deals with searching for a NFL team.
 *
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

document
  .getElementById("team_search_btn")
  .addEventListener("click", search_team);

document.getElementById("hide").addEventListener("click", hide_team);

document
  .getElementById("player_search_btn")
  .addEventListener("click", search_player);

// Makes a GET request to pull player data from a respective team
function search_team() {
  // Make a new list
  make_team_table();

  let team = $("#nfl_team").val();
  let nfl_url =
    "https://api.sportsdata.io/v3/nfl/scores/json/Players/" +
    team +
    "?key=" +
    API_key;

  // format data[i].attribute use python to check easier e.g. data[i].PlayerID data[i].Name
  $.get(nfl_url, function (data, status) {
    let len_team = $(data).length;

    for (let i = 0; i < len_team; i++) {
      let row = document.createElement("tr");
      let name_cell = document.createElement("td");
      let pos_cell = document.createElement("td");

      // Configuring the button with the row
      let btn = document.createElement("button");
      btn.style.type = "button";
      btn.textContent = "Add";
      btn.className = "btn btn__display";

      btn.onclick = function () {
        add_player(data[i].Name, data[i].PlayerID);
      };

      // Finish appending the elements to do the document
      name_cell.appendChild(document.createTextNode(data[i].Name));
      pos_cell.appendChild(document.createTextNode(data[i].Position));

      row.appendChild(name_cell);
      row.appendChild(pos_cell);
      row.appendChild(btn);
      $("#display_team").append(row);
    }
  });
}

// Toggles displayings the table
function hide_team() {
  let table = document.getElementById("display_team");
  if (table.style.display === "none") {
    table.style.display = "block";
    $("#hide").html("Hide");
  } else {
    table.style.display = "none";
    $("#hide").html("Show");
  }
}

// Deletes and remakes the table
function make_team_table() {
  // Remove existing table
  $("#display_team").remove();

  // Create a new table
  let new_table = document.createElement("table");
  new_table.id = "display_team";
  $("#display_team_container").append(new_table);
}

// Used to get acronyms of NFL teams, and display them in the dropdown
function get_nfl_teams() {
  let nfl_url =
    "https://api.sportsdata.io/v3/nfl/scores/json/Teams" + "?key=" + API_key;

  $.get(nfl_url, function (data, status) {
    let len_data = Object.keys(data).length;
    let select = $("#nfl_team");

    for (let i = 0; i < len_data; i++) {
      let option = document.createElement("option");
      option.value = data[i].Key.toLowerCase();
      option.innerHTML = data[i].Name;
      select.append(option);
    }
  });
}

get_nfl_teams();

/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 *
 *         END: Section that deals with searching for a NFL team.
 *
 --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 *
 *         START: Section that deals with player tracker
 *
 --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

// Function that adds a individual player to the player list
function add_player(name, id) {
  // Checking to make sure we don't already have maximum number of players added to list
  let rowCount = $("#display_players tr").length;

  let bool = check_players(id);
  if (bool) {
    if (rowCount < 5) {
      let row = document.createElement("tr");
      let name_cell = document.createElement("td");
      let id_cell = document.createElement("td");
      let btn = document.createElement("button");
      row.id = id;

      // Configuring delete button
      btn.style.type = "button";
      btn.textContent = "Del";
      btn.className = "btn btn__display";

      // Button removes the current row on activation
      btn.onclick = function () {
        $(this).closest("tr").remove();
      };

      name_cell.appendChild(document.createTextNode(name));
      id_cell.appendChild(document.createTextNode(id));

      row.appendChild(name_cell);
      row.appendChild(id_cell);
      row.appendChild(btn);

      $("#display_players").append(row);
    } else {
      alert("Error: Too Many Players Added, Delete One First!");
    }
  } else {
    alert("You already added that player to the list! Select another!");
  }
}

// Checks the displayer layers list to see if there are duplicate players
function check_players(id) {
  let display = document.getElementById("display_players");
  for (let i = 0, row; (row = display.rows[i]); i++) {
    if (id == row.id) {
      return false;
    }
  }
  return true;
}

/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 *
 *         END: Section that deals with player tracker
 *
 --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 *
 *         START: Section that deals with top 5 team power rankings
 *
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

function top_five() {
  // Creating the URL
  let season = "2021";
  let nfl_url =
    "https://api.sportsdata.io/v3/nfl/scores/json/Standings/" +
    season +
    "?key=" +
    API_key;

  // Requesting data from database
  $.get(nfl_url, function (data, status) {
    let len_data = Object.keys(data).length;

    // Holds the top 5 AFC conference teams
    const afc_rankings = [];
    let i = 1;
    while (i <= 5) {
      for (let j = 0; j < len_data; j++) {
        let team = data[j];
        // Finds the corresponding team teaming 1...5
        if (team.Conference == "AFC" && team.ConferenceRank == i) {
          afc_rankings.push(team.Name);
          break;
        }
      }
      i += 1;
    }

    // Holds the top 5 NFC conference teams
    const nfc_rankings = [];
    let n = 1;
    while (n <= 5) {
      for (let j = 0; j < len_data; j++) {
        let team = data[j];
        if (team.Conference == "NFC" && team.ConferenceRank == n) {
          nfc_rankings.push(team.Name);
          break;
        }
      }
      n += 1;
    }

    // Calls a function to display teams on HTML
    display_top_five(afc_rankings, nfc_rankings);
  });
}

// Displays top 5 conference teams
function display_top_five(afc, nfc) {
  let len_data = afc.length;

  for (let i = 0; i < len_data; i++) {
    let afc_team = afc[i];
    let nfc_team = nfc[i];
    let li = document.createElement("li");
    let lix = document.createElement("li");
    li.appendChild(document.createTextNode(afc_team));
    lix.appendChild(document.createTextNode(nfc_team));
    $("#AFC_top5").append(li);
    $("#NFC_top5").append(lix);
  }
}

// Places top 5 in
top_five();

/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 *
 *         END: Section that deals with top 5 team power rankings
 *
 --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 *
 *         START: Section that deals with individual player stats
 *
 --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

// Search for a player and retrieve their data.
function search_player() {
  let player_id = $("#player_search").val();
  let nfl_url =
    "https://api.sportsdata.io/v3/nfl/stats/json/PlayerSeasonStatsByPlayerID/2021/" +
    player_id +
    "?key=" +
    API_key;

  $.get(nfl_url, function (data, status) {
    let nfl_data = data[0];
    if (nfl_data !== undefined) {
      make_player_table();
      display_player_stats(nfl_data);
    } else {
      alert("Bad Input!! Try Another Player ID");
    }
  });
}

// Displays the player's stats.
function display_player_stats(nfl_player) {
  // Making dom elements
  let row = document.createElement("tr");
  let team_cell = document.createElement("td");
  let name_cell = document.createElement("td");
  let pos_cell = document.createElement("td");
  let passing_td_cell = document.createElement("td");
  let rushing_td_cell = document.createElement("td");
  let sacks_cell = document.createElement("td");

  // Adding the data to the elements.
  team_cell.appendChild(document.createTextNode(nfl_player.Team));
  name_cell.appendChild(document.createTextNode(nfl_player.Name));
  pos_cell.appendChild(document.createTextNode(nfl_player.Position));
  passing_td_cell.appendChild(
    document.createTextNode(nfl_player.PassingTouchdowns)
  );
  rushing_td_cell.appendChild(
    document.createTextNode(nfl_player.RushingTouchdowns)
  );
  sacks_cell.appendChild(document.createTextNode(nfl_player.Sacks));

  // Adding the dom elements to the HTML page
  row.appendChild(team_cell);
  row.appendChild(name_cell);
  row.appendChild(pos_cell);
  row.appendChild(passing_td_cell);
  row.appendChild(rushing_td_cell);
  row.appendChild(sacks_cell);

  $("#player_search_display").append(row);
}

// Deletes and remakes the player table
function make_player_table() {
  // Remove existing table
  $("#player_search_display").remove();

  // Create a new table
  let new_table = document.createElement("tbody");
  new_table.id = "player_search_display";
  $("#player_search_tbl").append(new_table);
}

/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 *
 *         END: Section that deals with individual player stats
 *
 --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 *
 *         START: Section with OTHER components
 *
 --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

// Get's current time
function current_time() {
  let date = new Date();
  let the_time = date.toLocaleTimeString();
  $("#time").text(the_time);
}

// Update current time in ms
setInterval(current_time, 1000);
current_time();

// Testing function, not normal implementation
function test() {
  console.log("test!");
}

/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * 
 *         END: Section with OTHER components
 * 
 --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
