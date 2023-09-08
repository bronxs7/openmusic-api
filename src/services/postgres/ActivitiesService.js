const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToActivityModel } = require('../../utils');

class ActivitiesService {
  constructor() {
    this.POOL = new Pool();
  }

  async addActivity(playlistId, credentialId, songId) {
    const id = nanoid(16);
    const time = new Date().toISOString();
    const action = 'add';

    const query = {
      text: 'INSERT INTO activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, credentialId, songId, action, time],
    };

    await this.POOL.query(query);
  }

  async deleteActivity(playlistId, credentialId, songId) {
    const id = nanoid(16);
    const time = new Date().toISOString();
    const action = 'delete';

    const query = {
      text: 'INSERT INTO activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, credentialId, songId, action, time],
    };

    await this.POOL.query(query);
  }

  async getActivitiesByPlaylistId(playlistId) {
    const query = {
      text: `SELECT users.username, songs.title, activities.action, activities.time FROM activities
      JOIN users ON users.id = activities.user_id
      JOIN songs ON songs.id = activities.song_id
      WHERE activities.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this.POOL.query(query);

    return result.rows.map(mapDBToActivityModel);
  }
}

module.exports = ActivitiesService;
