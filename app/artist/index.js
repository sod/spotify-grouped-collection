require([
  '/lib/js/dom/app',
  '/app/artist/dom',
  '/lib/js/model/playlist',
  '/lib/js/model/artist',
  '/lib/js/model/album',
  '/lib/js/searchIndex',
  'strings/main.lang'
], function(app, dom, libPlaylist, libArtist, libAlbum, libSearchIndex, translate) {

  var domArtists = document.getElementById('artists');
  var domFilter = document.getElementById('filter');
  var domFilterError = document.getElementById('filter-error');
  var isChar = /[a-z]/;

  /**
   * @param {models.Artist} artist
   * @returns {string} character one of a-z or #
   */
  function getArtistCharacter(artist) {
    var char = String(artist.name || '-')[0].toLowerCase();
    return isChar.test(char) ? char : '#';
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

  function getCharacterFromElement(element) {
    return element.id;
  }

  /**
   * @param {Array} visibleCharacters
   */
  var updateNavigation = (function() {
    var visible = [];
    var on = 'on';
    var off = 'off';
    var getCharacterFromHref = /#(.*)$/;
    var characters = _.map(document.querySelectorAll('#navigation a'), function(element) {
      return {
        char: (getCharacterFromHref.exec(element.href)||' #')[1],
        element: element
      };
    });
    function update() {
      var index = 0;
      for(; index < characters.length; index += 1) {
        characters[index].element.className = visible.indexOf(characters[index].char) !== -1 ? on : off;
      }
    }

    return function(visibleCharacters) {
      visible = visibleCharacters || [];
      requestAnimationFrame(update);
    };
  }());

  /**
   * application controller
   * - fetch artists from user playlists and render them
   * - attach filter event listener
   * - initialize navigation
   *
   * @type {Array}
   */
  libPlaylist.fromCurrentUser(function(playlists) {
    var distinctCache = {};
    var collections = [];
    var doneFn = _.after(playlists.length, function() {
      var albums = _.flatten(collections);
      libArtist.fromAlbums(albums, function(artists) {
        var char;
        var index = 0;
        var fragment = document.createDocumentFragment();
        var grouped = groupArtists(artists);
        for(; index < grouped.length; index += 1) {
          char = getArtistCharacter(grouped[index][0]);
          fragment.appendChild(dom.char(char, grouped[index]));
        }
        domArtists.appendChild(fragment);
        updateNavigation(_.map(libSearchIndex.checkForEmptyContainer('#artists > div', 'div[class="artist"]'), getCharacterFromElement));
        app.loading(false);
        setTimeout(function() {
          domFilter.addEventListener('input', libSearchIndex.build(albums, function() {
            var visibleElements;
            libSearchIndex.checkForEmptyContainer('.artist', 'ul > li[class=""]', 'artist');
            visibleElements = libSearchIndex.checkForEmptyContainer('#artists > div', 'div[class="artist "]');
            updateNavigation(_.map(visibleElements, getCharacterFromElement));
            domFilterError.innerHTML = visibleElements.length ? '' : translate.get('error_no_results');
          }).filter);
        });
      });
    });
    if(!playlists.length) {
      return app.errorNoTracks();
    }
    _.each(playlists, function(playlist) {
      collections.push(libAlbum.fromPlaylist(playlist, doneFn, distinctCache));
    });
  });

});