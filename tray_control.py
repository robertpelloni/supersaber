#!/usr/bin/env python3
"""
tray_control.py - SuperSaber System & Server Tray / Process Controller
Provides process status checks, live logging, and graceful shutdown controls
for the SuperSaber webpack dev server (port 3000) and multiplayer relay (port 3001).
Can run in headless CLI mode or GUI system tray mode if pystray/tkinter is available.
"""

import os
import sys
import time
import signal
import subprocess
import urllib.request

DEV_PORT = 3000
RELAY_PORT = 3001
LOG_FILE = "dev_server.log"

def check_port(port):
    """Checks if a process is listening on the specified port."""
    try:
        output = subprocess.check_output(["lsof", "-t", f"-i:{port}"], stderr=subprocess.DEVNULL)
        pids = [int(p) for p in output.decode().strip().split() if p]
        return pids
    except Exception:
        return []

def get_server_status():
    """Returns human-readable server status."""
    dev_pids = check_port(DEV_PORT)
    relay_pids = check_port(RELAY_PORT)
    status = []
    if dev_pids:
        status.append(f"Webpack Dev Server (Port {DEV_PORT}): RUNNING [PIDs: {dev_pids}]")
    else:
        status.append(f"Webpack Dev Server (Port {DEV_PORT}): STOPPED")

    if relay_pids:
        status.append(f"Multiplayer Relay (Port {RELAY_PORT}): RUNNING [PIDs: {relay_pids}]")
    else:
        status.append(f"Multiplayer Relay (Port {RELAY_PORT}): STOPPED")
    return "\n".join(status)

def stop_servers():
    """Gracefully terminates running dev servers."""
    print("[SuperSaber Tray] Stopping dev and relay servers...")
    pids = set(check_port(DEV_PORT) + check_port(RELAY_PORT))
    if not pids:
        print("[SuperSaber Tray] No active servers found.")
        return
    for pid in pids:
        try:
            os.kill(pid, signal.SIGTERM)
            print(f"[SuperSaber Tray] Sent SIGTERM to PID {pid}")
        except Exception as e:
            print(f"[SuperSaber Tray] Failed to stop PID {pid}: {e}")

def view_logs(lines=20):
    """Prints the most recent dev server log lines."""
    if os.path.exists(LOG_FILE):
        print(f"--- Dev Server Log ({LOG_FILE}, Last {lines} lines) ---")
        try:
            with open(LOG_FILE, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.readlines()
                print("".join(content[-lines:]))
        except Exception as e:
            print(f"Error reading log file: {e}")
    else:
        print(f"[SuperSaber Tray] Log file '{LOG_FILE}' does not exist yet.")

def run_cli():
    """Runs interactive or command line mode."""
    if len(sys.argv) > 1:
        cmd = sys.argv[1].lower()
        if cmd == "status":
            print(get_server_status())
        elif cmd == "stop" or cmd == "quit":
            stop_servers()
        elif cmd == "logs":
            view_logs()
        else:
            print(f"Unknown command: {cmd}. Usage: tray_control.py [status|stop|logs]")
    else:
        print("=== SuperSaber Server Tray & Process Controller ===")
        print(get_server_status())
        print("\nCommands available:")
        print("  python3 tray_control.py status  - Check port 3000 / 3001 server state")
        print("  python3 tray_control.py logs    - View recent dev server output")
        print("  python3 tray_control.py stop    - Gracefully terminate background servers")

if __name__ == "__main__":
    run_cli()
