'''
Basic template for the websocket portion of the control server.

To connect to the websocket, create a websocket in JavaScript
that connects to ws://<server_ip>:8888/command_ws and/or
ws://<server_ip>:8888/sensor_ws and begin sending messages (the 
messages print to the console for now).

This server will be run in its own thread, as a module 
'''

import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web
import json
import time
import threading

# only necessary for testing
import random

class Sensor_API():
    def __init__(self):
        self.accel = [0.0, 0.0, 0.0]
        self.gyro = [0.0, 0.0, 0.0]
        self.magnetometer = [0.0, 0.0, 0.0]
        self.orientation = [0.0, 0.0, 0.0]
        self.temp = 0
        self.humidity = 0
        self.motorspeeds = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]

sensors = Sensor_API()

# handles data to and from command UI
class CommandWSHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        print 'new connection'
        self.write_message("Hello World")
      
    def on_message(self, message):
        # print 'message received %s' % message
        self.parse_message(message)
        self.write_message(json.dumps(sensors.__dict__))
 
    def on_close(self):
      print 'connection closed'
 
    def parse_message(self, msg):
        #this will take the received JSON data and perform the appropriate actions 
        command_api = json.loads(msg)
        print "Thrust: ", command_api['thrust']
        print "Extend: ", command_api['extend']
        print "Grasp: ", command_api['claw']
        print "Camera: ", command_api['camera']

    def check_origin(self, origin):
        return True

# handles sensor data
class SensorWSHandler(tornado.websocket.WebSocketHandler):
    def __init__(self, application, request, socket_list):
        super(self.__class__, self).__init__(application, request)
        self._socket_list = socket_list
        
    def open(self):
        # send an acknowledgement that the sensor socket is connected
        print 'Sensor link is active.'
        self._socket_list.append(self)
              
    def on_message(self, message):
        print 'message received %s' % message
        self.parseMessage(message)
 
    def on_close(self):
        self._socket_list.remove(self)
      # log that the connection with the UI was lost.
        print 'connection closed'
         
    def parse_message(self, msg):
        #this will take the received JSON data and perform the appropriate actions 
        pass

    def check_origin(self, origin):
        return True

######## from here down will need to be modified to set up other threads #####

class SensorSerialThread(threading.Thread):
    def __init__(self, socket_list, event):
        super(self.__class__, self).__init__()
        self._sockets = socket_list
        self._finished_event = event
        
        # connect to arduino serial port
    
    def run(self):
        # listen for data, and forward data when appropriate
        
        
        ###### dummy data for now ######
        times_run = 0
        while not self._finished_event.isSet():
            if times_run == 0:
                deltas = list((random.random()-0.5)/10 for i in range(3))
            times_run = (times_run+1)%100
            
            for axis in range(3):
                sensors.orientation[axis] = (sensors.orientation[axis] + deltas[axis])%360
            
            for socket in self._sockets:
                try:
                    socket.write_message(sensors.__dict__)
                except WebSocketClosedError:
                    # the socket is closed, it should remove itself from the list
                    pass
            time.sleep(0.01);

if __name__ == "__main__":
    
    closing_event = threading.Event()
    sockets = []
    
    sensor_serial_thread = SensorSerialThread(sockets, closing_event)
    sensor_serial_thread.start()

    application = tornado.web.Application([
        (r'/sensor_ws', SensorWSHandler, {"socket_list" : sockets}),
        (r'/command_ws', CommandWSHandler),
    ])
    
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(8888)
    
    try:
        tornado.ioloop.IOLoop.instance().start()
    finally:
        closing_event.set()
