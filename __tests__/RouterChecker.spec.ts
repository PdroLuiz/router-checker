import request from "supertest";

import express, { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { Check } from "../src/index";

export function createServer() {
    
    const app = express();

    app.use(express.json());
    
    app.get("/test1", Check({
        body: {
            name: {
                type: "string",
                nullable: false
            },
            email: {
                type: "string",
                nullable: false
            }
        }
    }), 
    (req, res) => {
        const {name, email} = req.body;
        return res.status(200).send({
            name, email
        });
    });
    
    
    
    
    // app.use((err : ErrorRequestHandler, req : Request, res : Response, next : NextFunction) => {
    //     return res.status(500).send({errors: err, status: 500});
    // });


    return app;
}

const app = createServer();

describe("RouterChecker", () => {
    it("Should throw an error when", () => {
        request(app).post("/test").send({
            name: "Pedro", emails: "coolemail@gmail.com"
        }).expect(200);
    })
})

