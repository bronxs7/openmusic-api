const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, usersService, validator) {
    this.COLLABORATIONSSERVICE = collaborationsService;
    this.PLAYLISTSSERVICE = playlistsService;
    this.USERSSERVICE = usersService;
    this.VALIDATOR = validator;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this.VALIDATOR.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this.USERSSERVICE.getUserById(userId);
    await this.PLAYLISTSSERVICE.verifyPlaylistOwner(playlistId, credentialId);
    const collaborationId = await this.COLLABORATIONSSERVICE.addCollaboration(playlistId, userId);

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request) {
    this.VALIDATOR.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this.PLAYLISTSSERVICE.verifyPlaylistOwner(playlistId, credentialId);
    await this.COLLABORATIONSSERVICE.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
