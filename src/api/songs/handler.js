const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator) {
    this.SERVICE = service;
    this.VALIDATOR = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this.VALIDATOR.validateSongPayload(request.payload);
    const {
      title, year, performer, genre, duration, albumId,
    } = request.payload;

    const songId = await this.SERVICE.addSong({
      title, year, performer, genre, duration, albumId,
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request) {
    const { title, performer } = request.query;

    if (!(title || performer)) {
      const songs = await this.SERVICE.getSongs();
      return {
        status: 'success',
        data: {
          songs,
        },
      };
    }

    const songs = await this.SERVICE.getSongsByQueryParam(title, performer);
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this.SERVICE.getSongById(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request) {
    this.VALIDATOR.validateSongPayload(request.payload);
    const { id } = request.params;

    await this.SERVICE.editSongById(id, request.payload);

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this.SERVICE.deleteSongById(id);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
