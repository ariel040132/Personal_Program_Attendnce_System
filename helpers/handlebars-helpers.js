// const dayjs = require('dayjs')
// const relativeTime = require('dayjs/plugin/relativeTime')
// dayjs.extend(relativeTime)
module.exports = {
  // currentYear: () => dayjs().year(),
  // relativeTimeFromNow: a => dayjs(a).fromNow(),
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },
  eq: function (a, b) {
      return a === b;
  }

}
