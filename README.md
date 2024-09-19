# Shacktopus

Shacktopus is a React-based web ui for controlling custom smart home stuff in the Shack, mainly [Kaleidoscope](https://github.com/mrd0ll4r/kaleidoscope).

It depends on it's backend server, [Reef](https://github.com/baldufal/reef).

## Setting it up for development

As a prerequesite you need to have [Node JS](https://nodejs.org/) installed.

1. Pull the repo using `git pull git@github.com:baldufal/shacktopus.git` or `git pull https://github.com/baldufal/shacktopus.git`.
2. Install the dependencies by executing `npm install` in the shacktopus directory.
3. Run the vite development server using `npm run dev`. Make sure [Reef](https://github.com/baldufal/reef) is running.
4. You can now visit the web ui on http://localhost:5173/. If login is not possible, there probably is a problem with the connection to [Reef](https://github.com/baldufal/reef). Make sure it is running and configured on the same port as specified in the *vite.config.ts* file.
