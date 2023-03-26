# Property manager microservice

----------------------------------

This is microservice which responsible in property management in NodeJs + Typescript.

## Technology consideration
Nodejs - Good for scalable and high-performance applications.

Typescript - Catching errors earlier, Improved code maintainability, Improved scalability.

MongoDB - Can handle high volumes of traffic by scaling horizontally across multiple servers, design to high performance.
          We also don't have complex relations between entities, because we have only one entity (Record).

Pino - Pino is extremely fast and has a low overhead, good for our high traffic volume.

Mongoose - Easy to use, i knew that it can be suitable for the requirements.
Tsyringe - For Dependency Injection

## TODO
1. Make the search more generic.
    I would add basic class of filter (BaseFilter), and create for each filter a new class (ToDateFilter) which implements
        base filter method and override it by the relevant logic.
        Then in the "buildQueryFromFilters" function i would pass over all the filters and append the logic to the query.
2. Integration testing.
3. Validations: DateTo Filter can't come before fromDate filter.
4. Using cache mechanism to store properties balance
    We can use external tool like Redis or in memory solution.
5. Using traces to track request path.


## API
Checkout the OpenAPI spec [here](/swagger.yaml)

## Installation

Install deps with yarn

```bash
yarn
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

run docker-compose to run locally mongo db instance.

```bash

docker-compose up -d

```

create .env file in config directory with the local db connection url

```bash

DB_CONNECTION_URL="mongodb+srv://ronh:102030@cluster0.ufp673v.mongodb.net/?retryWrites=true&w=majority"

```

Install dependencies

```bash

yarn

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
