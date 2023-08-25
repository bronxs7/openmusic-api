const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(albumsService, songsService, validator) {
    this.ALBUMSSERVICE = albumsService;
    this.SONGSSERVICE = songsService;
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

    return {
      status: 'success',
      data: {
        album: {
          id: album.id,
          name: album.name,
          year: album.year,
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
}

module.exports = AlbumsHandler;
