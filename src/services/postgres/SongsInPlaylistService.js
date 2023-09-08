const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToSongsModel } = require('../../utils');

class SongsInPlaylist {
  constructor(songsService) {
    this.POOL = new Pool();
    this.songsService = songsService;
  }

  async addSongInPlaylist(playlistId, songId) {
    await this.songsService.verifySong(songId);

    const id = `sip-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO songs_in_playlist VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this.POOL.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambhakan ke playlist');
    }

    return result.rows[0].id;
  }

  async getSongsInPlaylist(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer FROM songs_in_playlist
      RIGHT JOIN songs ON songs_in_playlist.song_id = songs.id
      WHERE songs_in_playlist.playlist_id = $1
      GROUP BY songs.id`,
      values: [playlistId],
    };

    const result = await this.POOL.query(query);

    return result.rows.map(mapDBToSongsModel);
  }

  async deleteSongInPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM songs_in_playlist WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this.POOL.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dihapus dari playlist');
    }
  }
}

module.exports = SongsInPlaylist;
