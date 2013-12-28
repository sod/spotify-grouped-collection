require([
  '$views/buttons'
], function(buttons) {

  var clas = {
    inset: {'class': 'shadow-inset'},
    image: {'class': 'image'},
    playButton: {'class': 'playButton'},
    album: {'class': 'album'}
  };

  _.extend(exports, {
    /**
     * @param models.Artist artist
     * @returns {(HTMLElement|String)[]}
     */
    artist: function(artist) {
      var name = crel('h2', crel('a', {href: artist.uri}, artist.name));
      var image = crel('div', {'class': 'artist-image', 'style': 'background-image:url(' + artist.imageForSize(300) + ')'});
      var albums = crel('div', {'class': 'albums'}, crel('ul', _.map(artist.myAlbums || [], exports.album)));
      var container = crel('div', {'class': 'artist'}, [name, image, albums]);

      return container;
    },

    /**
     * @param {models.Album} album
     * @returns {HTMLElement}
     */
    album: function(album) {
      var playButton = buttons.PlayButton.forItem(album);
      var imageHD = crel('img', {src: album.imageForSize(120), 'class': 'sp-image-style-rounded sp-image-style-embossed'});
      return album.element = crel('li', {'class': ''}, [
        crel('div', clas.image, crel('div', clas.inset, imageHD)),
        crel('div', clas.playButton, crel('a', {'class': 'center', href: album.uri}, playButton.node)),
        crel('div', clas.album, crel('a', {href: album.uri}, album.name))
      ]);
    }

  });

});