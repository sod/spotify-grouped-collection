require([
  '/lib/js/model/track'
], function(track) {

  var empty = {name: ''};

  /**
   * push every album into "albums" that is inside "tracks"
   *
   * @param {Array} albums
   * @param {models.Tracks[]} tracks
   * @param {Object} distinctCache
   */
  function fetchDistinctAlbums(albums, tracks, distinctCache) {
    var index = 0, length = tracks.length, album;
    for(; index < length; index += 1) {
      album = tracks[index].album;
      if(distinctCache[album.uri] === undefined) {
        distinctCache[album.uri] = true;
        albums.push(album);
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
     * Fasted way to sort here ... tested on jsperf: http://jsperf.com/sort-lowercase-un-cached
     *
     * @param {models.Album} albumA
     * @param {models.Album} albumB
     * @returns {number}
     */
    byArtistAsc: function(albumA, albumB) {
      var artistA = albumA.artists[0] || empty;
      var artistB = albumB.artists[0] || empty;
      if(artistA === artistB) { return albumA.date < albumB.date ? 1 : -1; }
      if(!artistA.nameLowercase) { artistA.nameLowercase = String(artistA.name).toLowerCase(); }
      if(!artistB.nameLowercase) { artistB.nameLowercase = String(artistB.name).toLowerCase(); }
      return artistA.nameLowercase < artistB.nameLowercase ? -1 : 1;
    }
  };

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

    if(!albums.length) {
      doneFn && doneFn(albums);
      return;
    }

    for(; index < albums.length; index += 1) {
      albums[index].elements = [];
      albums[index].load('name').done(function() {
        done();
      });
    }
  }

  _.extend(exports, {
    /**
     * get all albums from a playlist
     *
     * @param {models.Playlist} playlist
     * @param {Function} [doneFn]
     * @param {Object} [distinctCache]
     * @return {Array}
     */
    fromPlaylist: function(playlist, doneFn, distinctCache) {
      var albums = [];

      track.fromPlaylist(playlist, function(tracks) {
        fetchDistinctAlbums(albums, tracks, distinctCache || {});
        prefetchAlbumData(albums, doneFn);
      });

      return albums;
    }
  });

});