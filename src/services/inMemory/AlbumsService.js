const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this.ALBUM = [];
  }

  addAlbum({ name, year }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newAlbum = {
      name, year, id, createdAt, updatedAt,
    };

    this.ALBUM.push(newAlbum);

    const isSuccess = this.ALBUM.filter((album) => album.id === id).length > 0;
    if (!isSuccess) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return id;
  }

  getAlbums() {
    return this.ALBUM;
  }

  getAlbumById(id) {
    const album = this.ALBUM.filter((n) => n.id === id)[0];
    if (!album) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    return album;
  }

  editAlbumById(id, { name, year }) {
    const index = this.ALBUM.findIndex((album) => album.id === id);

    if (index === -1) {
      throw new NotFoundError('Gagal memperbarui album, Id tidak ditemukan');
    }

    const updatedAt = new Date().toISOString();

    this.ALBUM[index] = {
      ...this.ALBUM[index],
      name,
      year,
      updatedAt,
    };
  }

  deleteAlbumById(id) {
    const index = this.ALBUM.findIndex((album) => album.id === id);

    if (index === -1) {
      throw new NotFoundError('Album gagal dihapus, Id tidak ditemukan');
    }

    this.ALBUM.splice(index, 1);
  }
}

module.exports = AlbumsService;
