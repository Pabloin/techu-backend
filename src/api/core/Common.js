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

module.exports.getMongoConfig = getMongoConfig
module.exports.getResultData = getResultData


