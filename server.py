import http.server
import socketserver
import json
import os
import sys
import socket
import webbrowser

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

class CampusPulseHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        if self.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "ok", "app": "CampusPulse Student Dashboard"}).encode())
            return
        return super().do_GET()

if __name__ == '__main__':
    os.chdir(DIRECTORY)
    local_ip = get_local_ip()
    
    server = None
    for try_port in [8000, 8080, 5000]:
        try:
            server = ReusableTCPServer(("0.0.0.0", try_port), CampusPulseHandler)
            PORT = try_port
            break
        except OSError:
            continue

    if server:
        print("="*60)
        print(f"[CampusPulse] Student Dashboard Server is running!")
        print(f"Computer Access: http://localhost:{PORT}")
        print(f"Mobile Phone Access: http://{local_ip}:{PORT}")
        print("="*60)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
    else:
        print("Could not bind to any port.")
