require([
  '$api/models'
], function(models) {

  var app = {
    canvas: document.getElementById('app'),
    empty: function() {
      app.html('');
    },
    html: function(xhr) {
      window.scrollTo(0, 0);
      app.canvas.innerHTML = typeof xhr === 'string' ? xhr : xhr.responseText;
    },
    appendJavaScript: function(src) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      app.canvas.appendChild(script);
    }
  };

  function fetch(file, done) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', file);
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
        done(xhr);
      }
    };
    xhr.send(null);
  }

  function getModule() {
    var target = models.application.arguments || [];
    if(target[target.length - 1 ] !== 'index') {
      return '';
    }
    var url = target.join('/');
    if(url === 'index') {
      url = 'album/index';
    }
    return '/app/' + url;
  }

  function site() {
    var module = getModule();
    if(module) {
      app.empty();
      window.console && window.console.log(module + '.html');
      fetch(module + '.html', function(xhr) {
        app.html(xhr);
        app.appendJavaScript(module + '.js');
      });
    }
  }

  // When application has loaded, run pages function
  models.application.load('arguments').done(site);

  // When arguments change, run pages function
  models.application.addEventListener('arguments', site);

});