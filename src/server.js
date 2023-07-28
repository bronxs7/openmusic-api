require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/music');
const AlbumsService = require('./services/inMemory/AlbumsService');
const AlbumsValidator = require('./validator/albums');

const init = async () => {
  const albumsService = new AlbumsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumsValidator,
    },
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
