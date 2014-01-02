/* jshint predef:exports */

// @param {Array} exports.tabs - allowed tabs (the tabs you define in manifest.json)
exports.tabs = [
  'playlist',
  'artist'
];

// @param {Array} exports.routes - allowed routes in scheme "<folder>/<file>"
exports.routes = [
  'playlist/index', // spotify:app:tidify:index:playlist
  'artist/index' // spotify:app:tidify:index:artist
];

// @param {Array} exports.fallback - fallback route if requested route is not available in "routes"
exports.fallback = exports.routes[0];