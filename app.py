#!/usr/bin/env python3

import http.server
import socketserver

import argparse

PORT = 3000


def main():
  parser = argparse.ArgumentParser(description='Operate on the site source')

  parser.add_argument('command', choices=["serve", "build"], help='Operation to perform')

  args = parser.parse_args()

  if args.command == "serve":
    serve()
  elif args.command == "build":
    build()

def build():
  pass

def serve():
  handler = http.server.SimpleHTTPRequestHandler

  with socketserver.TCPServer(("", PORT), handler) as httpd:
    print("Server started at localhost:" + str(PORT))
    httpd.serve_forever()


if __name__ == "__main__":
  main()
