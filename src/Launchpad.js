const midi = require("midi");
const ProfileButton = require("./ProfileButton");
const QuickButton = require("./QuickButton");
const Button = require("./Button");
const Colors = require("./Colors");
const Profile = require("./Profile");
const fs = require("fs");

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
      let profileButton = new ProfileButton(this, 91 + parseInt(i), {
        color: Colors.WHITE,
        disabledColor: Colors.GREY,
      });

      let quickButton = new QuickButton(this, 19 + parseInt(i) * 10, {
        color: Colors.RED,
        disabledColor: Colors.RED,
      });

      this.quickButtons.push(quickButton);
      this.profileButtons.push(profileButton);

      this.profiles.push(new Profile(this, i));
    }

    this.switchProfile(0);

    if (fs.existsSync(__dirname + `\\..\\data\\quickbuttons.json`)) {
      this.loadQuickButtons();
    }
  }

  listen() {
    this.input.on("message", (delta, data) => {
      let [opcode, buttonId, value] = data;

      //Button down event
      if (value === 127) {
        this.quickButtons.map((btn) => {
          if (btn.id === buttonId && btn.action !== "none") {
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
            if (btn.id === buttonId && btn.action !== "none") {
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

    this.profileButtons[profileId].on();

    this.profiles[this.activeProfile].grid.map((gridRow) => {
      gridRow.map((btn) => {
        btn.enabled ? btn.on() : btn.off();
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

  getButton(id, profileId = this.activeProfile) {
    let quickButtons = [19, 29, 39, 49, 59, 69, 79, 89];
    let button;

    if (quickButtons.includes(id)) {
      this.quickButtons.forEach((btn) => {
        if (btn.id === id) {
          button = btn;
        }
      });

      this.saveQuickButtons();
    } else {
      this.profiles[profileId].grid.forEach((row) => {
        row.forEach((btn) => {
          if (btn.id === id) {
            button = btn;
          }
        });
      });
    }

    return button;
  }

  saveQuickButtons() {
    let save = JSON.stringify(this.quickButtons, (key, value) => {
      if (key === "launchpad") return;
      return value;
    });

    fs.writeFileSync(__dirname + `\\..\\data\\quickbuttons.json`, save);
  }

  loadQuickButtons() {
    let data = JSON.parse(
      fs.readFileSync(__dirname + `\\..\\data\\quickbuttons.json`)
    );

    this.quickButtons.map((btn, j) => {
      this.quickButtons[j] = new QuickButton(this, data[j].id, {
        enabled: data[j].enabled,
        type: data[j].type,
        action: data[j].action,
        color: data[j].color,
        disabledColor: data[j].disabledColor,
        uri: data[j].uri,
        hotkey: data[j].hotkey,
        description: data[j].description,
      });

      this.quickButtons[j].off();
    });
  }
}

module.exports = Launchpad;
