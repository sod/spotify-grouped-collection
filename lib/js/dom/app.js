(function() {
  var body = document.body;
  var canvas = document.getElementById('app');
  var resources = document.getElementById('app-resources');

  function addResource(tagName, attr) {
    var tag = _.extend(document.createElement(tagName), attr || {});
    resources.appendChild(tag);
  }

  _.extend(exports, {
    loading: function(enable) {
      body.className = enable ? 'loading' : '';
    },
    clear: function() {
      canvas.innerHTML = '';
      resources.innerHTML = '';
      window.scrollTo(0, 0);
    },
    addHtml: function(string) {
      canvas.innerHTML += string;
    },
    addJavaScript: function(module) {
      addResource('script', {
        type: 'text/javascript',
        src: module + '.js'
      });
    },
    addCss: function(module) {
      addResource('link', {
        rel: 'stylesheet',
        href: module + '.css'
      });
    }
  });
}());