# Dinder Web Application

This is the dinder web application. Made by Won Kim, Fa Taepaisitphongse, Loc Mai, and Alex Gu

## Setup

This section will walk you through the steps to set up your laptop for development.

### Application Dependencies

We will need to install [Node.js](https://nodejs.org/en/about) to run React and set up our backend. You can verify whether Node.js is installed by typing `which node` on the terminal.

### Acquiring the code

In your terminal, navigate to where you want the `dinder` directory containing the source code. To pull the code, run the following command:

```sh
# Terminal
git clone https://github.com/locmai1/dinder.git
```

If the command did not error out, you can now `cd` to a folder named `dinder`.

### Running The Application

On terminal inside your `dinder` directory, type:

1. `npm install` to install all the necessary packages to run the application,
2. To start development, follow any commands below as needed for your task:
   1. `npm run start:client` to start the frontend only,
   2. `npm run start:server` to start the backend only,
   3. `npm run dev` to start both frontend and backend,

If the commands did not error out, then congrats! You've successfully started the application and are ready to make some changes. You can visit `http://localhost:3000/` to view the website and `http://localhost:3001/` to access the server.

## Development

This section outlines some guidelines and expectations for development.

### Making Changes

The general process to follow before starting your task is as follows:

1. `git checkout main`
2. `git checkout -b <Your name>/<Task>`
3. Make your changes
4. Once you're happy with your changes:
   1. `git add <file 1> <file 2> ... <file n>` if you want to stage some files or `git add .` if you want to stage all files to commit for version control,
   2. `git commit -m "<A message to describe your changes>"`,
5. Go to the [GitHub repository](https://github.com/locmai1/dinder) to make a Pull Request (PR).

## Resources / Additional Information

### Figma

When carrying out your task, please refer to the Figma design made by Fa [here](https://www.figma.com/file/HpGWsP1aUet15WpXEmhkWh/Dinder?type=design&node-id=806-469&mode=design). Please try to get your task as closely related to the design as possible and also keep in mind the mobile responsive as well. 
