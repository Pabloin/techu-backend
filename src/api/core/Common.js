const is_HTTP_OK = (httpCode) => {
  return httpCode >= 200 && httpCode < 300
}

const getResultData = (result) => {

  if (is_HTTP_OK(result.status || 200)) {
      return {
        status: result.status,
          data: result.data
      }
  }

  return {
    status: result.status,
     error: result.data
  }

}

const getMailConfig = () => {

  console.log(`getMailConfig() `)

  const mail_user = process.env.Techu_MAIL_SENDER_USER
  const mail_pass = process.env.Techu_MAIL_SENDER_PASS

  return {
    service: 'Gmail',
    auth: {
      user: mail_user,
      pass: mail_pass,
    },
  }
}

const getMongoConfig = () => {

  console.log(`getMongoConfig() `)

  const user = process.env.Techu_MONGODB_MLAB_USER
  const pass = process.env.Techu_MONGODB_MLAB_PASS
  const host = process.env.Techu_MONGODB_MLAB_HOST
  const base = process.env.Techu_MONGODB_MLAB_BASE

  const mongoConfig = (user && pass)
          ? 'mongodb://'+user+':'+pass+'@'+host+'/'+base
          : 'mongodb://'+host+'/'+base

  console.log(`getMongoConfig()= ${mongoConfig}`)

  return mongoConfig

}

module.exports.getMailConfig = getMailConfig
module.exports.getMongoConfig = getMongoConfig
module.exports.getResultData = getResultData


