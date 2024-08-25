# Shacktopus

Shacktopus is a React-based web ui for controlling custom smart home stuff in the Shack, mainly [Kaleidoscope](https://github.com/mrd0ll4r/kaleidoscope).

It depends on it's backend server, [Reef](https://github.com/baldufal/reef).

## Setting it up for development

As a prerequesite you need to have [Node JS](https://nodejs.org/) installed.

1. Pull the repo using `git pull git@github.com:baldufal/shacktopus.git` or `git pull https://github.com/baldufal/shacktopus.git`.
2. Create self-signed certificates. This step is necessary because the app is based on https. You can create them by using [mkcert](https://github.com/FiloSottile/mkcert). After installing this tool you can install a local CA (optional, this step will prevent "security risk" warnings in the browser) by typing `mkcert -install` and create the certificates (required) by typing `mkcert localhost`. Then you need to copy the two certificate files in the *shacktopus/cert* directory and make sure the names in *vite.config.ts* match their filenames.
3. Install the dependencies by executing `npm install` in the shacktopus directory.
4. Run the vite development server using `npm run dev`.
5. You can now visit the web ui on https://localhost:5173/. If login is not possible, there probably is a problem with the connection to Reef. Make sure it is running and configured on the same port as specified in the *vite.config.ts* file.
