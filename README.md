# NESTJS-PLATFORM

### Install package
```bash
npm i
```

### Start docker compose
```bash
docker-compose up
```

### Start app
```bash
npm run start:dev
```

### import
```ts
--relationships=FLIES_TO=/var/lib/neo4j/import/fliesTo.csv; 

//AirlineId,Name,Alias,IATA,ICAO,Callsign,Country,Active
LOAD CSV WITH HEADERS FROM 'https://github.com/vladbatushkov/flights/raw/master/data/airlines.csv' AS line
FOREACH(active IN CASE WHEN line.Active = "Y" THEN [line] ELSE [] END |
  MERGE (a:Airline { name: active.Name, code: active.IATA, country: active.Country })
)
``` 