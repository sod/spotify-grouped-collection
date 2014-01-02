require([
  '/lib/js/dom/app',
  '/app/playlist/dom',
  '/lib/js/model/playlist',
  '/lib/js/model/album',
  '/lib/js/searchIndex',
  'strings/main.lang'
], function(app, dom, libPlaylist, libAlbum, libSearchIndex, translate) {

  var domPlaylists = document.getElementById('playlists');
  var domFilter = document.getElementById('filter');
  var domFilterError = document.getElementById('filter-error');

  /**
   * application controller
   * - fetch playlists and render them
   * - attach filter event listener
   *
   * @type {Array}
   */
  libPlaylist.fromCurrentUser(function(playlists) {
    var collections = [];
    var doneFn = _.after(playlists.length, function() {
      var fragment = dom.playlist(collections, playlists);
      domPlaylists.innerHTML = '';
      domPlaylists.appendChild(fragment);
      app.loading(false);
      setTimeout(function() {
        domFilter.addEventListener('input', libSearchIndex.build(_.flatten(collections), function() {
          var visibleElements = libSearchIndex.checkForEmptyContainer('.playlist', 'ul > li[class=""]', 'playlist');
          domFilterError.innerHTML = visibleElements.length ? '' : translate.get('error_no_results');
        }).filter);
      });
    });
    if(!playlists.length) {
      return app.errorNoTracks();
    }
    _.each(playlists, function(playlist) {
      collections.push(libAlbum.fromPlaylist(playlist, doneFn));
    });
  });

});