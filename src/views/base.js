/**
 * views/base.js
 *
 * Defines component for the base view.
 */

(function() {

  ko.components.register('view-base', {
    template: {
      url: 'templates/views/base.html'
    },
    viewModel: function(params) {
      // set up event handlers
      $('#join-chat-btn').on('click', function(e) {
        var chatId = $('#join-chat-id').val(),
          displayName = $('#user-name').val()
            || 'anonymous';
        
        window.location.href = '#room?id=' + chatId
          + '&name=' + displayName;
      });
      
      $('#new-chat-btn').on('click', function(e) {
        var chatId = $('#new-chat-id').val(),
          displayName = $('#user-name').val()
            || 'anonymous';
        
        window.location.href = '#room?id=' + chatId
          + '&hosting=true'
          + '&name=' + displayName;
      });
    }
  });

})();
