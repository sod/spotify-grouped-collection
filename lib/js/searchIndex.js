(function() {
  var visible = '';
  var hidden = 'hide';

  /**
   * check if "container" has "has" elements - add "hidden" if not, and "visible" if has
   *
   * @param {String} container - css selector for containers to check in
   * @param {String} has - css selector for visible elements inside container
   * @param {String} [baseClass] - css class on "container" elements to keep
   * @return {Array} visibleElements
   */
  exports.checkForEmptyContainer = function(container, has, baseClass) {
    var visibleElements = [],
      index = 0,
      elements = document.querySelectorAll(container);

    for(; index < elements.length; index += 1) {
      elements[index].className = (baseClass||'') + ' ' + ( elements[index].querySelector(has) ? visibleElements.push(elements[index]) && visible : hidden );
    }

    return visibleElements;
  };

  exports.build = (function() {

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
        if(!items[index].searchIndex) {
          items[index].searchIndex = getSearchIndexString(items[index]);
        }
      }
    }

    /**
     * set className to 'hide' on any album, that does not contain 'value'
     *
     * @param {models.Album[]} items
     * @param {String} value
     */
    function filterRenderer(items, value) {
      var element,
        item = 0,
        find = new RegExp(value, 'i'),
        className;

      for(; item < items.length; item += 1) {
        className = find.test(items[item].searchIndex) ? visible : hidden;
        for(element = 0; element < items[item].elements.length; element += 1) {
          if(items[item].elements[element].className !== className) {
            items[item].elements[element].className = className;
          }
        }
      }
    }

    var getSearchIndex = function(items, postRender) {
      scanItems(items);

      /**
       * @event
       * @param {String} [value]
       */
      function filter(value) {
        value = this.value || value;
        window.requestAnimationFrame(function() {
          filterRenderer(items, value);
          postRender && postRender();
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
}());