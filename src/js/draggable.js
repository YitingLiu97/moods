import { distance, scale, add, sub, angle } from "./vector.js";

let activeElement = null;
let offset_x;
let offset_y;
let last_z = 1;
let initialDistance;
let initialScale;

let initialWidth;
let initialHeight;
let initialAngle;

function startAction(ev) {
  let touches = Array.from(ev.touches);
  let firstTouch = touches[0];
  if (firstTouch.target.classList.contains("draggable")) {
    if (firstTouch.target.tagName === "IMG") {
      // ev.preventDefault();
    }
    let selectedElement = checkImageCoord(firstTouch.target, ev);
    if (!selectedElement || !selectedElement.classList.contains("draggable")) {
      return;
    }
    activeElement = selectedElement;
    let bounds = selectedElement.getBoundingClientRect();

    offset_x = firstTouch.clientX - bounds.left;
    offset_y = firstTouch.clientY - bounds.top;
    activeElement.style.zIndex = last_z;
    last_z++;
    initialWidth = bounds.width;
    initialHeight = bounds.height;

    let secondTouch = touches[1];
    if (secondTouch) {
      let p1 = { x: firstTouch.clientX, y: firstTouch.clientY };
      let p2 = { x: secondTouch.clientX, y: secondTouch.clientY };
      let pDifference = sub(p1, p2);
      let pMid = add(p1, scale(pDifference, 0.5));

      initialDistance = distance(p1, p2);
      initialAngle = angle(pDifference) - getCurrentRotation(selectedElement);
      initialScale = getCurrentScale(selectedElement);
      offset_x = pMid.x - bounds.left;
      offset_y = pMid.y - bounds.top;
    }
  }
}
document.body.addEventListener("touchstart", function (ev) {
  startAction(ev);
});
document.body.addEventListener("mousedown", function (ev) {
  activeElement = null;
  ev.touches = [ev];
  startAction(ev);
});
document.body.addEventListener("touchend", function (ev) {
  activeElement = null;
});
document.body.addEventListener("mouseup", function (ev) {
  activeElement = null;
});

function moveAction(ev) {
  if (!activeElement) {
    return;
  }
  let touches = Array.from(ev.touches);
  let firstTouch = touches[0];

  let x = firstTouch.clientX - offset_x + initialWidth / 2;
  let y = firstTouch.clientY - offset_y + initialHeight / 2;

  let secondTouch = touches[1];
  if (secondTouch) {
    let p1 = { x: firstTouch.clientX, y: firstTouch.clientY };
    let p2 = { x: secondTouch.clientX, y: secondTouch.clientY };
    let pDifference = sub(p1, p2);
    let pMid = add(p1, scale(pDifference, 0.5));

    let newDistance = distance(p1, p2);
    let newAngle = angle(pDifference) - initialAngle;
    let newScale = initialScale * (newDistance / initialDistance);
    x = pMid.x - offset_x + initialWidth / 2;
    y = pMid.y - offset_y + initialHeight / 2;

    activeElement.style.transform = `
     translate(-50%,-50%)
     scale(${newScale})
     rotate(${newAngle * (180 / Math.PI)}deg)`;
  }
  activeElement.style.left = x + "px";
  activeElement.style.top = y + "px";
}
document.body.addEventListener("mousemove", function (ev) {
  ev.touches = [ev];
  moveAction(ev);
});

document.body.addEventListener(
  "touchmove",
  function (ev) {
    ev.preventDefault();
    moveAction(ev);
  },
  { passive: false }
);

let ctx = document.createElement("canvas").getContext("2d");

function checkImageCoord(img_element, event) {
  if (img_element.tagName !== "IMG") {
    return img_element;
  }
  let touches = Array.from(event.touches);
  let firstTouch = touches[0];

  // Get click coordinates
  let x = firstTouch.clientX;
  let y = firstTouch.clientY;
  let w = (ctx.canvas.width = window.innerWidth);
  let h = (ctx.canvas.height = window.innerHeight);

  ctx.clearRect(0, 0, w, h);

  let scale = getCurrentScale(img_element);
  let rotation = getCurrentRotation(img_element);

  ctx.translate(
    parseFloat(img_element.style.left),
    parseFloat(img_element.style.top)
  );
  ctx.scale(scale, scale);
  ctx.rotate(rotation);

  ctx.drawImage(
    img_element,
    -img_element.width / 2,
    -img_element.height / 2,
    img_element.width,
    img_element.height
  );
  ctx.resetTransform();

  let alpha = ctx.getImageData(x, y, 1, 1).data[3]; // [0]R [1]G [2]B [3]A

  // If pixel is transparent,
  // retrieve the element underneath and trigger it's click event
  if (alpha === 0) {
    img_element.style.pointerEvents = "none";
    let nextTarget = document.elementFromPoint(
      firstTouch.clientX,
      firstTouch.clientY
    );
    let nextEl = null;
    if (nextTarget.classList.contains("draggable")) {
      nextEl = checkImageCoord(nextTarget, event);
    }
    img_element.style.pointerEvents = "auto";
    return nextEl;
  } else {
    //image is opaque at location
    return img_element;
  }
}

function getTransform(el) {
  let st = window.getComputedStyle(el, null);
  let tr =
    st.getPropertyValue("-webkit-transform") ||
    st.getPropertyValue("-moz-transform") ||
    st.getPropertyValue("-ms-transform") ||
    st.getPropertyValue("-o-transform") ||
    st.getPropertyValue("transform") ||
    "FAIL";

  return tr.split("(")[1].split(")")[0].split(",");
}
function getCurrentScale(el) {
  let values = getTransform(el);

  return Math.sqrt(values[0] * values[0] + values[1] * values[1]);
}

function getCurrentRotation(el) {
  let values = getTransform(el);

  return Math.atan2(values[1], values[0]);
}
