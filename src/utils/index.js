const mapDBToAlbumModel = ({
  id,
  name,
  year,
  cover,
}) => ({
  id,
  name,
  year,
  cover,
});

const mapDBToSongModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  createdAt: created_at,
  updatedAt: updated_at,
});

const mapDBToSongsModel = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

const mapDBToPlaylistModel = ({
  id,
  name,
  username,
}) => ({
  id,
  name,
  username,
});

const mapDBToActivityModel = ({
  username,
  title,
  action,
  time,
}) => ({
  username,
  title,
  action,
  time,
});

module.exports = {
  mapDBToAlbumModel,
  mapDBToSongModel,
  mapDBToSongsModel,
  mapDBToPlaylistModel,
  mapDBToActivityModel,
};
