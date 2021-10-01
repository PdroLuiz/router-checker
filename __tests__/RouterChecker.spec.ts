import request from "supertest";

import express, { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { Check } from "../src/index";



describe("Router Checker", () => {
   
    const app = createServer();

    describe("Query Checker", () => {
        it("should give a 200 status with query 'param' not being empty", (done) => {
            request(app)
            .get("/testquery?param=312")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    
        it("should give an error with query 'param' being empty", (done) => {
            request(app)
            .get("/testquery")
            .then(response => {
                expect(response.statusCode).toBe(500);
                done();
            });
        });

        it("should give an error when passing 'param' different from 'thisValue'", (done) => {
            request(app)
            .get("/testqueryvalidator?param=notthisvalue")
            .then(response => {
                expect(response.statusCode).toBe(500);
                done();
            });
        });

        it("should give a 200 status when passing param as 'thisValue'", (done) => {
            request(app)
            .get("/testqueryvalidator?param=thisValue")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });

    describe("Param Checker", () => {
        it("should give a 200 status with 'param' not being empty", (done) => {
            request(app)
            .get("/testparam/312")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    
        it("should give an error when passing 'param' different from 'thisValue'", (done) => {
            request(app)
            .get("/testparamvalidator/notthisvalue")
            .then(response => {
                expect(response.statusCode).toBe(500);
                done();
            });
        });

        it("should give a 200 status when passing param as 'thisValue'", (done) => {
            request(app)
            .get("/testparamvalidator/thisValue")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });

    describe("Body Checker", () => {
        it("should give a 200 status with 'param' not being empty", (done) => {
            request(app)
            .post("/testbody")
            .send({param: "value"})
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    
        it("should give an error with 'param' being empty", (done) => {
            request(app)
            .post("/testbody")
            .send({})
            .then(response => {
                expect(response.statusCode).toBe(500);
                done();
            });
        });

        it("should give an error when passing 'param' different from 'thisValue'", (done) => {
            request(app)
            .post("/testbodyvalidator")
            .send({ param: "not this value" })
            .then(response => {
                expect(response.statusCode).toBe(500);
                done();
            });
        });

        it("should give a 200 status when passing param as 'thisValue'", (done) => {
            request(app)
            .post("/testbodyvalidator")
            .send({param: "thisValue"})
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });

        it("should give an error when body request does not respect the nested checker", (done) => {
            request(app)
            .post("/testbodynested")
            .send({param: { a: "valor", c: "não tem o b" }})
            .then(response => {
                expect(response.statusCode).toBe(500);
                done();
            });
        });

        it("should give a 200 status when body reqyest respect the nested checker", (done) => {
            request(app)
            .post("/testbodynested")
            .send({param: { a: "valor", b: 2 }})
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });

    });
   
});



function createServer() {
    
    const app = express();

    app.use(express.json());
    
    
    app.get("/testparam/:param",
        Check({ params: { param: { type: "string", nullable: false } } }),
        (req, res) => {
            return res.status(200).send();
        }
    );

    app.get("/testparamvalidator/:param",
        Check({ params: { param: { type: "string", nullable: false, validator: (param) => param === "thisValue" } } }),
        (req, res) => {
            return res.status(200).send();
        }
    );
    
    app.get("/testquery",
        Check({ query: { param: { type: "string", nullable: false } } }),
        (req, res) => {
            return res.status(200).send();
        }
    );

    app.get("/testqueryvalidator",
        Check({ query: { param: { type: "string", validator: (param) => param === "thisValue" } } }),
        (req, res) => {
            return res.status(200).send();
        }
    );
    
    app.post("/testbody",
        Check({ body: { param: { type: "string", nullable: false } } }),
        (req, res) => {
            return res.status(200).send();
        }
    );

    app.post("/testbodyvalidator",
        Check({ body: { param: { type: "string", validator: (param) => param === "thisValue" } } }),
        (req, res) => {
            return res.status(200).send();
        }
    );

    app.post("/testbodynested",
        Check({ body: {
            param: {
                type: {
                    a: {
                        type: "string"
                    },
                    b: {
                        type: "number"
                    }
                }
            }
        } }),
        (req, res) => {
            return res.status(200).send();
        }
    );

    
    app.use((err : ErrorRequestHandler, req : Request, res : Response, next : NextFunction) => {
        return res.status(500).send({errors: err, status: 500});
    });


    return app;
}
