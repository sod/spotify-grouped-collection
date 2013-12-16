/**
 * @param {Object} exports
 * @param {Array} exports.tabs - allowed tabs (the tabs you define in manifest.json)
 * @param {Array} exports.routes - allowed routes in scheme "<folder>/<tab>"
 * @param {Array} exports.fallback - fallback route if requested route is not available in "routes"
 */
_.extend(exports, {

  tabs: [
    'index'
  ],

  routes: [
    'album/index'
  ],

  fallback: 'album/index'

});