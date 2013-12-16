/**
 * load /app/<module>/<tab>.(js|css|html) files on url change
 */
require([
  '$api/models',
  '/conf/routes',
  '/lib/js/dom/app'
], function(models, routes, dom) {

  function getHtml(module, done) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', module + '.html');
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
        done(xhr);
      }
    };
    xhr.send(null);
  }

  function getModule() {
    var module, target = models.application.arguments || [];
    if(_.indexOf(routes.tabs, target[target.length - 1 ]) === -1) {
      return '';
    }
    module = target.join('/');
    module = _.indexOf(routes.routes, module) === -1 ? routes.fallback : module;
    return '/app/' + module;
  }

  function site() {
    var module = getModule();
    if(module) {
      dom.clear();
      getHtml(module, function(xhr) {
        dom.addCss(module);
        dom.addHtml(xhr);
        dom.addJavaScript(module);
      });
    }
  }

  // When application has loaded, run pages function
  models.application.load('arguments').done(site);

  // When arguments change, run pages function
  models.application.addEventListener('arguments', site);

});