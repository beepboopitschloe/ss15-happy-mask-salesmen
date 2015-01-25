/**
 * router.js
 *
 * Handles routing the application.
 */

(function() {

  function renderView(componentName, href) {
    // render the template
    var container = $('#view-container'),
      component = document.createElement(componentName);

    container.empty().append(component);

    // instantiate the component
    ko.applyBindingsToNode(component);

    // if the navbar has a link to this page, mark it as active
    $('.navbar li.active').removeClass('active');
    $('.navbar li a[href="#' + href + '"]').parent().addClass('active');
  }
  
  var routes = {
    '': {
      enter: function() {
        renderView('view-base', '');
      }
    },

    'join': {
      enter: function(roomId) {
        renderView('view-join', 'join');
      }
    }
  };

  function handleHash(e) {
    var newURL = window.location.href;

    if (newURL.split('#').length === 1) {
      // no hash to handle. invoke base route
      window.location.href = '#';
      return;
    }

    // parse the hash fragment
    var newHash = newURL.split('#')[1],
      components = newHash.split('/'),
      route = routes[components[0] || ''];

    if (route) {
      // invoke the route.enter() function with the rest of the components
      // as arguments
      return route.enter.apply(route, components.slice(1));
    } else {
      // unrecognized route, abort mission
      document.location.hash = '#';
    }
  }

  // execute handleHash on page load
  $(handleHash);

  // execute handleHash when the hash changes
  window.onhashchange = handleHash;
})();

