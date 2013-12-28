require([
  '/lib/js/dom/app',
  '/app/artist/dom',
  '/lib/js/model/playlist',
  '/lib/js/model/artist',
  '/lib/js/model/album',
  '/lib/js/searchIndex'
], function(app, dom, libPlaylist, libArtist, libAlbum, libSearchIndex) {

  var domArtists = document.getElementById('artists');
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
      var albums = _.flatten(collections);
      libArtist.fromAlbums(albums, function(artists) {
        var fragment = document.createDocumentFragment();
        var index = 0;
        for(; index < artists.length; index += 1) {
          fragment.appendChild(dom.artist(artists[index]));
        }
        domArtists.appendChild(fragment);
        app.loading(false);
        setTimeout(function() {
          domFilter.addEventListener('input', libSearchIndex.build(albums, function() {
            libSearchIndex.checkForEmptyContainer('.artist', 'ul > li[class=""]', 'artist');
          }).filter);
        });
      });

    });
    _.each(playlists, function(playlist) {
      collections.push(libAlbum.fromPlaylist(playlist, doneFn));
    });
  });

});