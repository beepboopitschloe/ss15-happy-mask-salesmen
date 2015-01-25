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
      // buttons to reveal the join/create forms
      $('button#show-join-form').on('click', function() {
        $('div#join-form').addClass('active');
        $('div#create-form').removeClass('active');
      });
      $('button#show-create-form').on('click', function() {
        $('div#create-form').addClass('active');
        $('div#join-form').removeClass('active');
      });
      
      $('#join-chat-id').on('keyup', function(e) {
        if (e.which === 13) {
          $('#join-chat-btn').click();
        }
      });
      
      $('#new-chat-id').on('keyup', function(e) {
        if (e.which === 13) {
          $('#new-chat-btn').click();
        }
      });
      
      // set up event handlers
      $('#join-chat-btn').on('click', function(e) {
        var chatId = $('#join-chat-id').val(),
          displayName = $('#user-name').val()
            || 'anonymous';
        
        if (chatId.length < 3) {
          toastr.error('Please use a chat name that is at least 3 characters.');
        } else {
          window.location.href = '#room?id=' + chatId
            + '&name=' + displayName;
        }
      });
      
      $('#new-chat-btn').on('click', function(e) {
        var chatId = $('#new-chat-id').val(),
          displayName = $('#user-name').val()
            || 'anonymous';
        
        if (chatId.length < 3) {
          toastr.error('Please use a chat name that is at least 3 characters.');
        } else {
          window.location.href = '#room?id=' + chatId
            + '&hosting=true'
            + '&name=' + displayName;
        }
      });
    }
  });

})();
