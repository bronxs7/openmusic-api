const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class UserAlbumLikesService {
  constructor(albumsService, cacheService) {
    this.POOL = new Pool();
    this.ALBUMSSERVICE = albumsService;
    this.CACHESERVICE = cacheService;
  }

  async addAlbumLikes(userId, albumId) {
    await this.ALBUMSSERVICE.verifyAlbum(albumId);
    await this.verifyAlbumLikes(userId, albumId);

    const id = `ual-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this.POOL.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Like gagal ditambahkan');
    }

    await this.CACHESERVICE.delete(`likes:${albumId}`);
    return result.rows[0].id;
  }

  async verifyAlbumLikes(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this.POOL.query(query);

    if (result.rows.length) {
      throw new InvariantError('Anda sudah like album ini');
    }
  }

  async getAlbumLikes(albumId) {
    try {
      const result = await this.CACHESERVICE.get(`likes:${albumId}`);
      return {
        likes: JSON.parse(result),
        cache: 1,
      };
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this.POOL.query(query);
      const { count } = result.rows[0];

      await this.CACHESERVICE.set(`likes:${albumId}`, JSON.stringify(parseInt(count, 10)), 1800);
      return {
        likes: parseInt(count, 10),
      };
    }
  }

  async deleteAlbumLikes(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this.POOL.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Like gagal dihapus, like tidak ditemukan di album ini');
    }

    await this.CACHESERVICE.delete(`likes:${albumId}`);
  }
}

module.exports = UserAlbumLikesService;
