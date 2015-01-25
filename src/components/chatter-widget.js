/**
 * components/chatter-widget.js
 *
 * Widget which displays information about a connected chat partner.
 */

(function() {

  ko.components.register('chatter-widget', {
    template: {
      url: 'templates/components/chatter-widget.html'
    },
    viewModel: function(params) {
      console.log('creating chatter-widget');
      
      this.name = params.name;
      this.info = params.info;
    }
  })

})();
