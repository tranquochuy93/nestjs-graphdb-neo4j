# FROM neo4j:4.3.5

# LABEL maintainer="Huy Tran <tranquochuyqn93@gmail.com>"

# COPY --chown=neo4j db.dump db.dump
# COPY --chown=neo4j mgt-entrypoint.sh mgt-entrypoint.sh
# RUN chmod +x mgt-entrypoint.sh

# ENV NEO4J_AUTH=neo4j/Secret@123
# ENV NEO4J_dbms_databases_default__to__read__only=true
# ENV NEO4J_dbms_security_auth__enabled=false
# ENTRYPOINT ["./mgt-entrypoint.sh"]

FROM --platform=linux/amd64 neo4j:4.3.5
ENV APOC_VERSION=4.3.0.4
ENV APOC_URI=https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/${APOC_VERSION}/apoc-${APOC_VERSION}-all.jar

COPY import/*.csv import/
COPY import.sh import.sh

# ENV ALGO_VERSION=3.5.4.0
# ENV GRAPH_ALGORITHMS_URI=https://github.com/neo4j-contrib/neo4j-graph-algorithms/releases/download/${ALGO_VERSION}/graph-algorithms-algo-${ALGO_VERSION}.jar

# ENV GRAPHQL_VERSION=3.5.0.4
# ENV GRAPHQL_URI=https://github.com/neo4j-graphql/neo4j-graphql/releases/download/${GRAPHQL_VERSION}/neo4j-graphql-${GRAPHQL_VERSION}.jar

ADD --chown=neo4j:neo4j ${APOC_URI} plugins
# ADD --chown=neo4j:neo4j ${GRAPH_ALGORITHMS_URI} plugins
# ADD --chown=neo4j:neo4j ${GRAPHQL_URI} plugins

# List of plugins ready to use, there are some new versions aren't released in released a Neo4j image, it could lead to an error
# No jar URL found for version in versions.json
# ENV NEO4JLABS_PLUGINS='["apoc", "graph-algorithms", "graphql"]'
# ENV NEO4J_dbms_unmanaged__extension__classes=org.neo4j.graphql=/graphql

# COPY extension_script.sh /extension_script.sh
# ENV EXTENSION_SCRIPT=/extension_script.sh
ENV EXTENSION_SCRIPT=import.sh
ENV NEO4J_dbms_active__database=flights.db
ENV NEO4J_AUTH=neo4j/Secret@123

CMD [ "neo4j" ]