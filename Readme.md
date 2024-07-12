# App Backend with typescrypt, express, tsoa, swagger and yarn as package manager

# Documentation

https://tsoa-community.github.io/docs/introduction.html

https://expressjs.com/

https://yarnpkg.com/

# Create file `package.json`

- yarn init -y

# Add dependencies

- yarn add express tsoa swagger-ui-express dotenv

- yarn add -D typescript @types/node @types/express @types/swagger-ui-express  nodemon ts-node concurrently

# Create and initialize `tsconfig.json`

- yarn run tsc --init

# Create and configure `tsoa.json`

    {
        "entryFile": "src/app.ts",
        "noImplicitAdditionalProperties": "throw-on-extras",
        "controllerPathGlobs": ["src/controllers/**/*.controller.ts"],
        "spec": {
            "outputDirectory": "src/swagger",
            "specVersion": 3
        },
        "routes": {
            "routesDir": "src/routes"
        }
    }import { HelloWorld } from "../interfaces/HelloWorld";


# Create file `.env` (environment configuration variable)

    SERVER_PORT=5001

# Files organization

Create src directory and then in this directory create controllers, core, services, interfaces, routes, swagger, utils directories

    app-test
        |-- node_modules
        |-- src
            |-- controllers
            |-- core
            |-- services
            |-- interfaces
            |-- routes
            |-- swagger
            |-- app.ts
        |-- .env
        |-- nodemon.json
        |-- package.json
        |-- tsconfig.json
        |-- tsoa.json


# Create `app.ts` in /src

    import express, {Express, json, urlencoded, Response as ExResponse, Request as ExRequest} from "express";
    import { RegisterRoutes } from "./routes/routes";
    import dotenv from "dotenv";
    import swaggerUi from "swagger-ui-express";
    
    dotenv.config();
    
    export const app: Express = express();
    
    app.use(json());
    
    app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
        return res.send(swaggerUi.generateHTML(await import("./swagger/swagger.json")));
    });
    
    RegisterRoutes(app);
    
    const port = process.env.SERVER_PORT || 3000;
    
    app.listen(port, () =>
        console.log(`Server is listening at http://localhost:${port}`)
    );  

# In `app.ts`, exposing a /doc endpoint for swagger

    app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
        return res.send(
            swaggerUi.generateHTML(await import("../build/swagger.json"))
        );
    });

In order to dynamically import json files, set in `tsconfig.json` file:

    {
        "compilerOptions": {
            "resolveJsonModule": true
        }
    }

# Creating file `nodemon.json` and add this config

    {
        "watch": ["src/", ".env"],
        "ext": "js,json,ts",
        "exec": "concurrently \"npx tsc --watch\" \"ts-node src/app.ts\"",
        "ignore": [
            ".git",
            "node_modules/",
            ".dist/",
            "test/",
            "src/routes/routes.ts",
            "src/swagger/"
        ]
    }

# Adding a dev script in `package.json`

    "scripts": {
        "dev": "nodemon --config nodemon.json -x 'tsoa spec && tsoa routes && ts-node src/app.ts'"
    }

# Create a controller
    
    import {Controller, Get, Route, Security} from "tsoa";
    import {HelloWorldService} from "../services/hello-world.service";
    import {HelloWorld} from "../interfaces/HelloWorld";

    @Route("/")
    export class HelloWorldController extends Controller {

        public constructor(private helloWorldService: HelloWorldService = new HelloWorldService()) {
            super();
        }

        @Get("/")
        public async getAllUser(): Promise<HelloWorld> {
            return this.helloWorldService.get();
        }
    }

# Create a service

    import { HelloWorld } from "../interfaces/HelloWorld";

    export class HelloWorldService {

        public get(): HelloWorld {
            return {
                world: "Hello World"
            }
        }
    }

# Create an interface

    export interface HelloWorld {
        world: string
    }

# Start app

- yarn dev

and then open http://localhost:5000/docs/ to see swagger API

# Install node_modules (if not present)

- yarn install

# Build the routes file

- tsoa routes

# Generate OAS (OpenAPI Specification) for swagger

- tsoa spec

# JWT (if authentication is necessary)

In `tsoa.json` add in "spec":

    "securityDefinitions": {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }

and in "routes":

    "authenticationModule": "src/core/auth.core.ts"

and then create file `auth.core.ts` and add this function:

    export async function expressAuthentication (
        request: express.Request,
        securityName: string,
        scopes?: string[]
    ): Promise<string> {
    const token: string | undefined = request.header('Authorization')

        return await new Promise((resolve, reject) => {
            if (securityName === 'BearerAuth') {
                if (token) {
                    resolve(token); return
                } else {
                    reject(new Error('Token not present'))
                }
            }
            reject(new Error('Missing auth'))
        })
    }