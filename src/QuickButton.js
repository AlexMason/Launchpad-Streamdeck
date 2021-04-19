const Button = require("./Button");

class QuickButton extends Button {
  constructor(launchpad, id, color) {
    super(launchpad, id, color);

    this.toggle();
  }

  execute() {
    console.log(`quickBtn[${this.id}]`);
  }
}

module.exports = QuickButton;
