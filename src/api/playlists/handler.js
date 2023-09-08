const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(playlistsService, songsInPlaylistService, activitiesService, validator) {
    this.PLAYLISTSSERVICE = playlistsService;
    this.SONGSINPLAYLISTSERVICE = songsInPlaylistService;
    this.ACTIVITIESSERVICE = activitiesService;
    this.VALIDATOR = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this.VALIDATOR.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this.PLAYLISTSSERVICE.addPlaylist({ name, owner: credentialId });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this.PLAYLISTSSERVICE.getPlaylists(credentialId);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.PLAYLISTSSERVICE.verifyPlaylistOwner(id, credentialId);
    await this.PLAYLISTSSERVICE.deletePlaylistById(id);
    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postSongToPlaylistHandler(request, h) {
    this.VALIDATOR.validateSongInPlaylistPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;

    await this.PLAYLISTSSERVICE.verifyPlaylistOwner(playlistId, credentialId);
    await this.SONGSINPLAYLISTSERVICE.addSongInPlaylist(playlistId, songId);
    await this.ACTIVITIESSERVICE.addActivity(playlistId, credentialId, songId);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan di playlist',
    });
    response.code(201);
    return response;
  }

  async getSongsInPlaylistHandler(request) {
    const { id: playlistId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this.PLAYLISTSSERVICE.verifyPlaylistOwner(playlistId, userId);
    const playlist = await this.PLAYLISTSSERVICE.getPlaylistById(playlistId);
    const songs = await this.SONGSINPLAYLISTSERVICE.getSongsInPlaylist(playlistId);

    return {
      status: 'success',
      data: {
        playlist: {
          id: playlist.id,
          name: playlist.name,
          username: playlist.username,
          songs,
        },
      },
    };
  }

  async deleteSongInPlaylistHandler(request) {
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: userId } = request.auth.credentials;

    await this.PLAYLISTSSERVICE.verifyPlaylistOwner(playlistId, userId);
    await this.SONGSINPLAYLISTSERVICE.deleteSongInPlaylist(playlistId, songId);
    await this.ACTIVITIESSERVICE.deleteActivity(playlistId, userId, songId);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }

  async getPlaylistActivitiesHandler(request) {
    const { id: playlistId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this.PLAYLISTSSERVICE.verifyPlaylistOwner(playlistId, userId);
    const playlist = await this.PLAYLISTSSERVICE.getPlaylistById(playlistId);
    const activities = await this.ACTIVITIESSERVICE.getActivitiesByPlaylistId(playlistId);

    return {
      status: 'success',
      data: {
        playlistId: playlist.id,
        activities,
      },
    };
  }
}

module.exports = PlaylistsHandler;
