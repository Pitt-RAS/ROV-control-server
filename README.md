ROV-control-server
==================

Websocket and serial communications code for the ROV (UDOO side)

Description:
===================

This currently is just an example of websockets communication from browser to server, and back to the browser again.

Once the socket is created, the browser sends some (bogus) control data over the websocket to the server as a JSON string.

When the server receives a message, it sends that message back to the browser over the websocket, where it is displayed on the page (and in the console).

Installation:
=============

All this needs is Python and the Tornado Web Framework.
Follow the installation instructions on http://tornadoweb.org to install the framework.

Once that's done, navigate your terminal to the ROV-control-server folder and type:

        python socket-server.py

This will start the websocket server on port 8888.

Then, it's just a matter of opening the included example.html file and clicking "connect".


In the Future:
==============

This is meant as example code only.  This will need to be heavily modified to include serial communications, proper message parsing, threading, etc.
The final code has to communicate with the Arduino, handle commands, etc.

Roadmap:
========

- Complete this server module so that it parses the commands and converts them as necessary
- Create a module for serial communications that will run in a separate thread, but can write to the websocket via a function call
- MORE - will update soon.
