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
      this.peerId = params.peerId;
      
     //Thanks Halpo: http://stackoverflow.com/questions/23409992/toggling-the-muted-attribute-of-html5-audio
     var widget = $('#' + this.peerId + '-widget');
     
     widget.find('.mute-button').on('click', function() {
        var talker = widget.find('.talker'),
          self = $(this);
        
        talker.prop('muted', !talker.prop('muted'));
       
        if (self.html() == 'mute') {
      		self.html('unmute');
      	} else {
      		self.html('mute');
      	}
      });
    }
  })

})();
