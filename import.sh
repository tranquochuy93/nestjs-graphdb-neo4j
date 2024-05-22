#!/bin/sh
echo "start sh file";
if [ ! -d /data/databases/flights.db ]; then { /var/lib/neo4j/bin/neo4j-admin import \
--database=flights.db \
--nodes=Airline=/var/lib/neo4j/import/airlines.csv \
--nodes=Plan=/var/lib/neo4j/import/plans.csv \
--nodes=Airport=/var/lib/neo4j/import/airports.csv; \
chmod -R 777 /data; chmod -R 777 /logs; } else { echo "flights.db already exists"; } fi
