import { Direction } from "../types";

export const detectSwipe = (
  el: HTMLElement,
  callback: (dir: Direction) => void,
): void => {
  let swipedir: Direction = "left";
  let startX: number;
  let startY: number;
  let distX: number;
  let distY: number;
  const threshold = 30;
  const restraint = 100;
  const allowedTime = 300;
  let elapsedTime: number;
  let startTime: number;
  const handleswipe = callback;

  el.addEventListener(
    "touchstart",
    function (e: TouchEvent) {
      const touchobj = e.changedTouches[0];
      swipedir = "left";
      startX = touchobj.pageX;
      startY = touchobj.pageY;
      startTime = new Date().getTime();
      e.preventDefault();
    },
    false,
  );

  el.addEventListener(
    "touchmove",
    function (e: TouchEvent) {
      e.preventDefault();
    },
    false,
  );

  el.addEventListener(
    "touchend",
    function (e: TouchEvent) {
      const touchobj = e.changedTouches[0];
      distX = touchobj.pageX - startX;
      distY = touchobj.pageY - startY;
      elapsedTime = new Date().getTime() - startTime;
      if (elapsedTime <= allowedTime) {
        if (
          Math.abs(distX) >= threshold &&
          Math.abs(distY) <= restraint
        ) {
          swipedir = distX < 0 ? "left" : "right";
        } else if (
          Math.abs(distY) >= threshold &&
          Math.abs(distX) <= restraint
        ) {
          swipedir = distY < 0 ? "up" : "down";
        }
      }
      handleswipe(swipedir);
      e.preventDefault();
    },
    false,
  );
};

export default detectSwipe;
