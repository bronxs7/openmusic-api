const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { mapDBToPlaylistModel } = require('../../utils');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoudError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class playlistsService {
  constructor(collaborationsService) {
    this.POOL = new Pool();
    this.COLLABORATIONSSERVICE = collaborationsService;
  }

  async addPlaylist({ name, owner }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this.POOL.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.*, users.username FROM playlists 
      LEFT JOIN users ON playlists.owner = users.id
      LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id
      WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [owner],
    };

    const result = await this.POOL.query(query);

    return result.rows.map(mapDBToPlaylistModel);
  }

  async getPlaylistById(id) {
    const query = {
      text: 'SELECT playlists.*, users.username FROM playlists LEFT JOIN users ON playlists.owner = users.id WHERE playlists.id = $1',
      values: [id],
    };

    const result = await this.POOL.query(query);

    return result.rows.map(mapDBToPlaylistModel)[0];
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this.POOL.query(query);

    if (!result.rows.length) {
      throw new NotFoudError('Playlist gagal dihapus, id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this.POOL.query(query);

    if (!result.rows.length) {
      throw new NotFoudError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoudError) {
        throw error;
      }

      try {
        await this.COLLABORATIONSSERVICE.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = playlistsService;
