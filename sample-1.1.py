import ui, console
import os
import http.server
import socketserver
from threading import Thread
from time import sleep


class Server:
  def __init__(self, host="127.0.0.1", port=8000):
    self.host = host
    self.port = port
    
    self.handler = http.server.SimpleHTTPRequestHandler
    self.httpd = socketserver.TCPServer((self.host, self.port), self.handler)
  
  def run(self):
    print("Starting server on port", self.port)
    
    self.httpd.serve_forever()

  def shutdown(self):
    print("Stopping server...")
    self.httpd.shutdown()
    print("Server stopped!")


if __name__ == "__main__":
  server = Server()
  Thread(target=server.run).start()
  
  sleep(0.5)
  
  v = ui.load_view("sample-1.pyui")
  webview = v["ui.webview"]
  v.present('fullscreen')

  sleep(0.5)
    
  webview.load_url("http://127.0.0.1:8000/static/mandel.html")
  v.wait_modal()

  server.shutdown()
