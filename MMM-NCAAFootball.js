Module.register("MMM-NCAAFootball",{

	// Default module config.
  defaults: {
		url: "",
		initialLoadDelay: 2500, // 2.5 seconds delay. This delay is used to keep the wunderground API happy.
		retryDelay: 2500,
    animationSpeed: 1000,
		updateInterval: 5 * 60 * 1000
	},

   getStyles: function () {
        return ["MMM-NCAAFootball.css"];
    },

  start: function() {
    Log.info("Starting module: " + this.name);

    this.title = null;
    this.ranking1 = null;
    this.ranking2 = null;
    this.score1 = null;
    this.score2 = null;
    this.team1 = null;
    this.team2 = null;
    this.time = null;
    this.loaded = 0;
    this.scheduleUpdate(this.config.initialLoadDelay);
  },

  getScores: function() {
  		var url = this.config.url;
  		var self = this;

  		var scoreRequest = new XMLHttpRequest();

  		scoreRequest.open("GET", url, true);

  		scoreRequest.onreadystatechange = function() {
  			if (scoreRequest.readyState === 4) {
  				if (scoreRequest.status === 200) {
  					self.processScores(JSON.parse(scoreRequest.response));
  				} else if (scoreRequest.status === 0 ) {
  					Log.error(self.name + ": Could not get valid JSON data");
            self.updateDom(self.config.animationSpeed);
  				} else {
  					Log.error(self.name + ": Some problem with getting Data.");
  					self.updateDom(self.config.animationSpeed);
  				}
  			}
  		};
  		scoreRequest.send();
  },

  processScores: function(data) {
    this.title = data.title;
    if (this.title == "game") {
      this.ranking1 = data.ranking1;
      this.ranking2 = data.ranking2;
      this.score1 = data.score1;
      this.score2 = data.score2;
      this.team1 = data.team1;
      this.team2 = data.team2;
      this.time = data.time;
    } else if (this.title == "upcomming") {
	this.ranking1 = data.ranking1;
	this.ranking2 = data.ranking2;
      	this.team1 = data.team1;
      	this.team2 = data.team2;
      	this.time = data.time;
   }
	this.loaded = 1;
	this.updateDom(this.config.animationSpeed);

  },

scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		//if a valid delay > 0 was passed into the function use that for the delay
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		var self = this;
		setTimeout(function() {
			self.getScores();
		}, nextLoad);
	},


getDom: function () {

        var wrapper = document.createElement("div");

	if (!this.loaded) {
		wrapper.innerHTML = "Loading Scores...";
		wrapper.className = "dimmed light small";
		return wrapper;
	}

        var table = document.createElement("table");
        table.classList.add("small", "table");

	var row = document.createElement("tr");
        row.classList.add("row");

	if (this.ranking1 != "NR") {
		var rank1 = document.createElement("td");
		rank1.className = "ranking";
		rank1.innerHTML = this.ranking1;
		var subScr = document.createElement("sub");
		subScr.appendChild(rank1);
		row.appendChild(subScr);
	}
	var team1 = document.createElement("td");
	team1.innerHTML = this.team1;

	if (this.title == "game") {
  		var score1 = document.createElement("td");
		var score2 = document.createElement("td");
		if (this.score1 > this.score2) {
  			score1.className = "bright";
		}
		if (this.score2 > this.score1 ){
			score2.className = "bright";
		}
		score1.innerHTML = this.score1;
		score2.innerHTML = this.score2;

		var scoreBreak = document.createElement("td");
		scoreBreak.innerHTML = " : ";
	} 

	var atText = document.createElement("td");
        atText.innerHTML = "at";

	var team2 = document.createElement("td");
        team2.innerHTML = this.team2;

        var timeLeft = document.createElement("td");
        timeLeft.innerHTML = " - " + this.time;

	var teamBreak = document.createElement("td");
	teamBreak.innerHTML = "&nbsp;";

	var teamBreak2 = document.createElement("td");
        teamBreak2.innerHTML = "&nbsp;";

	if (this.title == "game") {
		row.appendChild(team1);
		row.appendChild(teamBreak);
		row.appendChild(score1);
		row.appendChild(scoreBreak);
		row.appendChild(score2);
		row.appendChild(teamBreak2);
	} else {
		row.appendChild(team1);
		row.appendChild(teamBreak);
                row.appendChild(atText);
                row.appendChild(teamBreak2);
	}

	if (this.ranking2 != "NR") {
                var rank2 = document.createElement("td");
		rank2.className = "ranking";
                rank2.innerHTML = this.ranking2;
		var subScr = document.createElement("sub");
                subScr.appendChild(rank2);
                row.appendChild(subScr);
        }

	row.appendChild(team2);
	row.appendChild(timeLeft);


	table.appendChild(row);
	wrapper.appendChild(table);
	return wrapper;
    }


});
