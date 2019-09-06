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


## Ejemplo 1:

var username = 'gerardo'
db.getCollection('users').find({"username" : username  })

var userId = 6464
db.getCollection('users').find({"userId" : userId  })
db.getCollection('accounts').find({"userId" : userId  })
db.getCollection('transactions').find({"userId" : userId  })


## Ejemplo 2:

// proy1 = { "_id":0, "accountBalance": 1}
 // proy2 = { "_id":0, "accountBranch": 0, "accountDV": 0 }

db.getCollection('accounts').find({"accountId" : 7662, "accountCurrency" : "ARS"}, proy1 )
db.getCollection('accounts').find({"accountId" : 6467, "accountCurrency" : "USD"}, proy1 )

db.getCollection('accounts').find({"accountCurrency" : "USD", "accountType" : "CA"}, proy2)


