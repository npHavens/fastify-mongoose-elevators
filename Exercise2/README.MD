## Nick Havens Exercise 2 Solution

### Running Locally ###

* Node version >= 12
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
- Built in ID generation for Mongoose has been overridden with 1 digit ID's for simplicity sake and readability. The ID needs to be passed in the request to create buildings or elevators, as shown in the swagger. I've been using the convention of Elevator ID: capital letter like `A` and Building ID: single digit number like `1`
- There are some existing Building and Elevator collections in the `db` directory that can be optionally imported

### Questions ###
How can your implementation be optimized?
  - Calls to the DB could be reduced by using MongoDB queries for the aggregation calls instead of multiple Mongoose methods.

  - The amount of sorting could be reduced in the queueFloor controller but since I assume there won't ever be more than a few hundred floors in a building it should be a trivial amount of time tp process.

  - I didn't have time to do the optimization for elevators going to floors most visited at certain times of day but I did optimize it to go up or down based on which floor is closer, and then go to all remaining floors in queue in logical order.

How much time did you spend on your implementation?
 -  ~7 hrs

What was most challenging for you?
 -  Definitely the Phase 3 sorting of queued floors.
