

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



