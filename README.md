# Property manager microservice

----------------------------------

This is microservice which responsible in property management in NodeJs + Typescript.

## Technology consideration
Nodejs - Good for scalable and high-performance applications.

Typescript - Catching errors earlier, Improved code maintainability, Improved scalability.

MongoDB - Can handle high volumes of traffic by scaling horizontally across multiple servers, design to high performance.
          We also don't have complex relations between entities because we have only one entity (Record).

Pino - Pino is extremely fast and has a low overhead, good for our high traffic volume.

Mongoose - Easy to use, i knew that it can be suitable for the requirements.

## TODO
1. Make the search more generic.
I would add basic class of filter (BaseFilter), and create for each filter a new class (ToDateFilter) which implements
    base filter method and override it by the relevant logic.
    Then in the 
2. Integration testing


## API
Checkout the OpenAPI spec [here](/swagger.yaml)

## Installation

Install deps with yarn

```bash
yarn install
```

## Run Locally

Clone the project

```bash

git clone https://github.com/ronnahom96/property-manager

```

Go to the project directory

```bash

cd property-manager

```

Install dependencies

```bash

yarn install

```

Start the server

```bash

yarn start

```

## Running Tests

To run tests, run the following command

```bash

yarn run test

```

To only run unit tests:
```bash
yarn run test:unit
```

To only run integration tests:
```bash
yarn run test:integration
```
