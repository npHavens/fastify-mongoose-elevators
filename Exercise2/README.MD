## Nick Havens Exercise 2 Solution

### Running Locally ###

* Node version > 14
* Docker Desktop

`docker-compose up` to start DB

`yarn install` to install packages

`yarn start` to start server

### Testing ###
`yarn test` to run unit tests

### Swagger ###
Documentation is hosted by the server at the below url
[http://localhost:3000/documentation](http://localhost:3000/documentation)

### Notes ###
- Built in ID generation for Mongoose has ben overridden with 1 digit ID's for simplicity sake and readability
- There are some existing Building and Elevator collections in the `db` directory that can be optionally imported

### Questions ###
How can your implementation be optimized?
  Calls to the DB could be reduced by using MongoDB queries for the aggregation calls instead of multiple Mongoose methods.

How much time did you spend on your implementation?
  ~6 hrs

What was most challenging for you?
  Definitely the Phase 3 sorting of queued floors.
