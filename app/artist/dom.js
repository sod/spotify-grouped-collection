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
     * @param {String} char
     * @param {models.Artist[]} artists
     */
    char: function(char, artists) {
      char = String(char).toUpperCase();
      var headline = crel('h2', crel('a', {href:'#headline'}, char));
      var items = [];
      var index = 0;
      for(; index < artists.length; index += 1) {
        items.push(exports.artist(artists[index]));
      }
      items = crel('div', {'class': 'char'}, items);
      return crel('div', {id: char}, [headline, items]);
    },

    /**
     * @param models.Artist artist
     * @returns {(HTMLElement|String)[]}
     */
    artist: function(artist) {
      var name = crel('h3', crel('a', {href: artist.uri}, artist.name));
      var albums = crel('div', {'class': 'albums'}, crel('ul', _.map(artist.myAlbums || [], exports.album)));
      var container = crel('div', {'class': 'artist'}, [name, albums]);

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