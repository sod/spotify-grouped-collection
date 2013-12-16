require([
  '$views/buttons'
], function(buttons) {

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
      return [
        crel('div', {'class': 'image'}, [crel('img', {src: album.imageForSize(300), class: 'sp-image-style-rounded sp-image-style-embossed'})]),
        crel('div', {'class': 'playButton'}, crel('a', {'class': 'center', href: album.uri}, playButton.node)),
        crel('div', {'class': 'artist'}, exports.artist(album.artists)),
        crel('div', {'class': 'album'}, crel('a', {href: album.uri}, album.name))
      ];
    },

    /**
     * build dom fragment from collection of playlists
     *
     * @param {models.Album[][]} collections
     * @param {models.Playlist[]} playlists
     * @return DocumentFragment
     */
    allByPlaylist: function(collections, playlists) {
      var fragment = document.createDocumentFragment();
      _.each(collections, function(collection, index) {
        var playlist = playlists[index],
          dom = [];
        _.each(collection, function(album) {
          var element = crel('li', {'class': ''}, exports.album(album));
          album.element = element;
          dom.push(element);
        });
        fragment.appendChild(crel('div', {'class': 'playlist'}, [crel('h2', playlist.name), crel('ul', dom)]));
      });
      return fragment;
    }
  });

});