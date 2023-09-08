/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // assign constraint foreign key for album_id column to albums.id
  pgm.addConstraint('songs', 'fk_songs.album_id_albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus constraint fk_notes.owner_users.id pada tabel notes
  pgm.dropConstraint('songs', 'fk_songs.album_id_albums.id');
};
