/**
 * router.js
 *
 * Handles routing the application.
 */

(function() {

  function renderView(componentName, href, params) {
    // render the template
    var container = $('#view-container'),
      component = document.createElement(componentName);

    // put the component into the page
    container.empty().append(component);

    $(component).attr({
      params: JSON.stringify(params)
    });

    // instantiate the component
    ko.applyBindingsToNode(component);

    // if the navbar has a link to this page, mark it as active
    $('.navbar li.active').removeClass('active');
    $('.navbar li a[href="#' + href + '"]').parent().addClass('active');
  }
  
  function parseQueryString(str) {
    var query = {};
    
    if (str) {
      var pairs = str.split('&').map(function(part) {
        var pair = part.split('=');
        
        return {
          key: pair[0],
          value: pair[1]
        };
      });
    
      for (var i=0; i<pairs.length; i++) {
        var pair = pairs[i];
        
        query[pair.key] = pair.value;
      }
    }
    
    return query;
  }
  
  var routes = {
    '': {
      enter: function() {
        renderView('view-base', '');
      },
      exit: function() {
        $('view-base').trigger('exit');
      }
    },

    'room': {
      enter: function(query) {
        renderView('view-room', 'room', query);
      },
      exit: function() {
        $('view-room').trigger('exit');
      }
    }
  }, currentRoute = null;

  function handleHash(e) {
    var newURL = window.location.href;

    if (newURL.split('#').length === 1) {
      // no hash to handle. invoke base route
      window.location.href = '#';
      return;
    }

    // parse the hash fragment
    var newHash = newURL.split('#')[1].split('?')[0],
      components = newHash.split('/'),
      queryString = newURL.split('#')[1].split('?')[1],
      route = routes[components[0] || ''];

    if (route) {
      // invoke the route.enter() function with the rest of the components
      // as arguments
      var query = parseQueryString(queryString);
      
      if (currentRoute && currentRoute.exit) {
        currentRoute.exit.apply(currentRoute);
      }
      
      currentRoute = route;
      
      return route.enter.apply(route, [query]);
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

