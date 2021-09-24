import express, { json, ErrorRequestHandler, Request, Response, NextFunction } from "express";

import { Check } from "./index";

const app = express();

app.use(json());

app.get("/", Check({
    body: {
        ta: {
            type: {
                a: { type: "string" },
                b: { type: "string", nullable: false }
            }
        }
    }
}), (req, res) => {
    return res.send({ok: true});
})

app.use((err : ErrorRequestHandler, req : Request, res : Response, next : NextFunction) => {
    return res.status(500).send({errors: err, status: 500});
});


app.listen(3011, () => {
    console.log("listening on port 3011")
});