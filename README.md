# chattyApp

## App Summary

This app was produced during participation in Lighthouse Labs curriculum.

## Explore chattyApp:

!['Chatroom in Action'](https://github.com/jo-wood/chattyApp/blob/master/docs/chatroom_example.png)

## Getting Started

*Usage*

This application relies on running two node instances. Please clone the chattyApp application running the necessary frontend client connection here:

**Frontend Server:**
[chattyApp](https://github.com/jo-wood/chattyApp)

Install the dependencies and start the chattyServer and note any server messages within local console:

```
npm install
node server.js
open http://localhost:3001
```

## Dev Dependencies

Frontend (chattyApp):

* React - Webpack - babel-loader webpack-dev-server

Backend (chattyServer):

* Express - WebSocket - uuid

**please see package.json for further dependencies**

### Features

* if a user does not wish to enter a name, they will display as 'Anonymous'
  * W.I.P - no name change notification upon removing a session username

* a user can change their name at any time by hitting `Enter` within the name input field

* if the user changes their name without hitting `Enter` on the name input, if this name has changed per their session, the name change notification will properly render upon a message submit

* number of users currently in chatroom display on top right of the screen

* each username associated with a message changes in hardwired color options

### Linting

This boilerplate project includes React ESLint configuration.

```
npm run lint
```