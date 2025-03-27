function DevToolsOpened(type) {
  let str = "Была попытка открыть консоль разработчика";
  switch (type) {
    case 1:
      str = "Была открыта консоль разработчика";
      break;
    case 2:
      str = "Браузер не firefox";
      break;
  }
  showMessage(str, mtWarning, 1000, () => {});
}

if (
  (window.console && window.console.firebug) ||
  console.assert(1) === "_firebugIgnore"
) {
  DevToolsOpened();
}

window.addEventListener("keydown", function (e) {
  if (
    // CMD + Alt + I (Chrome, Firefox, Safari)
    (e.metaKey == true && e.altKey == true && e.keyCode == 73) ||
    // CMD + Alt + J (Chrome)
    (e.metaKey == true && e.altKey == true && e.keyCode == 74) ||
    // CMD + Alt + C (Chrome)
    (e.metaKey == true && e.altKey == true && e.keyCode == 67) ||
    // CMD + Shift + C (Chrome)
    (e.metaKey == true && e.shiftKey == true && e.keyCode == 67) ||
    // Ctrl + Shift + I (Chrome, Firefox, Safari, Edge)
    (e.ctrlKey == true && e.shiftKey == true && e.keyCode == 73) ||
    // Ctrl + Shift + J (Chrome, Edge)
    (e.ctrlKey == true && e.shiftKey == true && e.keyCode == 74) ||
    // Ctrl + Shift + C (Chrome, Edge)
    (e.ctrlKey == true && e.shiftKey == true && e.keyCode == 67) ||
    // F12 (Chome, Firefox, Edge)
    e.keyCode == 123 ||
    // CMD + Alt + U, Ctrl + U (View source: Chrome, Firefox, Safari, Edge)
    (e.metaKey == true && e.altKey == true && e.keyCode == 85) ||
    (e.ctrlKey == true && e.keyCode == 85)
  ) {
    DevToolsOpened();
    e.preventDefault();
  }
});

console.log(
  Object.defineProperties(new Error(), {
    message: {
      get() {
        DevToolsOpened(1);
      },
    },
    toString: {
      value() {
        new Error().stack.includes("toString@");
      },
    },
  })
);
