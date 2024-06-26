# Backend Structure

## Folders

- node_modules/
    - Stores the npm modules or the "libraries" we will be using in this project
- rsa/
    - There we will generate the 
- src/
    - Where our source code lies
- test/
    - Where one would write tests

## Root Files

- .prettierrc
    - Defines formatting in this project for use with the prettier vscode plugin
- .gitignore
    - Tells git what files to ignore when committnig
- gen-keys.sh
    - A simple script to generate the ssh key pair for us
- openapi.yaml
    - The API Documentation for this backend
- tsconfig.json
    - Stores configuration parameters for the typescript compiler
- package(-lock).json
    - Keeps track of the project information aswell as the packages we are using and where

## Source Directory

- controller/
    - *.controller.ts
- middleware/
    - *.ts
- model/
    - *.model.ts
- router/
    - *.router.ts
- schema/
    - *.schema.ts
- service/
    - *.service.ts
- types/
    - *.types.ts
- util/
    - *.util.ts
- ws/
