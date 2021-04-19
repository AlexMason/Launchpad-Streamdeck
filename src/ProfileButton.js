const Button = require("./Button");
const Colors = require("./Colors");

class ProfileButton extends Button {
  constructor(launchpad, id, color) {
    super(launchpad, id, color);

    this.toggle();
  }

  execute() {
    console.log(`profBtn[${this.id}]`);

    this.launchpad.profileButtons.map((btn) => {
      btn.off();
    });

    this.on();
    this.launchpad.switchProfile(this.id - 91);
  }

  off() {
    this.launchpad.ledOn(this.id, Colors.GREY);
  }
}

module.exports = ProfileButton;
