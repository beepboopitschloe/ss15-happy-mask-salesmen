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
      
     //Thanks Halpo: http://stackoverflow.com/questions/23409992/toggling-the-muted-attribute-of-html5-audio
     
     $('.mute-button').on('click', function() {
      	if ($('.mute-button').html() == 'mute') {
      		var bool = $(".talker").prop("muted");
       		$(".talker").prop("muted",!bool);
      		$('.mute-button').html('unmute');
      	}
      	else {
      		var bool = $(".talker").prop("muted");
       		$(".talker").prop("muted",!bool);;
      		$('.mute-button').html('mute');
      	}
      });
    }
  })

})();
