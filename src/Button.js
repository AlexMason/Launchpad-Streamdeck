const Colors = require("./Colors");
const Launchpad = require("./Launchpad");

class Button {
  constructor(launchpad, id, color) {
    this.launchpad = launchpad;
    this.id = id;
    this.color = color;

    this.enabled = false;
  }

  execute() {
    this.toggle();
    console.log(`btn[${this.id}] ${this.enabled}`);
  }

  toggle() {
    this.enabled ? this.off() : this.on();
  }

  on() {
    this.launchpad.ledOn(this.id, this.color);
    this.enabled = true;
  }

  off() {
    this.launchpad.ledOff(this.id);
    this.enabled = false;
  }

  setColor(color) {
    this.color = color;

    if (this.enabled) {
      this.on();
    }
  }
}

module.exports = Button;
