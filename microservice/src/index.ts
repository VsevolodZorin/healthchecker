import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from "http";

const PORT = 5000;
const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.get(
  "/healthcheck",
  async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      console.log("--- healthcheck");
      // setTimeout(() => {
      //   return response.status(200).send({ msg: "ok" });
      // }, 5000);
      return response.status(200).send({ msg: "ok" });
    } catch (error) {
      console.log("--- healthcheck catch");
      return response.status(400).send(error.message);
    }
  }
);

server.listen(PORT);
server.on("listening", () => {
  console.log(`server listening on port: ${PORT}`);
});
server.on("error", (err) => {
  console.log(`server error: `, { err });
});
