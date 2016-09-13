import ui
from threading import Thread
from flask import Flask, request, send_from_directory
from time import sleep
import os


def shutdown_server():
  func = request.environ.get('werkzeug.server.shutdown')
  if func is None:
    raise RuntimeError('Not running with the Werkzeug Server')

  func()

def do_shutdown(*args):
  import http.client 
  
  conn = http.client.HTTPConnection("localhost:8000")
  conn.request("POST", "/shutdown")
  r = conn.getresponse()
  print(r.read())
  conn.close()


app = Flask(__name__)

@app.route("/<path:path>")
def static_file(path):
  print("Loading %r" % path)
  return send_from_directory("static", path)

@app.route('/shutdown', methods=['POST'])
def shutdown():
    shutdown_server()
    return 'Server shutting down...'




if __name__ == "__main__":
  app.logger.info("App starting...")
  Thread(target=app.run, kwargs={"host":"127.0.0.1", "port":8000}).start()
  
  sleep(0.5)
    
  v = ui.load_view()
  webview = v["ui.webview"]
  v.present('sheet')

  sleep(1.0)
    
  webview.load_url("http://127.0.0.1:8000/mandel2.html")
  v.wait_modal()
  
  print("Done UI!")
  
  do_shutdown()
  
  try:
    print("Done?")
    
    for s in range(15):
      print(".", end="")
      sleep(0.11)
    
    do_shutdown()
    
    print("\nNo :-(")
  except:
    print("\nYes! :-)")
