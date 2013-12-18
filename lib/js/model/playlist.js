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
      userLibrary.playlists.snapshot().done(snapshot.getCollector(playlists, function(playlists) {
        var index = playlists.length - 1;

        for(; index >= 0; index -= 1) {
          if(playlists[index].owner.uri !== 'spotify:user:@') {
            playlists.splice(index, 1);
          }
        }
        doneFn && doneFn(playlists);
      }));
      return playlists;
    }
  });

});