

const getMongoConfig = () => {

  console.log(`getMongoConfig() `)

  const user = process.env.Techu_MONGODB_MLAB_USER
  const pass = process.env.Techu_MONGODB_MLAB_PASS

  const mongoConfig = (user && pass)
          ? 'mongodb://'+user+':'+pass+'@'
              +process.env.Techu_MONGODB_MLAB_HOST+'/'
              +process.env.Techu_MONGODB_MLAB_BASE
          : 'mongodb://'
              +process.env.Techu_MONGODB_MLAB_HOST+'/'
              +process.env.Techu_MONGODB_MLAB_BASE

  console.log(`getMongoConfig()= ${mongoConfig}`)

  return mongoConfig

}

module.exports.getMongoConfig = getMongoConfig

// Techu_MONGODB_MLAB_BASE=techu-bank-alpha
// Techu_MONGODB_MLAB_USER=Techu
// Techu_MONGODB_MLAB_PASS=Techu2020
// Techu_MONGODB_MLAB_HOST=ds263307.mlab.com:63307

