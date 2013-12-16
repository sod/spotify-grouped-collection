exports.build = (function() {

  var visible = '';
  var hidden = 'hide';

  /**
   * build searchIndex string from album
   *
   * @param {models.Album} album
   * @returns {string}
   */
  function getSearchIndexString(album) {
    var index = 0,
      chunks = [];

    chunks.push(album.name);
    for(; index < album.artists.length; index += 1) {
      chunks.push(album.artists[index].name);
    }
    return chunks.join('\n');
  }

  /**
   * add searchIndex property to any album entity in collections
   */
  function scanItems(items) {
    var index = 0;

    for(; index < items.length; index += 1) {
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
    var index = 0,
      find = new RegExp(value, 'i');

    for(; index < items.length; index += 1) {
      items[index].element.className = find.test(items[index].searchIndex) ? visible : hidden;
    }
  }

  /**
   * check if "container" has "has" elements - add "hidden" if not, and "visible" if has
   *
   * @param {String} container - css selector for containers to check in
   * @param {String} has - css selector for visible elements inside container
   */
  function checkForEmptyPlaylistContainer(container, has, baseClass) {
    var index = 0,
      elements = document.querySelectorAll(container);

    for(; index < elements.length; index += 1) {
      elements[index].className = baseClass + ' ' + ( elements[index].querySelectorAll(has).length ? visible : hidden );
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
      window.requestAnimationFrame(function() {
        filterRenderer(items, value);
        checkForEmptyPlaylistContainer('.playlist', 'ul > li[class=""]', 'playlist');
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