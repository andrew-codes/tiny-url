# Dev Container

A [dev container](https://code.visualstudio.com/docs/devcontainers/containers) is provided that includes all necessary software to run the project.

1. Docker needs to be installed (if running on a local host)
2. X11 server (see [related caveat](./#forwarding-display) for more details)
   1. On macOS, tested and verified with [XQuartz](https://www.bing.com/ck/a?!&&p=c21da4f99329c03fJmltdHM9MTcxODg0MTYwMCZpZ3VpZD0zOTJjZTBlOC1iMzRjLTY3Y2MtMDU4NC1mM2NkYjI2MDY2NjUmaW5zaWQ9NTIyNw&ptn=3&ver=2&hsh=3&fclid=392ce0e8-b34c-67cc-0584-f3cdb2606665&psq=xquartz+&u=a1aHR0cHM6Ly93d3cueHF1YXJ0ei5vcmcv&ntb=1)
   2. Any configured X11 server on Windows

## Caveats

### Forwarding Display

E2E and component tests require a display; meaning that an X11 display must be forwarded over SSH and therefore require an X11 server running on the host machine. This is true when using remote dev containers such as GitHub codespaces or locally via Docker. I have verified this is working on my local macOS environment.

Forwarding the display creates a less than ideal DX when developing. Running a browser (and therefore E2E and component tests for development) will produce a sluggish experience when interacting with the web app. This is the primary reason it is not the advised method for running.

### Arch Compatibility

Note that when using the dev container, only the Chromium browser is installed. MS Edge does not support installation on arm64 Linux containers; of which my development machine is. If all machines ran amd64 CPUs, then this MS Edge would be feasible to install and use.
