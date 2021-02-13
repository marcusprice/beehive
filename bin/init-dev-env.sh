#!/usr/bin/env bash
# installs depenencies and sets up dev and test databases

npm i

psql -U postgres -c "DROP DATABASE IF EXISTS beehive_dev WITH (FORCE);"
psql -U postgres -c "DROP DATABASE IF EXISTS beehive_test WITH (FORCE);;"
psql -U postgres -c "DROP USER IF EXISTS beehive_dev;"
psql -U postgres -c "DROP USER IF EXISTS beehive_test;"
psql -U postgres -c "CREATE DATABASE beehive_dev;"
psql -U postgres -c "CREATE USER beehive_dev WITH ENCRYPTED PASSWORD '${1}';"
psql -U postgres -c 'GRANT ALL PRIVILEGES ON DATABASE beehive_dev TO beehive_Dev;'
psql -U postgres -c "CREATE DATABASE beehive_test;"
psql -U postgres -c "CREATE USER beehive_test WITH ENCRYPTED PASSWORD '${1}';"
psql -U postgres -c 'GRANT ALL PRIVILEGES ON DATABASE beehive_test TO beehive_test;'