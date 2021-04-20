const util = require("util");
const fs = require("fs");
const Button = require("./Button");
const Colors = require("./Colors");

class Profile {
  constructor(launchpad, profileId) {
    this.launchpad = launchpad;
    this.profileId = profileId;
    this.grid = [];

    this.setup();
  }

  setup() {
    for (let i of [...new Array(8).keys()]) {
      let row = [];
      for (let j of [...new Array(8).keys()]) {
        let btn = new Button(
          this.launchpad,
          parseInt(i) * 10 + 11 + parseInt(j),
          {
            color: Colors.WHITE,
          }
        );

        row.push(btn);
      }
      this.grid.push(row);
    }

    this.grid.reverse();

    this.load();
  }

  save() {
    let save = JSON.stringify(this.grid, (key, value) => {
      if (key === "launchpad") return;
      return value;
    });

    fs.writeFileSync(
      __dirname + `\\..\\data\\profile${this.profileId}.json`,
      save
    );
  }

  load() {
    if (
      !fs.existsSync(__dirname + `\\..\\data\\profile${this.profileId}.json`)
    ) {
      return;
    }
    let data = JSON.parse(
      fs.readFileSync(__dirname + `\\..\\data\\profile${this.profileId}.json`)
    );

    this.grid.map((row, i) => {
      this.grid.map((btn, j) => {
        this.grid[i][j] = new Button(this.launchpad, data[i][j].id, {
          enabled: data[i][j].enabled,
          type: data[i][j].type,
          action: data[i][j].action,
          color: data[i][j].color,
          disabledColor: data[i][j].disabledColor,
          uri: data[i][j].uri,
          hotkey: data[i][j].hotkey,
          description: data[i][j].description,
        });

        this.grid[i][j].enabled ? this.grid[i][j].on() : this.grid[i][j].off();
      });
    });
  }
}

module.exports = Profile;
