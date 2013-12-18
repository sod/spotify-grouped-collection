require([
  '/lib/js/model/track'
], function(track) {

  /**
   * push every album into "albums" that is inside "tracks"
   *
   * @param {Array} albums
   * @param {models.Tracks[]} tracks
   */
  function fetchDistinctAlbums(albums, tracks) {
    var object = {}, index = 0, length = tracks.length, album;
    for(; index < length; index += 1) {
      album = tracks[index].album;
      if(object[album.uri] === undefined) {
        object[album.uri] = true;
        if(!album.name) {
          albums.push(album);
        }
      }
    }
  }

  /**
   * load all albums and call doneFn if finished
   *
   * @param {models.Album[]} albums
   * @param {Function} doneFn
   */
  function prefetchAlbumData(albums, doneFn) {
    var index = 0, done = _.after(albums.length, function() {
      doneFn && doneFn(albums);
    });
    for(; index < albums.length; index += 1) {
      albums[index].load('name').done(done);
    }
  }

  _.extend(exports, {
    /**
     * get all albums from a playlist
     *
     * @param {models.Playlist} playlist
     * @param {Function} [doneFn]
     * @return {Array}
     */
    fromPlaylist: function(playlist, doneFn) {
      var albums = [];

      track.fromPlaylist(playlist, function(tracks) {
        fetchDistinctAlbums(albums, tracks);
        prefetchAlbumData(albums, doneFn);
      });

      return albums;
    }
  });

});