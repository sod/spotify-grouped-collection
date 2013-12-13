require([
  '$views/buttons'
], function(buttons) {

  window.buttons = buttons;

  var domAlbums = document.getElementById('albums');
  var domFilter = document.getElementById('filter');
  var filter;
  var playlists;
  var collections = window.collections = [];

  /**
   * disable link behind play button if the play button was pressed
   */
  domAlbums.addEventListener('click', function(event) {
    if(event.target && /sp-button-play/.test(event.target.className)) {
      event.preventDefault();
    }
  });

  var render = {
    /**
     *
     * @param models.Artist[] artists
     * @returns {(HTMLElement|String)[]}
     */
    artist: function (artists) {
      var index = 0, length = artists.length, dom = [];
      for(; index < length; index += 1) {
        dom.push(crel('a', {href: artists[index].uri}, artists[index].name));
        dom.push(', ');
      }
      dom.pop();
      return dom;
    },

    /**
     * @param {models.Album} album
     * @returns {HTMLElement[]}
     */
    album: function(album) {
      var playButton = buttons.PlayButton.forItem(album);
      window.playButton = playButton;
      return [
        crel('div', {'class': 'image'}, [crel('img', {src: album.imageForSize(300)})]),
        crel('div', {'class': 'playButton'}, crel('a', {'class': 'center', href: album.uri}, playButton.node)),
        crel('div', {'class': 'artist'}, render.artist(album.artists)),
        crel('div', {'class': 'album'}, crel('a', {href: album.uri}, album.name))
      ];
    }
  };

  /**
   * build dom fragment from collection of playlists
   */
  function buildDom(collections) {
    window.album = collections[0][0];
    var fragment = document.createDocumentFragment();
    _.each(collections, function(collection, index) {
      var playlist = playlists[index],
        dom = [];
      _.each(collection, function(album) {
        var element = crel('li', {'class': ''}, render.album(album));
        album.element = element;
        dom.push(element);
      });
      fragment.appendChild(crel('div', {'class': 'playlist'}, [crel('h2', playlist.name), crel('ul', dom)]));
    });
    return fragment;
  }

  /**
   * application controller
   * fetch playlist and render them, attach event listeners
   *
   * @type {Array}
   */
  playlists = app.getPlaylistsOfCurrentUser(function() {
    var doneFn = _.after(playlists.length, function() {
      domFilter.addEventListener('input', getSearchIndex(_.flatten(collections)).filter);
      var fragment = buildDom(collections);
      domAlbums.innerHTML = '';
      domAlbums.appendChild(fragment);
    });
    _.each(playlists, function(playlist) {
      collections.push(app.getAlbumsOfPlaylist(playlist, doneFn));
    });
  });

});