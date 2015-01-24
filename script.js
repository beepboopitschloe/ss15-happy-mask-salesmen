navigator.getUserMedia  = navigator.getUserMedia
    || navigator.webkitGetUserMedia
    || navigator.mozGetUserMedia
    || navigator.msGetUserMedia;

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

$(function() {
  navigator.getUserMedia({
    audio: true,
    video: true
  }, function(stream) {
    peer.on('call', function(call) {
      console.log('receiving call', call);
      call.answer(stream);
      
      call.on('stream', function(remoteStream) {
        var feed = $(document.createElement('video')).attr({
          autoplay: true,
          src: window.URL.createObjectURL(remoteStream)
        });
        
        $('body').append(feed);
      });
    });
  
    $('#call-btn').on('click', function() {
      // make a call w/ provided id
      var id = $('#call-id').val();
    
      // show preview of user
      $('#user').attr({src: window.URL.createObjectURL(stream)});
      
      console.log('calling', id);
    
      var call = peer.call(id, stream);
      
      call.on('stream', function(remoteStream) {
        $('#caller').attr({src: window.URL.createObjectURL(remoteStream)});
      });
    });
  }, function(err) {
    throw err;
  });
});