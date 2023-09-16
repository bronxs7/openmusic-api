/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // assign constraint foreign key for user_id and album_id column in user_album_likes
  pgm.addConstraint('user_album_likes', 'fk_user_album_likes.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('user_album_likes', 'fk_user_album_likes.album_id_albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus constraint fk_user_album_likes.user_id_users.id
  // dan fk_user_album_likes.album_id_albums.id pada tabel user_album_likes
  pgm.dropConstraint('user_album_likes', 'fk_user_album_likes.user_id_users.id');
  pgm.dropConstraint('user_album_likes', 'fk_user_album_likes.album_id_albums.id');
};
