require([
  '$views/buttons'
], function(buttons) {

  var clas = {
    empty: {'class': ''},
    inset: {'class': 'shadow-inset'},
    playlist: {'class': 'playlist'},
    image: {'class': 'image'},
    playButton: {'class': 'playButton'},
    artist: {'class': 'artist'},
    album: {'class': 'album'}
  };

  _.extend(exports, {
    /**
     * @param models.Artist[] artists
     * @returns {(HTMLElement|String)[]}
     */
    artist: function(artists) {
      var index = 0,
        dom = [];

      for(; index < artists.length; index += 1) {
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
      var image = crel('img', {src: album.imageForSize(64), 'data-src-hd': album.imageForSize(128), 'class': 'sp-image-style-rounded sp-image-style-embossed'});
      return [
        crel('div', clas.image, crel('div', clas.inset, image)),
        crel('div', clas.playButton, crel('a', {'class': 'center', href: album.uri}, playButton.node)),
        crel('div', clas.artist, exports.artist(album.artists)),
        crel('div', clas.album, crel('a', {href: album.uri}, album.name))
      ];
    },

    /**
     * build dom fragment from collection of playlists
     *
     * @param {models.Album[][]} collections
     * @param {models.Playlist[]} playlists
     * @return DocumentFragment
     */
    playlist: function(collections, playlists) {
      var fragment = document.createDocumentFragment();
      _.each(collections, function(collection, index) {
        var playlist = playlists[index],
          dom = [];
        _.each(collection, function(album) {
          var element = crel('li', clas.empty, exports.album(album));
          album.elements.push(element);
          dom.push(element);
        });
        fragment.appendChild(crel('div', clas.playlist, [crel('h2', playlist.name), crel('ul', dom)]));
      });
      return fragment;
    }
  });

});