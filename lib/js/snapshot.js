_.extend(exports, {
  /**
   * write all snapshots into array
   *
   * @param array
   * @param {Function} doneFn
   * @returns {Function}
   */
  getCollector: function(array, doneFn) {
    return function(snapshot) {
      var index = 0;
      var length = snapshot.length;
      for(; index < length; index += 1) {
        array.push(snapshot.get(index));
      }
      doneFn && doneFn(array);
    }
  }
});