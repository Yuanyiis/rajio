const sequelize = require('../tool/sequelize')
const prettyBytes = require('pretty-bytes')
const moment = require('moment')

module.exports = async (ctx) => {
  const item = await sequelize.rajio.findOne({
    where: {
      downloadCode: ctx.code
    }
  })
  let forbidden = false
  if (!item || item.deleted) {
    forbidden = true
    ctx.response.status = 404
  } else {
    item.fileSize = prettyBytes(item.fileSize)
    const now = moment()
    const limit = moment(item.timeLimit)
    if ((item.downloadLimit !== null && item.downloadLimit <= item.downloadCount) || (item.timeLimit !== null && now.isAfter(limit, 'second'))) {
      forbidden = true
      ctx.response.status = 404
    }
  }

  await ctx.render('share', {
    share: true,
    item: item,
    domain: global.config.domain,
    forbidden
  });
}