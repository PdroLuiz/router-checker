import { Request, Response, NextFunction } from "express";

export interface Checker {
    body?: BodyChecker;
    query?: QueryChecker;
    params?: ParamsChecker;
}

export interface QueryChecker {
    [key : string]: QueryCheckerOption;
}

export interface ParamsChecker {
    [key : string]: ParamsCheckerOption;
}

export interface BodyChecker {
    [key : string]: BodyCheckerOption;
}   

export interface QueryCheckerOption {
    type: "string" | "number" | "date" | "boolean";
    nullable?: boolean;
    validator?: (param : any) => boolean;
}

export interface ParamsCheckerOption {
    type: "string" | "number" | "date" | "boolean";
    nullable?: boolean;
    validator?: (param : any) => boolean;
}

export interface BodyCheckerOption {
    type: "string" | "number" | "date" | "boolean" | "list" | BodyChecker;
    nullable?: boolean;
    validator?: (param : any) => boolean;
}

function CheckBody(body : any, option : BodyChecker, errors : Array<string>) {
    Object.keys(option).forEach(key => {
        
        const Property2Check = option[key];
        const Property = body[key];

        if (!Property2Check.nullable && Property == null) {
            errors.push(`missing property "${key}" in body request`);
        }

        const propertyType = typeof Property;

        if (["string", "number", "boolean"].includes(propertyType)) {
            if (Property2Check.type === "date") {
                isNaN(Date.parse(Property)) && errors.push(`property "${key}" expected type ${Property2Check.type} but got invalid date at body request`);
            } else {
                propertyType != Property2Check.type && errors.push(`property "${key}" expected type ${Property2Check.type} but got type ${propertyType} at body request`);
            }
        }

        if (propertyType === "object") {
            switch (Property2Check.type) {
                case "list": {
                    !(Property instanceof Array) && errors.push(`property "${key}" expected type ${Property2Check.type} but got type ${propertyType} at body request`);
                    break;
                }
                default: {
                    Property2Check.type instanceof Object && CheckBody(Property, Property2Check.type, errors);
                    break;
                }
            }
        }

        

        if (Property2Check.validator) {
            // checks if property exists
            Property && !Property2Check.validator(Property) && errors.push(`property "${key}" failed at validator function at body request`);
        }
    })
}

export function Check(params : Checker) {
    return (req : Request, res : Response, next : NextFunction) => {
        
        const errors = [];

        // Checks body request
        params.body && CheckBody(req.body, params.body, errors);

        // Checks query request
        params.query && Object.keys(params.query).forEach(key => {
            const Property2Check = params.query[key];
            const Property = req.query[key] as string;

            if (!Property2Check.nullable && Property == null) {
                errors.push(`missing property "${key}" in query request`);
            }

            if (Property) switch (Property2Check.type) {
                case "string": {
                    break;
                }
                case "number": {
                    if (isNaN(Number(Property))) {
                        errors.push(`property "${key}" is a invalid number at query request`);
                    }
                    break;
                }
                case "boolean": {
                    if (!["true", "false"].includes(Property)) {
                        errors.push(`property "${key}" is not true or false at query request`);
                    }
                    break;
                }
                case "date": {
                    isNaN(Date.parse(Property)) && errors.push(`property "${key}" is a invalid date at query request`);
                    break;
                }
            }

            if (Property2Check.validator) {
                // checks if property exists
                Property && !Property2Check.validator(Property) && errors.push(`property "${key}" failed at validator function at query request`);
            }

        });

        // Checks params request
        params.params && Object.keys(params.params).forEach(key => {
            const Property2Check = params.params[key];
            const Property = req.params[key];

            if (!Property2Check.nullable && Property == null) {
                errors.push(`missing property "${key}" in params request`);
            }

            if (Property) switch (Property2Check.type) {
                case "string": {
                    break;
                }
                case "number": {
                    if (isNaN(Number(Property))) {
                        errors.push(`property "${key}" is a invalid number at params request`);
                    }
                    break;
                }
                case "boolean": {
                    if (!["true", "false"].includes(Property)) {
                        errors.push(`property "${key}" is not true or false at params request`);
                    }
                    break;
                }
                case "date": {
                    isNaN(Date.parse(Property)) && errors.push(`property "${key}" is a invalid date at params request`);
                    break;
                }
            }

            if (Property2Check.validator) {
                // checks if property exists
                Property && !Property2Check.validator(Property) && errors.push(`property "${key}" failed at validator function at params request`);
            }

        });

        if (errors.length) throw errors;

        next();
    }
}
