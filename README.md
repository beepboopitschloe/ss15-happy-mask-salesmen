ss15-happy-mask-salesmen
========================

Our team's entry to the 2015 Static Showdown. We've created an app for
no-frills voice chat-- just create a room and invite some friends, no account
necessary. Best used when gaming together and Skype or Ventrilo is too much of
a hassle, or when you need quick and easy access to an audio conversation.

Tools Used
----------
The app is based on using WebRTC to connect browser-to-browser. The primary
library used is [PeerJS](http://peerjs.com), a service which facilitates WebRTC
connections.

The framework of the app is constructed with [Knockout](http://knockoutjs.com).

Browser Support
---------------

The app is developed and tested in Chrome, but the primary library, PeerJS,
is supported by Firefox and Opera as well.

Development
-----------

Assuming that you have `npm`, this should get you from zero to sixty:

    sudo npm install -g grunt-cli
    npm install
    grunt

This will concatenate all `.js` files in the `src/` directory and put them in
`dist/logic.js` to be consumed by the app.
