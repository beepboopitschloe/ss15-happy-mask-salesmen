navigator.getUserMedia  = navigator.getUserMedia
    || navigator.webkitGetUserMedia
    || navigator.mozGetUserMedia
    || navigator.msGetUserMedia;

function renderVideo(stream) {
  console.log(stream);
  var feed = $(document.createElement('video')).attr({
    autoplay: true,
    src: window.URL.createObjectURL(stream)
  });

  $('body').append(feed);
}

function getPeerId() {
  var basedWords = [
  	"rare", "based", "TYBG", "fuck your bitch", "fuck my bitch",
  	"finna", "hit a lick", "tryna", "bust a nut", "what are you doing",
  	"Brandon", "BasedWorld", "trapped", "Keke", "Lil B", "BasedGod",
  	"family", "basedfam", "fakebased", "I'mma", "fuck me", "ho",
  	"4 me", "bricks", "20 bricks", "smoke", "heata", "burna", "comin through",
  	"with the", "murder rate", "pink flame", "green flame", "red flame",
  	"white flame", "black flame", "100% percent gutta", "god's father",
  	"mixtape", "track", "trap", "real", "realest", "this the realest",
  	"rawest", "rapper", "alive", "I love you", "don't feel pressured to have sex",
  	"flex 36es", "Paris Hilton", "Ellen Degeneres", "JK Rowling", "I look like",
  	"I feel like", "ya fill me", "I go dumb", "go so dumb", "dumb", "niggas",
  	"my niggas", "fake", "ass", "eat her", "pussy", "suck my dick", "on my dick",
  	"hipster girls", "underground party", "New York", "Berkeley", "comin from da under",
  	"Katy Perry", "Kevin Durant", "fuck", "spit", "bitches", "clink clink",
  	"I wanna", "say something", "too many tags", "the damn beat", "hoop life",
  	"streets", "life's hard", "ratchet", "I need", "I need some", "shout out",
  	"someone stole my sunglasses", "parents", "thank", "happy", "you're"
  ];
  
  var words = basedWords[Math.floor(Math.random() * basedWords.length)]
    + ' ' + basedWords[Math.floor(Math.random() * basedWords.length)]
    + ' ' + basedWords[Math.floor(Math.random() * basedWords.length)];
  
  return words;
}

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

var peer = new Peer(getPeerId(), {
  key: 'l10zoxgcc0s8m2t9'
});

peer.on('open', function(id) {
  console.log('peer ID:', id);
});

function makeCall(id, stream) {
  var mediaConnection = peer.call(id, stream);
  
  mediaConnection.on('stream', renderVideo);
  mediaConnection.on('error', function(err) { console.log('err:', err); });
  mediaConnection.on('close', function() { console.log('mediaConnection closed; I\'m the client making a call'); });
}

function getCall(call, stream) {
  call.answer(stream);
  
  call.on('stream', function(remoteStream) {
    renderVideo(remoteStream);
    var newConnection = {id: call.peer, remoteStream: remoteStream};
    // notify every single old client that they need to makeCall to the new client
    window.client.mediaConnections[window.client.mediaConnections.length] = newConnection;
  });
  call.on('error', function(err) {console.log('err:', err); });
  call.on('close', function() { console.log('mediaConnection closed; I\'m the host'); });
}

function getCallAsClient(call, stream) {
  call.answer(stream);
  
  call.on('stream', renderVideo);
  call.on('error', function(err) {console.log('err:', err); });
  call.on('close', function() { console.log('mediaConnection closed; I\'m the host'); });
}

$(function() {
  // assume we are the host by default until we decide to make a call
  window.client = {isHost: true, mediaConnections:[]};
  navigator.getUserMedia({
    audio: true,
    video: true
  }, function(stream) {
    // show preview of user
    $('#user').attr({src: window.URL.createObjectURL(stream)});
    
    peer.on('call', function(call) {
      if (window.client.isHost) {
        console.log('receiving call', call);
        getCall(call, stream);
      } else {
        getCallAsClient(call, stream);
      }
    });
    peer.on('error', function(err) {
      console.log(err);
    });
  
    $('#call-btn').on('click', function() {
      var id = $('#call-id').val(); 
      window.client.isHost = false;
      
      console.log('calling', id);
      makeCall(id, stream);
    });
  }, function(err) {
    throw err;
  });
});