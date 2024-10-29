# specify base image that we want to extend
FROM kartoza/postgis:14-3.3

# set environment variables
ENV POSTGRES_DB="johndoe_db"
ENV POSTGRES_USER="johndoe"
ENV POSTGRES_PASS="johndoe_pass"

# install required packages
#RUN apt-get update
## raphas ideeRUN apt-get install -y osm2pgsql gdal-bin wget
# install required packages
RUN apt-get update && apt-get install -y --fix-missing osm2pgsql gdal-bin wget && \
    apt-get install -y postgis || true

# RUN apt-get install -y postgis

# copy data into the docker container
COPY data /importdata

# copies the init folder to the entrypoint of the docker container
# (all scripts will be executed when the container is build)
COPY init /docker-entrypoint-initdb.d