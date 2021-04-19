const Button = require("./Button");
const Colors = require("./Colors");

class Profile {
  constructor(launchpad) {
    this.launchpad = launchpad;
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
          Colors.BLUE
        );

        row.push(btn);
      }
      this.grid.push(row);
    }

    this.grid.reverse();
  }
}

module.exports = Profile;
