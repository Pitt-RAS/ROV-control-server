'''
Basic template for the websocket portion of the control server.

To connect to the websocket, create a websocket in JavaScript
that connects to ws://<server_ip>:8888/command_ws and/or
ws://<server_ip>:8888/arm_ws and begin sending messages (the 
messages print to the console for now).

This server will be run in its own thread, as a module 
'''

import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web
import json

# handles data to and from command UI
class CommandWSHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        print 'new connection'
        self.write_message("Hello World")
      
    def on_message(self, message):
        # print 'message received %s' % message
        self.parse_message(message)
        self.write_message(message);
 
    def on_close(self):
      print 'connection closed'
 
    def parse_message(self, msg):
        #this will take the received JSON data and perform the appropriate actions 
        command_api = json.loads(msg)
        print "Thrust: ", command_api['thrust']
        print "Extend: ", command_api['extend']
        print "Grasp: ", command_api['claw']
        print "Camera: ", command_api['camera']

# handles data to and from the arm UI
class ArmWSHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        print 'Arm command link is active.'
        # send an acknowledgement that the arm is now under user control
        #self.write_message("Hello World")
      
    def on_message(self, message):
        print 'message received %s' % message
        self.parseMessage(message)
 
    def on_close(self):
      # log that the connection with the UI was lost.
      # print 'connection closed'
      pass
 
    def parse_message(self, msg):
        #this will take the received JSON data and perform the appropriate actions 
        pass

######## from here down will need to be modified to set up other threads #####

application = tornado.web.Application([
    (r'/command_ws', CommandWSHandler),
    (r'/arm_ws', ArmWSHandler),
])
 
 
if __name__ == "__main__":
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
