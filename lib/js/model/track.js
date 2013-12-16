require([
  '/lib/js/snapshot',
  '$api/models#Playlist'
], function(snapshot, Playlist) {

  _.extend(exports, {
    /**
     * @param {models.Playlist} playlist
     * @param {Function} [doneFn]
     * @return {Array}
     */
    fromPlaylist: function(playlist, doneFn) {
      var tracks = [];
      if(playlist instanceof Playlist) {
        if(!playlist.tracks && playlist._collections) {
          playlist._collections();
        }
        if(playlist.tracks) {
          playlist.tracks.snapshot().done(snapshot.getCollector(tracks, doneFn));
        }
      }
      return tracks;
    }
  });

});