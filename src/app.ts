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