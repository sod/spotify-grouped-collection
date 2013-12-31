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
   * @param {models.Artist} artist
   * @returns {string}
   */
  function getArtistCharacter(artist) {
    return String(artist.name || '-')[0].toLowerCase();
  }

  /**
   *
   * @param {models.Artist[]} artists
   * @return {models.Artist[][]}
   */
  function groupArtists(artists) {
    var grouped = _.groupBy(artists, getArtistCharacter);
    var array = _.toArray(grouped);
    array.sort(function(left, right) {
      return (left[0]||0).name > (right[0]||0).name ? 1 : -1;
    });
    return array;
  }

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
        var grouped = groupArtists(artists);
        var char;
        var index = 0;
        for(; index < grouped.length; index += 1) {
          char = getArtistCharacter(grouped[index][0]);
          fragment.appendChild(dom.char(char, grouped[index]));
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