const HLEFT = "hint--left";
const HRIGHT = "hint--right";
const HTOP = "hint--top";
const HBOTTOM = "hint--bottom";
const DELETEDCLASS = "deleted--class";

// регулируем событие resize используя requestAnimationFrame
(function () {
  let throttle = function (type, name, obj) {
    obj = obj || window;
    let running = false;
    let func = function () {
      if (running) {
        return;
      }
      running = true;
      requestAnimationFrame(function () {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    obj.addEventListener(type, func);
  };
  throttle("resize", "optimizedResize");
})();

// сохраняем стили до скрытия
const id_bottom_bar_style = {},
  tab_of_cont_style = {},
  id_course_header_style = {},
  content_style = {},
  id_showTOC_style = {},
  difficulty_menu_id_style = {},
  night_mode_style = {},
  note_menu_id_style = {},
  bookmark_menu_id_style = {};

// обработчик resize
function setDivStyle(element, styleObject, prevStyle = false) {
  if (prevStyle) {
    if (Object.keys(prevStyle).length === 0) {
      for (let key in styleObject) {
        prevStyle[key] = element.style[key];
      }
    }
  }
  for (let key in styleObject) {
    element.style[key] = styleObject[key];
  }
}

// обработчик resize
window.addEventListener("optimizedResize", () => {
  const transition = "max-height 0.5s, opacity 0.5s, visibility 0.5s linear";
  const hideStyle = {
    visibility: "hidden",
    opacity: "0",
    "max-height": "0px",
    transition: transition,
    width: 0,
  };
  const z = Math.round(window.devicePixelRatio * 100);
  const id_bottom_bar = document.getElementById("id_bottom_bar");
  const tab_of_cont = document.getElementById("tab_of_cont");
  const id_course_header = document.getElementById("id_course_header");
  const id_showTOC = document.getElementById("showTOC");
  const difficulty_menu_id = document.getElementById("difficulty_menu_id");
  const note_menu_id = document.getElementById("note_menu_id");
  const bookmark_menu_id = document.getElementById("bookmark_menu_id");
  const content = document.getElementById("content");
  if (z > 200) {
    setDivStyle(id_bottom_bar, hideStyle, id_bottom_bar_style);
    setDivStyle(tab_of_cont, hideStyle, tab_of_cont_style);
    setDivStyle(id_course_header, hideStyle, id_course_header_style);
    setDivStyle(id_showTOC, hideStyle, id_showTOC_style);
    setDivStyle(difficulty_menu_id, hideStyle, difficulty_menu_id_style);
    setDivStyle(note_menu_id, hideStyle, note_menu_id_style);
    setDivStyle(bookmark_menu_id, hideStyle, bookmark_menu_id_style);
    setDivStyle(
      content,
      {
        maxWidth: "100%",
        flex: "0 0 100%",
        transition: transition,
      },
      content_style
    );
  } else {
    setDivStyle(id_bottom_bar, id_bottom_bar_style);
    setDivStyle(tab_of_cont, tab_of_cont_style);
    setDivStyle(id_course_header, id_course_header_style);
    setDivStyle(id_showTOC, id_showTOC_style);
    setDivStyle(difficulty_menu_id, difficulty_menu_id_style);
    setDivStyle(note_menu_id, note_menu_id_style);
    setDivStyle(bookmark_menu_id, bookmark_menu_id_style);
    setDivStyle(content, content_style);
  }
  checkHintPositionHandler();
});

(function () {
  let item = document.getElementById("xbody");
  if (item && item.hasAttribute("image-width")) {
    if (
      item.style["background-size"] === "cover" ||
      item.style["background-size"] === "contain" ||
      item.style["background-repeat"] === "repeat" ||
      item.style["background-repeat"] === "no-repeat"
    ) {
      item.style.width = "100%";
      item.style.height = "100%";
    } else {
      let imageWidth = parseInt(item.getAttribute("image-width"));
      let imageHeight = parseInt(item.getAttribute("image-height"));
      item.style.width = imageWidth;
      item.style.height = imageHeight;
    }
  } else if (item.style["background"]) {
    item.style.width = "100%";
    item.style.height = "100%";
  }
})();

(function () {
  let elem = document.getElementById("bookFooter");
  if (elem && elem.children) {
    if (elem.children.length === 1) {
      if (elem.children[0].outerText.trim() !== "") {
        elem.style.display = "initial";
      }
    } else if (elem.children.length > 1) {
      elem.style.display = "initial";
    }
  }
})();

checkHintPositionHandler();

function checkHintPositionHandler() {
  const contentElement = document.getElementById("content");
  if (contentElement) {
    const array = document.getElementsByClassName("text_with_hint");
    const contentElementRect = contentElement.getBoundingClientRect();
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      let deleted_class = element.getAttribute(DELETEDCLASS);
      if (deleted_class) {
        element.classList.remove(HBOTTOM);
        element.classList.remove(HLEFT);
        element.classList.remove(HTOP);
        toggleHintDirection(element, true, HRIGHT, deleted_class);
      }
      checkHintPosition(element, contentElementRect);
    }
  }
}

function checkHintPosition(element, contentElementRect) {
  const hint = element.getAttribute("data-hint");
  if (hint) {
    const w = getTextWidth(hint);
    let direction = false;
    let newDirection = false;
    if (element.classList.contains(HLEFT)) {
      direction = HLEFT;
      newDirection = HRIGHT;
    } else if (element.classList.contains(HRIGHT)) {
      direction = HRIGHT;
      newDirection = HLEFT;
    } else if (element.classList.contains(HTOP)) {
      direction = HTOP;
      newDirection = HBOTTOM;
    } else if (element.classList.contains(HBOTTOM)) {
      direction = HBOTTOM;
      newDirection = HTOP;
    }
    if (direction) {
      let ih = isHidden(element, w, direction, contentElementRect);
      if (ih) {
        toggleHintDirection(element, ih, direction, newDirection);
      }
    }
  }
}

function toggleHintDirection(element, isHidden, oldClass, newClass) {
  if (isHidden) {
    if (!element.getAttribute(DELETEDCLASS))
      element.setAttribute(DELETEDCLASS, oldClass);
    element.classList.remove(oldClass);
    element.classList.add(newClass);
  }
}

function isHidden(element, offset, direction, contentElementRect) {
  let elementHides = false;
  const elementRect = element.getBoundingClientRect();
  if (elementRect) {
    switch (direction) {
      case HTOP:
        elementHides = elementRect.top < contentElementRect.top + offset.height;
        break;
      case HLEFT:
        elementHides =
          elementRect.left < contentElementRect.left + offset.width;
        break;
      case HBOTTOM:
        elementHides =
          elementRect.bottom + offset.height > contentElementRect.bottom;
        break;
      case HRIGHT:
        elementHides =
          elementRect.right + offset.width > contentElementRect.right;
        break;
    }
  }
  return elementHides;
}

function getTextWidth(string) {
  let text = document.createElement("span");
  document.body.appendChild(text);
  text.style.height = "auto";
  text.style.width = "auto";
  text.style.position = "absolute";
  text.innerHTML = string;
  const W = Math.ceil(text.clientWidth);
  const H = Math.ceil(text.clientHeight) + 30;
  document.body.removeChild(text);
  return {
    width: W,
    height: H,
  };
}
