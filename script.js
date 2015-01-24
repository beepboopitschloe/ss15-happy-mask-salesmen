navigator.getUserMedia  = navigator.getUserMedia
    || navigator.webkitGetUserMedia
    || navigator.mozGetUserMedia
    || navigator.msGetUserMedia;

function audioAPI() {
  var context = new AudioContext();

  navigator.getUserMedia({
    audio: true
  }, function(stream) {
    var mic = context.createMediaStreamSource(stream),
      filter = context.createBiquadFilter();
    
    mic.connect(filter);
    filter.connect(context.destination);
  }, function() {
    console.log('err', arguments);
  });
}

var peer = new Peer({
  key: 'l10zoxgcc0s8m2t9'
});

peer.on('open', function(id) {
  console.log('peer ID:', id);
});

$(function() {
    navigator.getUserMedia({
      audio: true,
      video: true
    }, function(stream) {
    peer.on('call', function(remoteStream) {
      call.answer(stream);
      
      $('#caller').attr({src: window.URL.createObjectURL(remoteStream)});
    });
    
    $('#call-btn').on('click', function() {
      // make a call w/ provided id
      var id = $('#call-id').val();
    
      // show preview of user
      $('#user').attr({src: window.URL.createObjectURL(stream)});
      
      console.log('calling', id);
    
      var call = peer.call('fuckin ids', stream);
      
      call.on('stream', function(remoteStream) {
        $('#caller').attr({src: window.URL.createObjectURL(remoteStream)});
      });
    }, function(err) {
      console.error(err);
    });
  }, function(err) {
    throw err;
  });
});