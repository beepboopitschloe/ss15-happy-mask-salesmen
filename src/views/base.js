/**
 * views/base.js
 *
 * Defines component for the base view.
 */

(function() {

  console.log('registering base view');

  ko.components.register('view-base', {
    template: {
      url: 'templates/views/base.html'
    },
    viewModel: function(params) {
      console.log('instantiated base view.');
    }
  });

})();
