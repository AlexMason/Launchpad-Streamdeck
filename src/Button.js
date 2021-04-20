const Colors = require("./Colors");
const Launchpad = require("./Launchpad");
const robot = require("robotjs");
const open = require("open");

class Button {
  constructor(launchpad, id, options = {}) {
    this.launchpad = launchpad;
    this.id = id;

    this.enabled = options.enabled || false;
    this.type = options.type || "action"; //toggle, action, always on
    this.action = options.action || "none"; //uri, hotkey
    this.color = options.color || Colors.WHITE;
    this.disabledColor = options.disabledColor || Colors.NONE;
    this.uri = options.uri || "";
    this.hotkey = options.hotkey || [];
    this.description = options.description || null;

    this.launchpad.ledOn(this.id, this.disabledColor);
  }

  execute() {
    if (this.type === "always on") {
      this.launchpad.ledOn(this.id, this.color);
      setTimeout(() => this.launchpad.ledOn(this.id, this.disabledColor), 1000);
    } else if (this.type === "toggle") {
      this.toggle();
    } else if (this.type === "action") {
      this.on();
      setTimeout(() => this.off(), 1000);
    }

    switch (this.action) {
      case "uri":
        if (this.uri !== "") {
          open(this.uri);
        }
        break;
      case "hotkey":
        if (this.hotkey.length === 2) {
          robot.keyTap(this.hotkey[0], this.hotkey[1]);
        }
        break;
    }

    console.log(`btn[${this.id}] ${this.enabled} ${this.type}`);
  }

  toggle() {
    this.enabled ? this.off() : this.on();
  }

  on() {
    this.launchpad.ledOn(this.id, this.color);
    this.enabled = true;
  }

  off() {
    this.launchpad.ledOn(this.id, this.disabledColor);
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
