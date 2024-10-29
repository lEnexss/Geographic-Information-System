#!/bin/bash

# we are now inside the linux environment of our PostGIS container
echo "Hi from the import script"

# add any code here (e.g. osm2pgsql or ogr2ogr imports) 

# explanation of flags
# -C: Creates the raster table and ensures that constraints are applied. Constraints include nodata values, ensuring that the raster data adheres to expected null value representations.
# -a: Appends data to an existing table. Used here for importing additional datasets after the initial table creation
# -I: Creates a GiST index on the raster column (rast). Indexes can significantly improve performance on spatial queries, such as finding rasters that intersect with a given geometry.
# -M: Adds support for using out-of-db rasters and registers the raster columns in the raster_columns view. This option is useful for managing large datasets by allowing data to be stored outside the database, yet still be queryable.

raster2pgsql -s 4326 -C /importdata/Congo_2014_bakongo_nord_sud.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
raster2pgsql -s 4326 -a /importdata/Congo_2014_bas_kasai_et_kwilu_kwngo.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
raster2pgsql -s 4326 -a /importdata/Congo_2014_basele_k_man_et_kivu.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
raster2pgsql -s 4326 -a /importdata/Congo_2014_cuvette_central.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
raster2pgsql -s 4326 -a /importdata/Congo_2014_kasai_katanga_tanganika.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
raster2pgsql -s 4326 -a /importdata/Congo_2014_lunda.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
raster2pgsql -s 4326 -a /importdata/Congo_DRC_2014_ubangi_et_itimbiri.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
raster2pgsql -s 4326 -a /importdata/Congo_DRC_2014_uele_lac_albert.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432


# does not import into database because table constraints are violated -> drop constraints in .sql and try again afterwards

# raster2pgsql -s 4326 -a /importdata/Kenya_2009_embu.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -a /importdata/Kenya_2009_kalenjin.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -a /importdata/Kenya_2009_kamba.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -a /importdata/Kenya_2009_kikuyu.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -a /importdata/Kenya_2009_kisii.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -a /importdata/Kenya_2009_luhya.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -a /importdata/Kenya_2009_luo.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -a /importdata/Kenya_2009_masai.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -a /importdata/Kenya_2009_meru.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -a /importdata/Kenya_2009_mijikenda_swahili.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -a /importdata/Kenya_2009_other.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -a /importdata/Kenya_2009_somali.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -a /importdata/Kenya_2009_taita_taveta.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432

# raster2pgsql -s 4326 -a /importdata/Senegal_2013_diola.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -a /importdata/Senegal_2013_mandingue.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -a /importdata/Senegal_2013_not_a_senegalese.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -a /importdata/Senegal_2013_other.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -a /importdata/Senegal_2013_poular.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -a /importdata/Senegal_2013_serer.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -a /importdata/Senegal_2013_soninke.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -I -M -a /importdata/Senegal_2013_wolof.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432

echo "Import script execution completed"