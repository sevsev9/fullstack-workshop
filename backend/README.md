# SuperTicTacToe Backend

## Backend Project Setup

### Install Dependencies

**Packages**:

- bcrypt | crypto library for password hashing
- cors | CORS plugin for expres
- dayjs | timestamp formatting for pino
- dotenv | reading env variables
- express | rest framework
- jsonwebtoken | handles processing of jwts
- mongoose | mongodb orm
- pino | logging utility
- pino-pretty | Pretty print the logs
- zod | schema parsing

**Development Packages**:

- `@types/*` | types for packages that are not native to typescript
- ts-node | run typescript node
- ts-node-dev | hot reload for ts-node
- typescript | typescript

## Configuring the Service

### Environment Variables

| Variable          | Description                                                         | Default | Required |
| ----------------- | ------------------------------------------------------------------- | ------- | -------- |
| PORT              | The port the backend will listen on                                 | 8080    | No       |
| DB_URL            | The MongoDB Connection URL                                          | -       | Yes      |
| SALT_WORK_FACTOR  | The amount of password salt rounds                                  | -       | Yes      |
| ACCESS_TOKEN_TTL  | The lifetime of the issued access tokens                            | -       | Yes      |
| REFRESH_TOKEN_TTL | The lifetime of the issued refresh tokens                           | -       | Yes      |
| PRIVATE_KEY_FILE  | The location of the file containing the private key to use for JWTs | -       | Yes      |
| PUBLIC_KEY_FILE   | The location of the file containing the public key to use for JWTs  | -       | Yes      |
| RUN_ENV           | The run environment the backend should consider itself as           | DEV     | No       |
| LOG_LEVEL         | The general log level of the API                                    | info    | No       |


## Game Modes

### Gameplay Options

1. **Meta TicTacToe**
 - If a player wins a subfield, the field cannot be played in anymore.
 - If the won field is chosen, the next player plays in the field that is one index higher than the won field.
 - The won field is marked with the winning player's letter.
 - The game can either be won by winning 3 fields in a row or by amount of fields won
 - if noone got a series and the points are equal it is considered a draw.

2. **Ultmate TicTacToe**
 - If a player scores a point in a field it is counted towards the player's score.
 - If a player plays a move that would land the next move into a field that is fully played in, the player can choose any field to play in.
 - The game is won by the player with the highest score.
 - If the scores are equal, the game is considered a draw.

3. **Super TicTacToe**
 - The game is won by the player that wins 3 fields in a row.
 - If no player wins, the game is considered a draw.
 - If a won field is chosen, the next player plays in the field that is one index higher than the won field.

4. **Normal TicTacToe**
 - A classic 3x3 

## Runnng the Backend for Development

1. Start the docker compose file `docker compose -f docker-compose.dev.yaml up -d`
2. Create a `rsa/` folder and run `./gen-keys.sh` to generate some rsa keys for the jwt auth mechanism
3. Create a `.env` file with the following entries

```dotenv
PRIVATE_KEY_FILE=./rsa/private.key
PUBLIC_KEY_FILE=./rsa/public.key
DB_URL=mongodb://mongo_user:mongo_password@localhost:27017/?authSource=admin
SALT_WORK_FACTOR=10
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=30d
LOG_LEVEL=debug
```

## Features

- [x] JWT Auth
    - [x] register
    - [x] login
    - [x] refresh
    - [x] logout
- [x] User
    - [x] Update User
    - [x] Get User Profile
    - [ ] Game Stats
- [ ] Lobby and Game
    - [ ] Lobby
        - [ ] Create Lobby
        - [ ] Join Lobby
        - [ ] Leave Lobby
            - If the lobby owner leaves the lobby the lobby is automatically deleted and the other user is kicked
        - [ ] Kick Player from Lobby
        - [ ] Lobby Chat
    - [ ] Game
        - [ ] Game State
            - [ ] Game Start
            - [ ] Game End
                - [ ] Win
                - [ ] Lose
                - [ ] Draw
                - [ ] Surrender (also if opponent leaves)
        - [ ] Game Move
            - [ ] Player (client -> backend)
                - [ ] Validate move
            - [ ] Opponent (backend -> client)