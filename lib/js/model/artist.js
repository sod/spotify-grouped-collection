require([
  '$api/models#Artist'
], function(artist) {

  /**
   * push every album into "albums" that is inside "tracks"
   *
   * @param {Array} artists
   * @param {models.Album[]} albums
   */
  function fetchDistinctArtists(artists, albums) {
    var object = {}, index = 0, length = albums.length, album, artist, pos;
    for(; index < length; index += 1) {
      album = albums[index];
      artist = album.artists && album.artists[0];
      pos = object[artist.uri];
      if(pos === undefined) {
        object[artist.uri] = pos = artists.length;
        artists.push(artist);
        artist.myAlbums = [];
      }
      artists[pos].myAlbums.push(album);
    }
  }

  /**
   * sort methods for Array.sort()
   *
   * @type {Object}
   */
  var artistSortMethod = {
    /**
     * sort artist by name (ascending)
     *
     * @param {models.Artist} artistA
     * @param {models.Artist} artistB
     * @returns {number}
     */
    byNameAsc: function(artistA, artistB) {
      if(!artistA.nameLowercase) { artistA.nameLowercase = String(artistA.name).toLowerCase(); }
      if(!artistB.nameLowercase) { artistB.nameLowercase = String(artistB.name).toLowerCase(); }
      return artistA.nameLowercase < artistB.nameLowercase ? -1 : 1;
    }
  };

  /**
   * load all artists and call doneFn if finished
   *
   * @param {models.Artist[]} artists
   * @param {Function} doneFn
   */
  function prefetchArtistData(artists, doneFn) {
    var index = 0, done = _.after(artists.length, function() {
      artists.sort(artistSortMethod.byNameAsc);
      doneFn && doneFn(artists);
    });

    for(; index < artists.length; index += 1) {
      artists[index].load('name', 'image').done(function() {
        done();
      });
    }
  }

  _.extend(exports, {
    /**
     * get all albums from a playlist
     *
     * @param {models.Album[]} albums
     * @param {Function} [doneFn]
     * @return {Array}
     */
    fromAlbums: function(albums, doneFn) {
      var artists = [];

      fetchDistinctArtists(artists, albums);
      prefetchArtistData(artists, doneFn);

      return artists;
    }
  });

});