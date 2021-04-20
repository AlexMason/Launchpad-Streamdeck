let colors = window.ipcRenderer.sendSync("getColors");
let activeProfile = window.ipcRenderer.sendSync("getActiveProfile");

let updateModal = new bootstrap.Modal(document.getElementById("updateModal"));

let inputTypeEle = document.getElementById("inputType");
let inputActionEle = document.getElementById("inputAction");
let inputColorEle = document.getElementById("inputColor");
let inputDisabledColorEle = document.getElementById("inputDisabledColor");
let inputUrlEle = document.getElementById("inputUrl");
let inputDescEle = document.getElementById("inputDesc");
let inputHotkeyEle = document.getElementById("inputHotkey");
let inputCtrlModifierEle = document.getElementById("inputCtrlModifier");
let inputLShiftModifierEle = document.getElementById("inputLShiftModifier");
let inputRShiftModifierEle = document.getElementById("inputRShiftModifier");
let inputAltModifierEle = document.getElementById("inputAltModifier");
let inputSaveBtn = document.getElementById("saveBtn");
let profileButtonMenuEle = document.getElementById("profileButtonMenu");
let quickButtonMenuEle = document.getElementById("quickButtonMenu");

let quickButtons = window.ipcRenderer.sendSync("getQuickButtons").reverse();

function renderProfile(profileId) {
  let buttons = window.ipcRenderer.sendSync("getButtons", {
    profile: profileId,
  });

  let buttonsElement = document.getElementById("buttons");

  while (buttonsElement.firstChild) {
    buttonsElement.removeChild(buttonsElement.firstChild);
  }

  buttons.map((row, i) => {
    let rowDiv = document.createElement("div");
    rowDiv.className = "c-row";

    row.map((btn, j) => {
      let buttonElement = document.createElement("div");

      buttonElement.className = "c-btn";
      buttonElement.innerText = btn.description
        ? btn.description
        : btn.action === "none"
        ? ``
        : `(${i}, ${j})`;

      buttonElement.onclick = () => {
        loadButtonData(btn);
      };

      rowDiv.appendChild(buttonElement);
    });

    buttonsElement.appendChild(rowDiv);
    updateModal.hide();
  });
}

function loadButtonData(btn) {
  console.log("Btn Clicked On", btn.id);
  updateModal.show();

  //input type
  for (let child of inputTypeEle.children) {
    if (child.value === btn.type) {
      child.selected = true;
    }
  }

  for (let child of inputActionEle.children) {
    if (child.value === btn.action) {
      child.selected = true;
    }
  }

  while (inputColorEle.firstChild) {
    inputColorEle.removeChild(inputColorEle.firstChild);
  }
  while (inputDisabledColorEle.firstChild) {
    inputDisabledColorEle.removeChild(inputDisabledColorEle.firstChild);
  }

  for (let color in colors) {
    let colorOptionElement = document.createElement("option");
    let colorDisabledOptionElement = document.createElement("option");

    colorOptionElement.value = colors[color];
    colorOptionElement.innerText = color;
    colorDisabledOptionElement.value = colors[color];
    colorDisabledOptionElement.innerText = color;

    inputColorEle.appendChild(colorOptionElement);
    inputDisabledColorEle.appendChild(colorDisabledOptionElement);
  }

  for (let child of inputColorEle.children) {
    if (child.value == btn.color) {
      child.selected = true;
    }
  }

  for (let child of inputDisabledColorEle.children) {
    if (child.value == btn.disabledColor) {
      child.selected = true;
    }
  }

  if (btn.hotkey.length == 2) {
    inputAltModifierEle.checked = btn.hotkey[1].includes("alt");
    inputLShiftModifierEle.checked = btn.hotkey[1].includes("shift");
    inputRShiftModifierEle.checked = btn.hotkey[1].includes("right_shift");
    inputCtrlModifierEle.checked = btn.hotkey[1].includes("control");

    inputHotkeyEle.value = btn.hotkey[0];
  } else {
    inputAltModifierEle.checked = false;
    inputLShiftModifierEle.checked = false;
    inputRShiftModifierEle.checked = false;
    inputCtrlModifierEle.checked = false;
  }

  inputUrlEle.value = btn.uri;
  inputDescEle.value = btn.description;

  inputSaveBtn.onclick = () => {
    updateButton(btn.id);
  };
}

function updateButton(id) {
  let hotkeyModifers = [];

  if (inputCtrlModifierEle.checked) hotkeyModifers.push("control");
  if (inputLShiftModifierEle.checked) hotkeyModifers.push("shift");
  if (inputRShiftModifierEle.checked) hotkeyModifers.push("right_shift");
  if (inputAltModifierEle.checked) hotkeyModifers.push("alt");

  let options = {
    type: inputTypeEle.value,
    action: inputActionEle.value,
    color: parseInt(inputColorEle.value),
    disabledColor: parseInt(inputDisabledColorEle.value),
    description: inputDescEle.value,
    uri: inputUrlEle.value,
    hotkey: [inputHotkeyEle.value, hotkeyModifers],
  };

  console.log(activeProfile);

  window.ipcRenderer.send("updateButton", {
    id: id,
    profileId: activeProfile,
    options,
  });

  renderProfile(activeProfile);
  quickButtons = window.ipcRenderer.sendSync("getQuickButtons").reverse();
  setupQuickButtons();
}

function setupProfiles() {
  while (profileButtonMenuEle.firstChild) {
    profileButtonMenuEle.removeChild(profileButtonMenuEle.firstChild);
  }

  for (let i = 0; i < 8; i++) {
    let li = document.createElement("li");
    let a = document.createElement("a");

    a.classList.add("dropdown-item");
    if (i === activeProfile) {
      a.classList.add("active");
      document.getElementById("profiles").innerText = "Profile " + (i + 1);
    }
    a.href = "#";
    a.innerText = "Profile " + (i + 1);
    a.onclick = () => {
      activeProfile = i;

      renderProfile(activeProfile);
      setupProfiles();
    };

    li.appendChild(a);
    profileButtonMenuEle.appendChild(li);
  }
}

function setupQuickButtons() {
  while (quickButtonMenuEle.firstChild) {
    quickButtonMenuEle.removeChild(quickButtonMenuEle.firstChild);
  }

  for (let i = 0; i < 8; i++) {
    let li = document.createElement("li");
    let a = document.createElement("a");

    a.classList.add("dropdown-item");
    a.href = "#";
    a.innerText = `Q Btn #${i + 1} (${
      quickButtons[i].description
        ? quickButtons[i].description.substring(0, 10)
        : ""
    }...)`;
    a.onclick = () => {
      loadButtonData(quickButtons[i]);
    };

    li.appendChild(a);
    quickButtonMenuEle.appendChild(li);
  }
}

renderProfile(activeProfile);
setupProfiles();
setupQuickButtons();
