import './LoadEnv'; // Must be the first import
import { createConnection } from 'typeorm';
import app from '@server';
import logger from '@shared/Logger';
import { initRepository } from '@shared/repositories';

createConnection()
  .then(async connection => {
    // init repositories
    initRepository();

    // Start the server
    const port = Number(process.env.PORT || 4000);
    app.listen(port, () => {
      logger.info('Express server started on port: ' + port);
    });
  })
  .catch(error => console.log(error));
