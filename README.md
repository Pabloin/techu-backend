# Tu! Open API Bank

Tu! Open Bank Api

# Despues de Swagger

```
npm i --save cors dotenv mongoose
npm i --save express-jwt  lodash  jsonwebtoken 
````

# Tools 

```
npm install -g swagger-node-codegen
npm install --save swagger-node-codegen
```

# Environments:

hostname
- http://localhost:3000
- https://techu-backend.herokuapp.com/
- https://techu-backend-develop.herokuapp.com/


# Query DB

var username = 'gerardo'
db.getCollection('users').find({"username" : username  })

var userId = 6464
db.getCollection('users').find({"userId" : userId  })
db.getCollection('accounts').find({"userId" : userId  })
db.getCollection('transactions').find({"userId" : userId  })

