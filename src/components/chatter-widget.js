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
      
     $('.mute-button').on('click', function() {
      	if ($('.mute-button').html() == 'mute') {
      		$('.talker').attr('muted', true);
      		$('.mute-button').html('unmute');
      	}
      	else {
      		$('.talker').attr('muted', false);
      		$('.mute-button').html('mute');
      	}
      });
    }
  })

})();
