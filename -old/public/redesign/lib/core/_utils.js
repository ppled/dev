export function isTouchScreen () {
  let touchPoints = (window.navigator || {}).maxTouchPoints

  if (typeof touchPoints !== 'number') touchPoints = 0
  return touchPoints > 0
}
