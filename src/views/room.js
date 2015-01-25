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

function createCallerWidget(peerId, stream, metadata) {
  var widget = document.createElement('chatter-widget');
  
  metadata = metadata || {};
  
  $(widget)
  .attr({
    id: peerId + '-widget',
    params: JSON.stringify({
      name: metadata.name || 'anonymous',
      info: metadata.info || '',
      peerId: peerId
    })
  }).appendTo('#chat-body');
  
  ko.applyBindingsToNode(widget);
  
  // give knockout 100ms to apply the bindings and the template, since it's
  // apparently async
  setTimeout(function() {
    $(widget).find('audio')[0].src = (URL || webkitURL || mozURL).createObjectURL(stream);
  }, 1000);
  
  // alter the chat body message, if there is one
  $('#chat-body-message').text('Connected to:');
  
  // remove the spinner if it exists
  $('.loader').remove();
}

function updateWidgetWithName(peerId, name) {
  console.log('updating widget', peerId, 'with name', name);
  $('#' + peerId + '-widget').find('.user-id').text(name);
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
    createCallerWidget(mediaConnection.peer, remoteStream, {
      name: 'waiting for name'
    });
  });
  mediaConnection.on('error', function(err) { console.log('err:', err); });
  mediaConnection.on('close', function() { $('span.user-id:contains('+id+')').closest('chatter-widget').remove(); });
}

function getCall(peer, call, stream, options) {
  call.answer(stream);
  
  call.on('stream', function(remoteStream) {
    createCallerWidget(call.peer, remoteStream, call.metadata);
    
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

function setUpClientToClientDataConnection(peer, id, options) {
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
    createCallerWidget(call.peer, remoteStream, call.metadata);
  });
  call.on('error', function(err) {console.log('err:', err); });
  call.on('close', function() { $('span.user-id:contains('+call.peer+')').closest('chatter-widget').remove(); });
}

function createPeer(stream, id, options) {
  options = options || {};
  
  var errorHandler = options.onError || function(err) {
    console.error(err);
  };
  
  var peer;
  if (id) {
    peer = new Peer(id, {
      key: 'l10zoxgcc0s8m2t9'
    });
  } else {
    peer = new Peer({
      key: 'l10zoxgcc0s8m2t9'
    });
  }

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
      } else if (data.type === 'metadata') {
        console.log('i got metadata', data);
        
        updateWidgetWithName(dataConnection.peer, data.name);
        
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
          
          // display a message in the chat box
          $('#chat-body').append('<span id="chat-body-message">Waiting for connections...</span>');
          
          $(document.createElement('div'))
          .addClass('loader')
          .css({
            top: '50px'
          })
          .appendTo('#chat-body');
        } else {
          // make a connection to the host
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
          
          // display a message while we're waiting to connect
          $('#chat-body').append('<span id="chat-body-message">Connecting to host...</span>');
          
          $(document.createElement('div'))
          .addClass('loader')
          .css({
            top: '50px'
          })
          .appendTo('#chat-body');
        }
      }, function(error) {
        throw error;
      });
    }
  });

})();
