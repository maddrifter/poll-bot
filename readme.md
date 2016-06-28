# Set up with local host

1. Download npm at https://nodejs.org/en/

2. Open up terminal

3. Install gulp and webpack globally by typing:

    ```
    npm install -g gulp webpack
    ```

    If there is permission error, you probably need sudo aka

    ```
    sudo npm install -g gulp webpack
    ```

3. Clone this repo:

    ```
    git clone https://github.com/maddrifter/poll-bot.git
    ```

4. Navigate to this repo

    To get all dependent packages:

    ```
    npm install
    ```

    Launch this to local host:
    ```
    gulp
    ```

5. Things should be green. If so, navigate to ``` localhost:8009 ``` using your favorite browser to see page

# Production deploy

1. `gulp webpack`

2. `firebase deploy` or you can export what is on the /public/ folder
