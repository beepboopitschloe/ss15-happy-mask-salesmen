/**
 * router.js
 *
 * Handles routing the application.
 */

(function() {

  var routes = {
    '': {
      enter: function() {
        // invoke create-room component 
      }
    },

    'join': {
      enter: function(roomId) {
        // invoke room-view component
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
      console.log('entering route', components[0]);

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

