import { AppDataSource } from './data-source';

AppDataSource.initialize()
  .then(async () => {
    console.log('init done');
  })
  .catch((error) => console.log(error));
