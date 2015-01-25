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

function renderAudio(stream) {
  var audio = $('<audio autoplay />').appendTo('body');

  audio[0].src = (URL || webkitURL || mozURL).createObjectURL(stream);
}

function createCallerWidget(stream, metadata) {
  var widget = document.createElement('chatter-widget');
  
  metadata = metadata || {};
  
  $(widget).attr({
    params: JSON.stringify({
      name: metadata.name || 'anonymous',
      info: metadata.info || ''
    })
  }).appendTo('#chat-body');
  
  ko.applyBindingsToNode(widget);
  
  // give knockout 100ms to apply the bindings and the template, since it's
  // apparently async
  setTimeout(function() {
    $(widget).find('audio')[0].src = (URL || webkitURL || mozURL).createObjectURL(stream);
  }, 1000);
}

function getPeerId() {
  var basedWords = [
    "rare", "based", "TYBG", "fuck your bitch", "fuck my bitch",
    "finna", "hit a lick", "tryna", "bust a nut", "what are you doing",
    "Brandon", "BasedWorld", "trapped", "Keke", "Lil B", "BasedGod",
    "family", "basedfam", "fakebased", "Imma", "fuck me", "ho",
    "4 me", "bricks", "20 bricks", "smoke", "heata", "burna", "comin through",
    "with the", "murder rate", "pink flame", "green flame", "red flame",
    "white flame", "black flame", "100% percent gutta", "gods father",
    "mixtape", "track", "trap", "real", "realest", "this the realest",
    "rawest", "rapper", "alive", "I love you", "dont feel pressured to have sex",
    "flex 36es", "Paris Hilton", "Ellen Degeneres", "JK Rowling", "I look like",
    "I feel like", "ya fill me", "I go dumb", "go so dumb", "dumb",
    "fake", "ass", "eat her", "pussy", "suck my dick", "on my dick",
    "hipster girls", "underground party", "New York", "Berkeley", "comin from da under",
    "Katy Perry", "Kevin Durant", "fuck", "spit", "bitches", "clink clink",
    "I wanna", "say something", "too many tags", "the damn beat", "hoop life",
    "streets", "lifes hard", "ratchet", "I need", "I need some", "shout out",
    "someone stole my sunglasses", "parents", "thank", "happy", "youre",
    "thugged out pissed off", "child support me", "figaro", "figara",
    "mama", "smoke on mary", "wonton soup", "thats just how I do",
    "no black person is ugly", "05 fuck em", "hadouken", "florida", "texas",
    "futbol", "i own swag", "motherfucker", "BasedLayer", "welcome",
    "task force", "soldier", "lieutenant", "general", "5150", "breathe slow",
    "spongebob squarepants", "strapped with the heater", "spongebob BasedGod",
    "cocaine in my fanny pack", "my nana is strapped", "brodey comin up",
    "ski ski", "ski mask thug", "ski mask thuggin", "twerk sum",
    "stop pausing my damn beat", "don't pause the beat", "i know youre a freak",
    "I met the BasedGod", "I know Lil B", "for Lil Boss", "more relaxed",
    "better for me", "bitch mob", "4 my", "sorry Rihanna", "sorry Flocker",
    "Riff Raff", "Joey Badass", "The Game", "is irrelevant", "beef",
    "call me", "John Stamos", "Kurt Angle", "Dr Phil", "cute", "funny",
    "random", "must collect", "very straightforward", "unreleased", "secret",
    "NBA", "gotta make the", "1 on 1", "really fun", "WNBA", "fine ass girls",
    "fuck in the mouth", "booty milk", "booty cheese", "sniff the", "girls",
    "booty", "panties", "dirty", "feet", "2 rich to pimp", "rent due",
    "NYU lecture", "MIT lecture", "rick ross", "dont go outside", "death of rap",
    "I cook", "birth of rap", "giving up", "februarys confessions", "dopeman hunter",
    "connected in jail", "illusions of grandeur", "Charlie Sheen", "ps2 game collection",
    "dbz budokai", "whodie", "Andy Milonakis", "Keith Sweat", "cash on deck", "stick",
    "hit da 4l0", "Miley Cyrus", "I got mo", "Im god", "Jerry Rice", "glassface",
    "flowers exodus", "dior paint", "the age of information", "california boy",
    "a zilli", "Caillou", "Bill Bellamy", "Hugh Hefner", "Obama BasedGod",
    "pretty", "rich", "young", "thug", "robbin and shoppin"
  ];
  
  var words = basedWords[Math.floor(Math.random() * basedWords.length)]
    + ' ' + basedWords[Math.floor(Math.random() * basedWords.length)]
    + ' ' + basedWords[Math.floor(Math.random() * basedWords.length)];
  
  return words;
}

function makeCall(peer, id, stream, options) {
  options = options || {};
  
  var errorHandler = options.onError || function(err) {
    console.log('error making call:', err);
  };
  
  console.log('calling', id);
  var mediaConnection = peer.call(id, stream, {
    metadata: options.metadata
  });
  
  mediaConnection.on('stream', function(remoteStream) {

    peer.on('connection', function(dataConnection) {
      console.log('recieved data connection', dataConnection);
      
      dataConnection.on('open', function() {
        console.log('dataConnection opened');
      });
      
      dataConnection.on('data', function(data) {
        if (data.type === 'newClient') {
          console.log('the host told me to call', data.id);
          
          makeCall(peer, data.id, stream, {
            metadata: {
              name: options.name
            }
          });
        } else if (data.type === 'metadata') {
          createCallerWidget(remoteStream, data);
          if (data.closeMe) {
            dataConnection.close();
          }
        }
      });
      
      dataConnection.on('close', function() {
        console.log('dataConnection closed! I\'m a client');
      });
      
      dataConnection.on('error', function(err) {
        console.error('dataConnection error:', err);
      });
    });
  });
  mediaConnection.on('error', function(err) { console.log('err:', err); });
  mediaConnection.on('close', function() { $('span.user-id:contains('+id+')').closest('chatter-widget').remove(); });
}

function getCall(peer, call, stream, options) {
  call.answer(stream);
  
  call.on('stream', function(remoteStream) {
    createCallerWidget(remoteStream, call.metadata);
    
    var newConnection = {id: call.peer, remoteStream: remoteStream};
    
    console.log('Passing along dataConnection to clients...');
    
    for (var i=0; i<window.client.dataConnections.length; i++) {
      console.log('i: ' + i + ', ' + call.peer);
      
      tellToMakeCall(window.client.dataConnections[i].con, call.peer);
    }
    
    window.client.mediaConnections[window.client.mediaConnections.length] = newConnection;
    setUpNewDataConnection(peer, call.peer, options);
  });
  call.on('error', function(err) {console.log('err:', err); });
  call.on('close', function() { $('span.user-id:contains('+call.peer+')').closest('chatter-widget').remove(); });
}

function tellToMakeCall(dataConnection, id) {
  console.log('telling client to call new client via dataconnection');

  dataConnection.send({id: id, type: 'newClient'});
}

function setUpNewDataConnection(peer, id, options) {
  var dataConnection = peer.connect(id, {serialization: 'json'});
  
  console.log('Making data connection to', id);
  
  dataConnection.on('open', function() {
    console.log('Data connection to', id, 'opened');

    // send host's chatter widget metadata to client
    sendMetadata(dataConnection, options)
    
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

function setUpClientToClientDataConnection(peer, call.peer, options) {
  var dataConnection = peer.connect(id, {serialization: 'json'});
  
  console.log('Making data connection to', id);
  
  dataConnection.on('open', function() {
    console.log('Data connection to', id, 'opened');

    // send host's chatter widget metadata to client
    sendMetadataFromClient(dataConnection, options)
    
    var dataConnectionWrapper = {con: dataConnection, id: id};

  });
  
  dataConnection.on('close', function() {
    console.log('dataConnection closed! I\'m the host');
    // TODO: remove dataConnectionWrapper from dataConnections array
  });
  
  dataConnection.on('error', function(err) { console.log('err:', err); });
  return dataConnection;
}

function sendMetadata(dataConnection, metadata) {
  metadata.type = 'metadata';
  metadata.closeMe = false;
  dataConnection.send(metadata);
}

function sendMetadataFromClient(dataConnection, metadata) {
  metadata.type = 'metadata';
  metadata.closeMe = true;
  dataConnection.send(metadata);
}

function getCallAsClient(peer, call, stream, options) {
  call.answer(stream);

  setUpClientToClientDataConnection(peer, call.peer, options);
  
  call.on('stream', function(remoteStream) {
    createCallerWidget(remoteStream, call.metadata);
  });
  call.on('error', function(err) {console.log('err:', err); });
  call.on('close', function() { $('span.user-id:contains('+call.peer+')').closest('chatter-widget').remove(); });
}

function createPeer(stream, id, options) {
  id = id || getPeerId();
  
  options = options || {};
  
  var errorHandler = options.onError || function(err) {
    console.error(err);
  };
  
  var peer = new Peer(id, {
    key: 'l10zoxgcc0s8m2t9'
  });

  peer.on('open', function(id) {
    console.log('peer ID:', id);
  });

  peer.on('call', function(call) {
    if (window.client.isHost) {
      console.log('receiving call', call);
      getCall(peer, call, stream, options);
    } else {
      getCallAsClient(peer, call, stream, options);
    }
  });
  
  peer.on('error', errorHandler);

  // only clients will ever be on the receiving end of data connections
  peer.on('connection', function(dataConnection) {
    console.log('recieved data connection', dataConnection);
    
    dataConnection.on('open', function() {
      console.log('dataConnection opened');
    });
    
    dataConnection.on('data', function(data) {
      if (data.type === 'newClient') {
        console.log('the host told me to call', data.id);
        
        makeCall(peer, data.id, stream, {
          metadata: {
            name: options.name
          }
        });
      } else if (data.type === 'metadata');
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
      // get host ID from params
      var hostId = params.id,
        displayName = params.name,
        hosting = params.hosting === 'true'? true : false;
      
      // set globals
      window.client = {
        isHost: hosting,
        displayName: displayName,
        mediaConnections:[],
        dataConnections:[]
      };

      // get stream
      navigator.getUserMedia({
        audio: true,
        video: false
      }, function(stream) {
        var peer;
        
        if (window.client.isHost) {
          // wait for incoming connections
          peer = createPeer(stream, hostId, {
            name: displayName
          });
        } else {
          // make a connection to the host
          toastr.info('Connecting to ' + hostId + '...');
          
          peer = createPeer(stream, null, {
            name: displayName,
            
            onError: function(err) {
              // no room to connect to
              toastr.error('Could not find a room with id ' + hostId + '.');
              
              window.location.href = '#';
            }
          });
          
          makeCall(peer, hostId, stream, {
            metadata: {
              name: displayName
            }
          });
        }
      }, function(error) {
        throw error;
      });
    }
  });

})();
