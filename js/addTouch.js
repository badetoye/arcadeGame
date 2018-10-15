/**
 * @description - Handle the touch-screen enable devices.
 *  Allow swipes (up, down, right, left
 */
// Source: https://www.kirupa.com/html5/detecting_touch_swipe_gestures.htm
document.addEventListener("touchstart", startTouch, false);
document.addEventListener("touchmove", moveTouch, false);

// Swipe Up / Down / Left / Right
var initialX = null;
var initialY = null;

function startTouch(e) {
  e.preventDefault();

  initialX = e.touches[0].clientX;
  initialY = e.touches[0].clientY;
};

function moveTouch(e) {
  e.preventDefault();

  if (initialX === null) {
    return;
  }

  if (initialY === null) {
    return;
  }

  var currentX = e.touches[0].clientX;
  var currentY = e.touches[0].clientY;

  var diffX = initialX - currentX;
  var diffY = initialY - currentY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    // sliding horizontally
    if (diffX > 0 && player.x > 0) {
      // swiped left
      player.x -= 101;
    }
    if(diffX < 0 && player.x < 404) {
      // swiped right
      player.x += 101;
    }
  } else {
    // sliding vertically
    if (diffY > 0 && player.y > 0) {
      // swiped up
      player.y -= 83;
    }
    if(diffY < 0 && player.y < 332) {
      // swiped down
      player.y += 83;
    }
  }

  initialX = null;
  initialY = null;
};