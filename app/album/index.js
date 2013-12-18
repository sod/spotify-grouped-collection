require([
  '/app/album/dom',
  '/lib/js/dom/app',
  '/lib/js/model/playlist',
  '/lib/js/model/album',
  '/lib/js/searchIndex'
], function(dom, app, playlist, album, libSearchIndex) {

  var domAlbums = document.getElementById('albums');
  var domFilter = document.getElementById('filter');

  /**
   * disable link behind play button if the play button was pressed
   */
  domAlbums.addEventListener('click', function(event) {
    if(event.target && /sp-button-play/.test(event.target.className)) {
      event.preventDefault();
    }
  });

  /**
   * application controller
   * fetch playlist and render them, attach event listeners
   *
   * @type {Array}
   */
  playlist.fromCurrentUser(function(playlists) {
    var collections = [];
    var doneFn = _.after(playlists.length, function() {
      var fragment = dom.playlist(collections, playlists);
      domAlbums.innerHTML = '';
      domAlbums.appendChild(fragment);
      app.loading(false);
      setTimeout(function() {
        domFilter.addEventListener('input', libSearchIndex.build(_.flatten(collections)).filter);


        // debug
        require( [
          '$api/models',
          '$views/buttons',
          '$views/list'
        ], function(models, buttons, list) {
          window.debug = {
            collections: collections,
            playlist: playlists,
            album: collections[0][0],
            models: models,
            buttons: buttons,
            list: list
          };
          window.console && window.console.log('window.debug', window.debug);
        } );

      });
    });
    _.each(playlists, function(playlist) {
      collections.push(album.fromPlaylist(playlist, doneFn));
    });
  });

});