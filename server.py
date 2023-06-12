from http.server import HTTPServer, BaseHTTPRequestHandler

class HelloWorldHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(b'Hello, World!')

httpd = HTTPServer(('localhost', 8000), HelloWorldHandler)
print('Server running on localhost:8000')
httpd.serve_forever()
