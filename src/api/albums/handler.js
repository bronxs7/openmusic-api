const autoBind = require('auto-bind');
const config = require('../../utils/config');

class AlbumsHandler {
  constructor(albumsService, songsService, storageService, userAlbumLikesService, validator) {
    this.ALBUMSSERVICE = albumsService;
    this.SONGSSERVICE = songsService;
    this.STORAGESERVICE = storageService;
    this.USERALBUMLIKESSERVICE = userAlbumLikesService;
    this.VALIDATOR = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this.VALIDATOR.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;
    const albumId = await this.ALBUMSSERVICE.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this.ALBUMSSERVICE.getAlbumById(id);
    const songs = await this.SONGSSERVICE.getSongByAlbumId(id);
    let url = album.cover;

    if (album.cover) {
      url = `http://${config.app.host}:${config.app.port}/albums/file/images/${album.cover}`;
    }

    return {
      status: 'success',
      data: {
        album: {
          id: album.id,
          name: album.name,
          year: album.year,
          coverUrl: url,
          songs,
        },
      },
    };
  }

  async putAlbumByIdHandler(request) {
    const { id } = request.params;
    this.VALIDATOR.validateAlbumPayload(request.payload);
    await this.ALBUMSSERVICE.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this.ALBUMSSERVICE.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async uploadAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;

    await this.VALIDATOR.validateAlbumCoverPayload(cover.hapi.headers);

    const filename = await this.STORAGESERVICE.writeFile(cover, cover.hapi);
    await this.ALBUMSSERVICE.addCoverAlbum(id, filename);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }

  async postAlbumLikesHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this.USERALBUMLIKESSERVICE.addAlbumLikes(userId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil dilike',
    });
    response.code(201);
    return response;
  }

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;

    const { likes, cache } = await this.USERALBUMLIKESSERVICE.getAlbumLikes(albumId);
    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });

    if (cache) {
      response.header('X-Data-Source', 'cache');
    }
    return response;
  }

  async deleteAlbumLikesHandler(request) {
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this.USERALBUMLIKESSERVICE.deleteAlbumLikes(userId, albumId);

    return {
      status: 'success',
      message: 'Like di Album berhasil di hapus',
    };
  }
}

module.exports = AlbumsHandler;
