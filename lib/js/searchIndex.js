window.getSearchIndex = (function() {

  var visible = '';
  var hidden = 'hide';

  /**
   * build searchIndex string from album
   *
   * @param {models.Album} album
   * @returns {string}
   */
  function getSearchIndexString(album) {
    var chunks = [], index = 0, length = album.artists.length;
    chunks.push(album.name);
    for(; index < length; index += 1) {
      chunks.push(album.artists[index].name);
    }
    return chunks.join('\n');
  }

  /**
   * add searchIndex property to any album entity in collections
   */
  function scanItems(items) {
    var index = 0, length = items.length;
    for(; index < length; index += 1) {
      items[index].searchIndex = getSearchIndexString(items[index]);
    }
  }

  /**
   * set className to 'hide' on any album, that does not contain 'value'
   *
   * @param {models.Album[]} items
   * @param {String} value
   */
  function filterRenderer(items, value) {
    var index = 0, length = items.length, find = new RegExp(value, 'i');
    for(; index < length; index += 1) {
      items[index].element.className = find.test(items[index].searchIndex) ? visible : hidden;
    }
  }

  /**
   * check if '.playlist' has any visible albums inside
   */
  function checkForEmptyPlaylistContainer() {
    var index = 0, playlists = document.querySelectorAll('.playlist'), length = playlists.length;
    for(; index < length; index += 1) {
      playlists[index].className = 'playlist ' + ( playlists[index].querySelectorAll('ul > li[class=""]').length ? visible : hidden );
    }
  }

  var getSearchIndex = function(items) {
    scanItems(items);

    /**
     * @event
     * @param {String} [value]
     */
    function filter(value) {
      value = this.value || value;
      requestAnimationFrame(function() {
        filterRenderer(items, value);
        checkForEmptyPlaylistContainer();
      });
    }

    /**
     * public api
     */
    return {
      filter: filter
    };
  };

  return getSearchIndex;
}());