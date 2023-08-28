const autoBind = require('auto-bind');

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this.AUTHENTICATIONSSERVICE = authenticationsService;
    this.USERSSERVICE = usersService;
    this.TOKENMANAGER = tokenManager;
    this.VALIDATOR = validator;

    autoBind(this);
  }

  async postAuthenticationHandler(request, h) {
    this.VALIDATOR.validatePostAuthenticationPayload(request.payload);

    const { username, password } = request.payload;
    const id = await this.USERSSERVICE.verifyUserCredential(username, password);

    const accessToken = this.TOKENMANAGER.generateAccessToken({ id });
    const refreshToken = this.TOKENMANAGER.generateRefreshToken({ id });

    await this.AUTHENTICATIONSSERVICE.addRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request, h) {
    this.VALIDATOR.validatePutAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;
    await this.AUTHENTICATIONSSERVICE.verifyRefreshToken(refreshToken);
    const { id } = this.TOKENMANAGER.verifyRefreshToken(refreshToken);

    const accessToken = this.TOKENMANAGER.generateAccessToken({ id });
    return {
      status: 'success',
      message: 'Access token berhasil diperbarui',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request, h) {
    this.VALIDATOR.validateDeleteAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;
    await this.AUTHENTICATIONSSERVICE.verifyRefreshToken(refreshToken);
    await this.AUTHENTICATIONSSERVICE.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    };
  }
}

module.exports = AuthenticationsHandler;
