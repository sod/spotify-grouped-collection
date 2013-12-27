/**
 * load /app/<module>/<tab>.(js|css|html) files on url change
 */
require([
  '$api/models',
  '/conf/routes',
  '/lib/js/dom/app'
], function(models, routes, dom) {

  /**
   * get html file contents
   *
   * @param {String} route
   * @param {Function} done
   */
  function getHtml(route, done) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', route + '.html');
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
        done(xhr);
      }
    };
    xhr.send(null);
  }

  /**
   * get current route from models.application.arguments
   *
   * @returns {String}
   */
  function getRoute() {
    var target = models.application.arguments || [],
        tab = target[target.length - 1] || '',
        file = target[target.length - 2] || 'index',
        route = tab + '/' + file;

    if(_.indexOf(routes.tabs, target[target.length - 1]) === -1) {
      return '';
    }
    route = _.indexOf(routes.routes, route) === -1 ? routes.fallback : route;
    return '/app/' + route;
  }

  /**
   * clear site and embed application defined by getRoute()
   */
  function dispatch() {
    var route = getRoute();
    if(!route) {
      return;
    }

    dom.clear();
    dom.loading(true);
    getHtml(route, function(xhr) {
      dom.addCss(route);
      dom.addHtml(xhr.responseText);
      dom.addJavaScript(route);
    });
  }

  // When application is loaded, load route
  models.application.load('arguments').done(dispatch);

  // When arguments change, load route
  models.application.addEventListener('arguments', dispatch);

});