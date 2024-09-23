import subprocess
import sys

def run_npm_start():
    try:
        # Start the npm application in the background using nohup
        with open('/usr/share/nginx/html/app.log', 'a') as log_file:
            subprocess.Popen(['nohup', 'npm', 'start'], cwd='/usr/share/nginx/html/', stdout=log_file, stderr=log_file)

        print("NPM start executed successfully in the background.........")
    except Exception as e:
        print(f"Error executing npm start1: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    run_npm_start()
