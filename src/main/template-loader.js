/**
 * template-loader.js
 *
 * Handles loading of HTML templates for components.
 */

(function() {

  var loader = {
    /**
     * loadTemplate
     *
     * Grabs HTML templates from the given url. Assumes that components are
     * defined like this:
     *
     * ko.register
     */
    loadTemplate: function(name, config, cb) {
      if (!config.url) {
        return cb(null);
      }

      var url = config.url;

      $.get(url)
      .success(function(html) {
        // need to transform html into DOM nodes
        var tmp = document.createElement('div');
        tmp.innerHTML = html;

        var nodes = tmp.childNodes;

        cb(nodes);
      })
      .error(function(response) {
        console.error('Failed to load template', url);

        return cb(null);
      });
    }
  };

  // add it to the front of the loaders array so that it will fire first
  ko.components.loaders.unshift(loader);

})();
