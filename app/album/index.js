require([
  '/lib/js/dom/app',
  '/app/album/dom',
  '/lib/js/model/playlist',
  '/lib/js/model/album',
  '/lib/js/searchIndex'
], function(app, dom, libPlaylist, libAlbum, libSearchIndex) {

  var domAlbums = document.getElementById('albums');
  var domFilter = document.getElementById('filter');

  /**
   * application controller
   * fetch playlist and render them, attach event listeners
   *
   * @type {Array}
   */
  libPlaylist.fromCurrentUser(function(playlists) {
    var collections = [];
    var doneFn = _.after(playlists.length, function() {
      var fragment = dom.playlist(collections, playlists);
      domAlbums.innerHTML = '';
      domAlbums.appendChild(fragment);
      app.loading(false);
      setTimeout(function() {
        domFilter.addEventListener('input', libSearchIndex.build(_.flatten(collections), function() {
          libSearchIndex.checkForEmptyContainer('.playlist', 'ul > li[class=""]', 'playlist');
        }).filter);
      });
    });
    _.each(playlists, function(playlist) {
      collections.push(libAlbum.fromPlaylist(playlist, doneFn));
    });
  });

});