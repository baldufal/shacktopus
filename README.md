# Shacktopus

Shacktopus is a React-based web ui for controlling custom smart home stuff in the Shack, mainly [Kaleidoscope](https://github.com/mrd0ll4r/kaleidoscope).

It depends on it's backend server, [Reef](https://github.com/baldufal/reef).

## Running it via docker

As a prerequesite you need to have [Docker](https://www.docker.com/) installed.

1. Create a folder for shacktopus and reef, e.g. using `mkdir shacktopus` and `cd shacktopus`
2. Clone the repo using `git clone git@github.com:baldufal/shacktopus.git` or `git clone https://github.com/baldufal/shacktopus.git`
3. Create a *.env* file by copying the file *.env.example* and updating it with arbitrary credentials for the MongoDB instance.
4. In the parent folder, clone the Reef repo using `git clone git@github.com:baldufal/reef.git` or `git clone https://github.com/baldufal/reef.git`
5. Configure Reef via the config.js as described [here](https://github.com/baldufal/reef)
6. Run `docker compose up`.
7. Optional: Pull new code and redeploy the frontend, the backend or both using one of the redeploy scripts.

## Setting it up for development

As a prerequesite you need to have [Node JS](https://nodejs.org/) installed.

1. Clone the repo using `git clone git@github.com:baldufal/shacktopus.git` or `git clone https://github.com/baldufal/shacktopus.git`.
2. Install the dependencies by executing `npm install` in the shacktopus directory.
3. Run the vite development server using `npm run dev`. Make sure [Reef](https://github.com/baldufal/reef) is running.
4. You can now visit the web ui on http://localhost:5173/. If login is not possible, there probably is a problem with the connection to [Reef](https://github.com/baldufal/reef). Make sure it is running and configured on the same port as specified in the *vite.config.ts* file.
