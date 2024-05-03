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

function repair(i) {
  if (i >= 0 && i <= 9) {
    return '0' + i
  } else {
    return i
  }
}

export var FormatDate = (time) => {
  var date = new Date(time)
  var year = date.getFullYear(),
    month = repair(date.getMonth() + 1), //月份是从0开始的
    day = repair(date.getDate()),
    hour = repair(date.getHours()),
    min = repair(date.getMinutes()),
    sec = repair(date.getSeconds())
  var formatedDate = `${year}-${month}-${day} ${hour}:${min}:${sec}`
  return formatedDate
}
