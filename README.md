# NESTJS-NEO4J


## Install package
```bash
npm i
```

## Start docker
```bash
docker build .

docker run -it --rm -p 7474:7474 -p 7687:7687 ${image_id}
```

## Start app
```bash
npm run start:dev
```

## Access to neo4j at
```bash
http://localhost:7474/
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