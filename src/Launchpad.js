const midi = require("midi");
const ProfileButton = require("./ProfileButton");
const QuickButton = require("./QuickButton");
const Colors = require("./Colors");
const Profile = require("./Profile");

class Launchpad {
  input = new midi.Input();
  output = new midi.Output();
  quickButtons = [];
  profileButtons = [];
  profiles = [];
  activeProfile = 0;

  constructor() {
    this.input.openPort(1);
    this.output.openPort(2);

    this.setup();
  }

  setup() {
    //reset all buttons to blank
    for (let i = 0; i < 99; i++) {
      this.ledOff(i);
    }

    //setup profile & quicklaunch bar & profiles
    for (let i of [...Array(8).keys()]) {
      let profileButton = new ProfileButton(
        this,
        91 + parseInt(i),
        Colors.WHITE
      );
      let quickButton = new QuickButton(
        this,
        19 + parseInt(i) * 10,
        Colors.RED
      );

      this.quickButtons.push(quickButton);
      this.profileButtons.push(profileButton);

      this.profiles.push(new Profile(this));
    }

    //load save data
  }

  listen() {
    this.input.on("message", (delta, data) => {
      let [opcode, buttonId, value] = data;

      //Button down event
      if (value === 127) {
        this.quickButtons.map((btn) => {
          if (btn.id === buttonId) {
            btn.execute();
          }
        });

        this.profileButtons.map((btn) => {
          if (btn.id === buttonId) {
            btn.execute();
          }
        });

        this.profiles[this.activeProfile].grid.map((gridRow) => {
          gridRow.map((btn) => {
            if (btn.id === buttonId) {
              btn.execute();
            }
          });
        });
      }
    });
  }

  switchProfile(profileId) {
    this.activeProfile = profileId;
    this.resetLed();

    this.profiles[this.activeProfile].grid.map((gridRow) => {
      gridRow.map((btn) => {
        if (btn.enabled) {
          btn.on();
        }
      });
    });
  }

  resetLed() {
    this.profiles[0].grid.map((gridRow) => {
      gridRow.map((btn) => {
        this.ledOff(btn.id);
      });
    });
  }

  ledOn(id, color) {
    this.output.sendMessage([144, id, color]);
  }

  ledOff(id) {
    this.output.sendMessage([144, id, 0]);
  }
}

module.exports = Launchpad;

let btnObj = {
  type: "toggle", //toggle, single press, keybind
  action: "a", //
};
