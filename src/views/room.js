/**
 * views/join.js
 *
 * Defines component for the join-room view.
 */

// get the getUserMedia function
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

function makeCall(peer, id, stream) {
  console.log('calling', id);
  var mediaConnection = peer.call(id, stream);
  
  mediaConnection.on('stream', renderVideo);
  mediaConnection.on('error', function(err) { console.log('err:', err); });
  mediaConnection.on('close', function() { console.log('mediaConnection closed; I\'m the client making a call'); });
}

function getCall(peer, call, stream) {
  call.answer(stream);
  
  call.on('stream', function(remoteStream) {
    renderVideo(remoteStream);
    
    var newConnection = {id: call.peer, remoteStream: remoteStream};
    
    console.log('Passing along dataConnection to clients...');
    
    for (var i=0; i<window.client.dataConnections.length; i++) {
      console.log('i: ' + i + ', ' + call.peer);
      
      tellToMakeCall(window.client.dataConnections[i].con, call.peer);
    }
    
    window.client.mediaConnections[window.client.mediaConnections.length] = newConnection;
    setUpNewDataConnection(peer, call.peer);
  });
  call.on('error', function(err) {console.log('err:', err); });
  call.on('close', function() { console.log('mediaConnection closed; I\'m the host'); });
}

function tellToMakeCall(dataConnection, id) {
  console.log('telling client to call new client via dataconnection');
  
  dataConnection.send({id: id});
}

function setUpNewDataConnection(peer, id) {
  var dataConnection = peer.connect(id, {serialization: 'json'});
  
  console.log('Making data connection to', id);
  
  dataConnection.on('open', function() {
    console.log('Data connection to', id, 'opened');
    
    var dataConnectionWrapper = {con: dataConnection, id: id};
    window.client.dataConnections[window.client.dataConnections.length] = dataConnectionWrapper;
  });
  
  dataConnection.on('close', function() {
    console.log('dataConnection closed! I\'m the host');
    // TODO: remove dataConnectionWrapper from dataConnections array
  });
  
  dataConnection.on('error', function(err) { console.log('err:', err); });
  return dataConnection;
}

function getCallAsClient(call, stream) {
  call.answer(stream);
  
  call.on('stream', renderVideo);
  call.on('error', function(err) {console.log('err:', err); });
  call.on('close', function() { console.log('mediaConnection closed; I\'m the host'); });
}

function createPeer() {
  var peer = new Peer(getPeerId(), {
    key: 'l10zoxgcc0s8m2t9'
  });

  peer.on('open', function(id) {
    console.log('peer ID:', id);
  });

  peer.on('call', function(call) {
    if (window.client.isHost) {
      console.log('receiving call', call);
      getCall(peer, call, stream);
    } else {
      getCallAsClient(call, stream);
    }
  });
  
  peer.on('error', function(err) {
    console.error(err);
  });

  // only clients will ever be on the receiving end of data connections
  peer.on('connection', function(dataConnection) {
    console.log('recieved data connection', dataConnection);
    
    dataConnection.on('open', function() {
      console.log('dataConnection opened');
    });
    
    dataConnection.on('data', function(data) {
      console.log('the host told me to call', data.id);
      
      makeCall(peer, data.id, stream);
    });
    
    dataConnection.on('close', function() {
      console.log('dataConnection closed! I\'m a client');
    });
    
    dataConnection.on('error', function(err) {
      console.error('dataConnection error:', err);
    });
  });

  return peer;
}

(function() {

  ko.components.register('view-room', {
    template: {
      url: 'templates/views/room.html'
    },
    viewModel: function(params) {
      var peer = createPeer();

      // get host ID from params
      console.log(params);
      var hostId = params.hostId;

      // get stream
      navigator.getUserMedia({
        audio: true,
        video: true
      }, function(stream) {
        makeCall(peer, hostId, stream);
      }, function(error) {
        throw error;
      });
    }
  });

})();
