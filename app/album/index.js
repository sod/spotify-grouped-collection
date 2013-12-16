require([
  '/app/album/dom',
  '/lib/js/model/playlist',
  '/lib/js/model/album',
  '/lib/js/searchIndex'
], function(dom, playlist, album, searchIndex) {

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
      var fragment = dom.allByPlaylist(collections, playlists);
      domAlbums.innerHTML = '';
      domAlbums.appendChild(fragment);
      setTimeout(function() {
        domFilter.addEventListener('input', searchIndex.build(_.flatten(collections)).filter);

        // debug
        window['public'] = {
          collections: collections,
          playlist: playlists,
          album: collections[0][0]
        };
      });
    });
    _.each(playlists, function(playlist) {
      collections.push(album.fromPlaylist(playlist, doneFn));
    });
  });

});