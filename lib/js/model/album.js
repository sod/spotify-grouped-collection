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
   * sort methods for Array.sort()
   *
   * @type {Object}
   */
  var albumSortMethod = {
    /**
     * sort list of albums by artist name (ascending) - if artists are the
     * same then sort by release date (descending)
     *
     * @param {models.Album} albumA
     * @param {models.Album} albumB
     * @returns {number}
     */
    byArtistAsc: function(albumA, albumB) {
      var artistA = String((albumA.artists[0] || {}).name || '').toLowerCase();
      var artistB = String((albumB.artists[0] || {}).name || '').toLowerCase();
      if(artistA === artistB) {
        return albumA.date < albumB.date ? 1 : -1;
      }
      if(artistA < artistB) return -1;
      if(artistA > artistB) return 1;
      return 0;
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
      albums.sort(albumSortMethod.byArtistAsc);
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