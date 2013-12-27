/* jshint predef:exports */

// @param {Array} exports.tabs - allowed tabs (the tabs you define in manifest.json)
exports.tabs = [
  'album',
  'artist'
];

// @param {Array} exports.routes - allowed routes in scheme "<folder>/<tab>"
exports.routes = [
  'album/index', // spotify:app:tidify:index:album
  'artist/index' // spotify:app:tidify:index:artist
];

// @param {Array} exports.fallback - fallback route if requested route is not available in "routes"
exports.fallback = exports.routes[0];