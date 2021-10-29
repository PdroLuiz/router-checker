# Router Checker

Router-Checker is a express middlaware package for providing a way to validate requests before the logic of your application

## Instalation

You can install router-checker through the npm registry. using npm or yarn

```sh
npm install router-checker
```

or

```sh
yarn add router-checker
```

## Usage


If the request does not match with the Check object it will return an array with the error witch can be handled later in an error handler middlaware

### simple exemple

```typescript
import express from "express";
import { Check } from "router-checker";

const app = express();

app.use(express.json());


app.post("/myvalidatedapi",
     Check({
        body: {
            name: {
                type: "string",
                nullable: false,
                validator: (val : any) => {
                    return val.length > 5;
                }   
            }
        }
     }),
    (req, res) => {
        const { name, isFoo } = req.body;
            return res.status(200).send(`Hi ${name}, thanks for using our package!`);
    }
    );

app.use((err, req, res, next) => {
    // if something fail in the request checker you can handle it here
    return res.status(500).send("something went wrong :(");
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});


```


### The Checker Object

The checker object is the object that you'll pass through the Check function.
It has the ParamChecker, QueryChecker and the BodyChecker interface.

In the case bellow, the request must have a query param with the name of id `` /myendpoint?id=1234 `` with can be transalated to a string and the body must have an object with properties called *objProperty1* witch must be a number and *objProperty2* witch must be a string.

```typescript
import { Checker } from "router-checker";

export const createUserChecker : Checker = {
    query: {
        id: {
            type: "string",
            nullable: false
        },
    },
    body: {
        obj: {
            type: {
                objProperty1: {
                    type: "number",
                    nullable: true,
                },
                objProperty2: {
                    type: "string",
                    nullable: false,
                }
            }
        }
    }
};
```

### validator function

In case you need more complex validation, like checking the length of a string or the validation of an email you can use the validator function, it's a function that receives the value in the param and return a boolean, in the case that the value returned is true, the validator will let it pass, if its false, it'll throw an error.

``` typescript

import { Checker } from "router-checker";

export const myChecker : Checker = {
    body: {
        myString: {
            type: "string",
            // Checks if the string is longer than 6 caracteres
            validator: (param : string) => {
                return param.length > 6;
            }
        }
    }
};
```

I know there are (a lot of) grammatical errors here, I'll fix it later. english is not my native language.
