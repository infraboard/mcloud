export var DurationHumanize = (seconds) => {
  let hours = Math.floor(seconds / 3600)
  let remainingSecondsAfterHours = seconds % 3600
  let minutes = Math.floor(remainingSecondsAfterHours / 60)
  let remainingSeconds = remainingSecondsAfterHours % 60

  if (hours === 0) {
    if (minutes === 0) {
      return `${remainingSeconds}秒`
    } else if (remainingSeconds === 0) {
      return `${minutes}分钟`
    } else {
      return `${minutes}分钟`
    }
  } else {
    if (minutes === 0 && remainingSeconds === 0) {
      return `${hours}小时`
    } else if (minutes === 0) {
      return `${hours}小时`
    } else if (remainingSeconds === 0) {
      return `${hours}小时 ${minutes}分钟`
    } else {
      return `${hours}小时 ${minutes}分钟`
    }
  }
}
