function msToMinutes(ms) {
    return Math.round(ms/1000/60)
}
function minutesToHourString(min) {
    let hoursString = ''+Math.round(min/60)
    let minString = (''+min%60).padStart(2, '0')
    return `${hoursString}:${minString}`
}
function dateStringToMS(s) {
    return new Date(s).getTime()
}
export {msToMinutes, minutesToHourString, dateStringToMS}