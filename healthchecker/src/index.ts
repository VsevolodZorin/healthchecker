import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import { createDatabase } from 'typeorm-extension';
import db from 'src/db';
import { config } from 'src/config';
import servicesRoutes from 'src/routes/healthcheck.routes';

const httpPort = config.app.port || 80;
const httpsPort = 443;
const app = express();
let server: http.Server | https.Server;

(async () => {
  await createDatabase({
    options: config.orm,
    ifNotExist: true,
  });
  db.initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization:', err);
    });
})();

app.use(bodyParser.json());
app.use('/services', servicesRoutes);

try {
  // for google mail

  // cert - the certificate
  // ca - the CA bundle (chain) provided in one file or as an array
  // key - the private key

  // example from deploed server
  //   const sslKey = fs.readFileSync(
  //     '/etc/letsencrypt/live/***/privkey.pem',
  //   );

  let httpsOptions = {
    cert: fs.readFileSync('./ssl/example.crt'),
    ca: fs.readFileSync('./ssl/example.ca-bundle'),
    key: fs.readFileSync('./ssl/example.key'),
  };

  server = https.createServer(httpsOptions, app);
  server.listen(httpsPort);
} catch (e) {
  server = http.createServer(app);
  server.listen(httpPort);
}

server.on('listening', () => {
  console.log(`server listening on port: ${config.app.port}`);
});
server.on('error', (err) => {
  console.log(`server error: `, { err });
});
