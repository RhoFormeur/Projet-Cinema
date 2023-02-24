
exports.limitArr = (arr, limit) => {
    return arr.slice(0, limit)
}

exports.toUpper = (str) => {
    return str.toUpperCase()
}

const moment = require('moment');
exports.formatDate = (date, format) => {
    return moment(date).format(format)
}

exports.formatCommentDate =(date)=>{
    return moment(date).startOf('minute').fromNow()
}