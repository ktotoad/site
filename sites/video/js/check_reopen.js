const array = new Uint32Array(10);
window.session = self.crypto.getRandomValues(array);
localStorage.setItem("session", window.session);
const onStorage = function (e) {
  if (e.key === "session" && e.newValue !== window.session)
    localStorage.setItem("multitab", window.session);
  if (e.key === "multitab" && e.newValue && e.newValue !== window.session) {
    window.removeEventListener("storage", onStorage);
    localStorage.removeItem("multitab");
    window.addEventListener("storage", onStorage);
    window.location = "testReopen.html";
  }
};
window.addEventListener("storage", onStorage);