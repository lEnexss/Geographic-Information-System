# DATABASE

This folder contains the code for the database of the application, running a PostgreSQL databse with [PostGIS](https://postgis.net/) extension.

## Connect

In the `Dockerfile` you define the credentials to connect to the database (`POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASS`). You can use these to connect to the database with your favorite SQL client ([DBeaver](https://dbeaver.io/), [QGIS](https://qgis.org/de/site/), [DataGrip](https://www.jetbrains.com/datagrip/)). The port is defined in the `../docker-compose.yaml` file (typically 5432).

## Initialize

Any files in the `data` folder will be copied to the Docker container (`/importdata/` folder) during the build process.
Any files in the `init` folder will be copied to the entrypoint of the docker container (`/docker-entrypoint-initdb.d/`), meaning they will be executed when the container is build. Here you should add `.sql` or `.sh` scripts that fill the database with your data. 
Check the respective default files on how to do so. Please note that any additional package that you need for data import (e.g. [osm2pgsql](https://osm2pgsql.org/), [ogr2ogr](https://gdal.org/programs/ogr2ogr.html)) must first be installed in the `Dockerfile`.