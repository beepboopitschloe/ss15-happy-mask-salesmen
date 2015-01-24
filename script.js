navigator.getUserMedia  = navigator.getUserMedia
    || navigator.webkitGetUserMedia
    || navigator.mozGetUserMedia
    || navigator.msGetUserMedia;

window.onload = function() {
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
