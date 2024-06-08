# SuperTicTacToe Backend


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