const mapDBToAlbumModel = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});

const mapDBTomodel = ({
  id,
  title,
  genre,
  performer,
  duration,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  genre,
  performer,
  duration,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = { mapDBToAlbumModel, mapDBTomodel };
