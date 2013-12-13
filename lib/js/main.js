require([
  '$api/models',
  '$api/toplists',
  '$api/library'
], function(models, toplists, library) {
  window.models = models;
  window.toplists = toplists;
  window.library = library;

  /**
   * write all snapshots into array
   *
   * @param array
   * @param {Function} doneFn
   * @returns {Function}
   */
  function getSnapshotCollector(array, doneFn) {
    return function(snapshot) {
      var index = 0;
      var length = snapshot.length;
      for(; index < length; index += 1) {
        array.push(snapshot.get(index));
      }
      doneFn && doneFn(array);
    }
  }

  var app = window.app = {
    /**
     * @param {Function} [doneFn]
     * @return {Array}
     */
    getPlaylistsOfCurrentUser: function(doneFn) {
      var userLibrary = library.Library.forCurrentUser();
      var playlists = [];
      userLibrary.playlists.snapshot().done(getSnapshotCollector(playlists, doneFn));
      return playlists;
    },

    /**
     * @param {models.Playlist} playlist
     * @param {Function} [doneFn]
     * @return {Array}
     */
    getTracksOfPlaylist: function(playlist, doneFn) {
      var tracks = [];
      if(playlist instanceof models.Playlist) {
        if(!playlist.tracks && playlist._collections) {
          playlist._collections();
        }
        if(playlist.tracks) {
          playlist.tracks.snapshot().done(getSnapshotCollector(tracks, doneFn));
        }
      }
      return tracks;
    },

    /**
     * @param {models.Playlist} playlist
     * @param {Function} [doneFn]
     * @return {Array}
     */
    getAlbumsOfPlaylist: function(playlist, doneFn) {
      var object = {}, albums = [];

      function fetchDistinctAlbums(tracks) {
        var index = 0, length = tracks.length, album;
        for(; index < length; index += 1) {
          album = tracks[index].album;
          if(!object[album.uri]) {
            object[album.uri] = true;
            albums.push(album);
          }
        }
      }

      function loadAlbums() {
        var index = 0, length = albums.length, done = _.after(length, function() {
          doneFn && doneFn(albums);
        });
        for(; index < length; index += 1) {
          albums[index].load('name').done(done);
        }
      }

      app.getTracksOfPlaylist(playlist, function(tracks) {
        fetchDistinctAlbums(tracks);
        loadAlbums();
      });

      return albums;
    }
  }
});