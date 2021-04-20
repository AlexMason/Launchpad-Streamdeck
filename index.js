const lp = new require("./src/Launchpad");
const { app, BrowserWindow, ipcMain } = require("electron");
const Colors = require("./src/Colors");
const launchpad = new lp();
const path = require("path");

launchpad.listen();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 1460,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      webSecurity: false,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows.length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

//Electron events
ipcMain.on("getColors", (event) => {
  event.returnValue = Colors;
});

ipcMain.on("getActiveProfile", (event) => {
  event.returnValue = launchpad.activeProfile;
});

ipcMain.on("setButtonColor", (event, data) => {
  let { id, color } = data;

  let button = launchpad.getButton(id);
  button.color = color;
  let test = test;
});

ipcMain.on("getButtons", (event, data) => {
  let buttons = launchpad.profiles[data.profile].grid.map((i) => {
    return i.map((btn) => {
      return {
        id: btn.id,
        type: btn.type,
        action: btn.action,
        color: btn.color,
        disabledColor: btn.disabledColor,
        uri: btn.uri,
        hotkey: btn.hotkey,
        description: btn.description,
      };
    });
  });

  event.returnValue = buttons;
});

ipcMain.on("getQuickButtons", (event, data) => {
  let buttons = launchpad.quickButtons.map((btn) => {
    return {
      id: btn.id,
      type: btn.type,
      action: btn.action,
      color: btn.color,
      disabledColor: btn.disabledColor,
      uri: btn.uri,
      hotkey: btn.hotkey,
      description: btn.description,
    };
  });

  event.returnValue = buttons;
});

ipcMain.on("getButton", (event, data) => {
  let { id } = data;
  let button = launchpad.getButton(id);

  event.returnValue = {
    id: button.id,
    type: button.type,
    action: button.action,
    color: button.color,
    disabledColor: button.disabledColor,
    uri: button.uri,
    hotkey: button.hotkey,
    description: button.description,
  };
});

ipcMain.on("updateButton", (event, data) => {
  let { id, profileId, options } = data;
  let button = launchpad.getButton(id, profileId);

  console.log(data);

  button.type = options.type;
  button.action = options.action;
  button.color = options.color;
  button.disabledColor = options.disabledColor;
  button.uri = options.uri;
  button.hotkey = options.hotkey;
  button.description = options.description;

  if (profileId == launchpad.activeProfile) {
    button.enabled ? button.on() : button.off();
  }

  launchpad.profiles[profileId].save();
  launchpad.saveQuickButtons();

  event.returnValue = "";
});
