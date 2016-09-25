Module.register("MMM-NCAAFootball",{

	// Default module config.
	defaults: {
		url: "",
		initialLoadDelay: 2500, // 2.5 seconds delay. This delay is used to keep the wunderground API happy.
		retryDelay: 2500,
    animationSpeed: 1000
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

  }

  getScores: function() {
  		// Uses URL scheme of "http://yourserver.com/gpsUSERNAME/here.php".  Modify as needed for your server.
  		// Allows for multiple folders for different people.  I'm using that function when I switch between mirror users.
  		var url = this.config.url;
  		var self = this;

  		var scoreRequest = new XMLHttpRequest();

  		scoreRequest.open("GET", url, true);

  		locationRequest.onreadystatechange = function() {
  			if (locationRequest.readyState === 4) {
  				if (locationRequest.status === 200) {
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
      this.ranking1 = data.ranking1 == "NR" ? "" : data.ranking1;
      this.ranking2 = data.ranking2 == "NR" ? "" : data.ranking2;
      this.score1 = data.score1;
      this.score2 = data.score2;
      this.team1 = data.team1;
      this.team2 = data.team2;
      this.time = data.time;
    }

  },

  getDom: function () {

        var wrapper = document.createElement("div");
        //var header = document.createElement("header");
        //header.innerHTML = "NCAA " + this.modes[this.details.t] + " " + this.details.y;
        //wrapper.appendChild(header);

        if (!this.scores) {
            var text = document.createElement("div");
            text.innerHTML = this.translate("LOADING");
            text.classList.add("dimmed", "light");
            wrapper.appendChild(text);
        } else {
            var table = document.createElement("table");
            table.classList.add("small", "table");

            table.appendChild(this.createLabelRow());

            for (var i = 0; i < this.scores.length; i++) {
                this.appendDataRow(this.scores[i].$, table);
            }

            wrapper.appendChild(table);
        }

        return wrapper;
    }


});
