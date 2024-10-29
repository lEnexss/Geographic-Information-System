-- copy data from files into the database

-- drop & create a table for mining data
DROP TABLE IF EXISTS mining_polygons;
CREATE TABLE IF NOT EXISTS mining_polygons (
    "geom" geometry(Polygon, 4326),
    "ISO3_CODE" character(3),
    "COUNTRY_NAME" character(40),
    "AREA" float
);

-- conflict data
DROP TABLE IF EXISTS afr_09_ucdp;
CREATE TABLE IF NOT EXISTS afr_09_ucdp (
    "id" numeric,
    "latitude" numeric,
    "longitude" numeric,
    "type_of_violence" integer,
    "best" integer,
    "dyad_name" character varying,
    "location" geometry(Point, 4326)
);


-- Copy the data for afr_09_ucdp with additional columns
copy afr_09_ucdp ("id", "latitude", "longitude", "type_of_violence", "best", "dyad_name") from '/importdata/afr_09_ucdp.csv' with (FORMAT CSV, HEADER, NULL '');

-- Generate the geometry for each point in afr_09_ucdp
UPDATE afr_09_ucdp
SET location = ST_SetSRID(ST_MakePoint("longitude", "latitude"), 4326);


-- copy from csv file into postgis table
copy mining_polygons ("geom", "ISO3_CODE", "COUNTRY_NAME", "AREA") from '/importdata/mining_polygons.csv' with (FORMAT CSV, HEADER 1, NULL '');

-- add columns for calculating the buffers
ALTER TABLE mining_polygons
ADD COLUMN "geom_buffer_3km" geometry(Polygon, 4326),
ADD COLUMN "geom_buffer_5km" geometry(Polygon, 4326),
ADD COLUMN "geom_buffer_10km" geometry(Polygon, 4326);


-- Use World Mercator (EPSG:3857) which allows buffering in meters
UPDATE mining_polygons
SET "geom_buffer_3km" = ST_Transform(
                            ST_Buffer(
                                ST_Transform("geom", 3857), -- Transform geom to EPSG:3857
                                3000 -- Buffer distance in meters
                            ), 
                            4326 -- Transform back to EPSG:4326
                        );

UPDATE mining_polygons
SET "geom_buffer_5km" = ST_Transform(
                            ST_Buffer(
                                ST_Transform("geom", 3857), -- Transform geom to EPSG:3857
                                5000 -- Buffer distance in meters
                            ), 
                            4326 -- Transform back to EPSG:4326
                        );

UPDATE mining_polygons
SET "geom_buffer_10km" = ST_Transform(
                            ST_Buffer(
                                ST_Transform("geom", 3857), -- Transform geom to EPSG:3857
                                10000 -- Buffer distance in meters
                            ), 
                            4326 -- Transform back to EPSG:4326
                        );

ALTER TABLE mining_polygons RENAME COLUMN "geom" TO "geom_buffer_0km";

ALTER TABLE side DROP CONSTRAINT enforce_height_rast;
ALTER TABLE side DROP CONSTRAINT enforce_width_rast;
ALTER TABLE side DROP CONSTRAINT enforce_max_extent_rast;
ALTER TABLE side DROP CONSTRAINT enforce_same_alignment_rast;