# Property manager microservice

----------------------------------

This microservice is responsible for managing properties in NodeJs + Typescript.

## Technology consideration
Nodejs - Good for scalable and high-performance applications.

Typescript - Catching errors earlier, Improved code maintainability, Improved scalability.

MongoDB - Can handle high volumes of traffic by scaling horizontally across multiple servers, design to high performance.
          We also don't have complex relations between entities, because we have only one entity (Record).

Pino - Pino is extremely fast and has a low overhead, good for our high traffic volume.

Mongoose - Easy to use, i knew that it can be suitable for the requirements.
Tsyringe - For Dependency Injection
Cache Mechanism - For simplicity i used in memory cache solution to store the balance per property.

## TODO
1. Make the search more generic.
    I would add basic class of filter (BaseFilter), and create for each filter a new class (ToDateFilter) which implements
        base filter method and override it by the relevant logic.
        Then in the "buildQueryFromFilters" function i would pass over all the filters and append the logic to the query.
2. Integration testing.
3. Validations: DateTo Filter can't come before fromDate filter.
4. Using external tool like Redis to store property balance information.
5. Using traces to track request path.
6. There is a bug when enter number in the date field. (Need to validate it is good format: yyyy-mm-dd)
    i can use moment library for that.
7. Improve monthly report response, adding startingBalance and endingBalance to the response,
8. Adding type attribute for each record.
    Using a type attribute can make it easier to understand and query the data, as you can clearly see the income and expense transactions separated by type. 
    It can also make it easier to add additional transaction types in the future if needed.
    I chose to use positive and negative amount values because it simplify the data model and make it more straightforward to calculate balances.
9. For enabling insert records with old dates:
    9.1. Instead of fetching last record, fetch the record with the last date that older the new date.
    9.2. Update the balance for each record that newer from this date. (we can keep the original document and update the       version).
    This can be very slow and should consider as cron job.

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

create .env file in config directory with the local db connection url

```bash

DB_CONNECTION_URL="<your-db-connection-url>"

```

Note: You can use docker-compose to upload your mongodb local instance, using the command: docker-compose up -d and put "mongodb://localhost:27017" in DB_CONNECTION_URL variable.


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