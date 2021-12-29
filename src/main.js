const express = require('express');
const morgan = require('morgan');
const axios = require('axios');

async function getHardcodedSecret() {
  const store = 'mysecretstore';
  const key = 'mysecretkey';
  const url = `http://localhost:3500/v1.0/secrets/${store}/${key}`;
  return axios.get(url).then((x) => x.data);
}

async function main() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(morgan('dev'));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  /**
   * Rota da CRON...
   */
  app.post('/cron-executor', async (req, res) => {
    console.log('doing some magic...');
    const s = await getHardcodedSecret();
    console.log(`[${new Date().toISOString()}]: ${JSON.stringify(s)}`);
    res.sendStatus(200);
  });

  app.listen(port, () => {
    console.log(`app is running on localhost:${port}`);
  });
}

main();
