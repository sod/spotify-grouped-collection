require([
  '/lib/js/snapshot',
  '$api/library#Library'
], function(snapshot, Library) {

  _.extend(exports, {
    /**
     * @param {Function} [doneFn]
     * @return {Array}
     */
    fromCurrentUser: function(doneFn) {
      var userLibrary = Library.forCurrentUser();
      var playlists = [];
      userLibrary.playlists.snapshot().done(snapshot.getCollector(playlists, doneFn));
      return playlists;
    }
  });

});