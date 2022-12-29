# Frontend

## Getting Started

Create a `.env` in the `/frontend` directory of the project and add the variable:
```
REACT_APP_DJANGO_HOST=http://localhost:8000
```

The Node Package Manager is required for installing and building the frontend project.
Use 
```
npm i --legacy-peer-deps
``` 
 to install all dependencies.

Once all packages and requirements are installed, the command
```
npm start
```
can be used to start the frontend project in development mode. During this phase, all changes made in any file will lead to a rerender of said file. To deploy the project on a server, the command
```
npm build
```
is required. All these commands can be found inside the file package.json.
