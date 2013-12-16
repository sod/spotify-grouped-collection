(function() {
  var canvas = document.getElementById('app');
  var resources = document.getElementById('app-resources');

  function addResource(tagName, attr) {
    var tag = _.extend(document.createElement(tagName), attr || {});
    resources.appendChild(tag);
  }

  _.extend(exports, {
    clear: function() {
      canvas.innerHTML = '';
      canvas.className = 'loading';
      resources.innerHTML = '';
      window.scrollTo(0, 0);
    },
    addHtml: function(xhr) {
      canvas.innerHTML += typeof xhr === 'string' ? xhr : xhr.responseText;
      canvas.className = '';
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