const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this.PRODUCERSERVICE = producerService;
    this.PLAYLISTSSERVICE = playlistsService;
    this.VALIDATOR = validator;

    autoBind(this);
  }

  async postExportPlaylistHandler(request, h) {
    this.VALIDATOR.validateExportPlaylistPayload(request.payload);

    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const message = {
      playlistId: request.params.id,
      targetEmail: request.payload.targetEmail,
    };

    await this.PLAYLISTSSERVICE.verifyPlaylistOwner(id, credentialId);
    await this.PRODUCERSERVICE.sendMessage('export:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
