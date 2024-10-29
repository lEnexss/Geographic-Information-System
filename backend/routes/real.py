from flask import Blueprint, jsonify, abort, current_app, request, send_file
import base64
import json
import os
import io

# register the blueprint
real_routes = Blueprint('real', __name__, url_prefix='/real')


@real_routes.route('/basic')
def basic_test():
    return jsonify("Test successful!"), 200

@real_routes.route('/mining')
def db_mining_route():
    try:
        # simplify buffer polygons to make the app faster
        # get the db_manager from the app context
        miningBuffer = request.args.get("buffer", 0)
        column_name = f"geom_buffer_{miningBuffer}km"  # miningBuffer should be validated to avoid SQL injections
        query = f"""
            SELECT ST_AsGeoJSON(ST_Simplify("{column_name}", 0.0001))::jsonb FROM mining_polygons
        """
        
        db_manager = current_app.config['DB_MANAGER']
        result = db_manager.execute_query(query)

        geojson = []
        for r in result:
            geojson.append({
                "type": "Feature",
                "geometry": r[0]
            })

    except Exception as e:
        abort(500, description=e)  

    return jsonify({
        "type": "FeatureCollection", "features": geojson
    }), 200


@real_routes.route('/ethnic')
def db_ethnic_route():
    ethnic_group = request.args.get("ethnic_group", 1)
    query = f'''
        select ST_AsTIFF(rast) FROM side WHERE rid = {ethnic_group}
    '''
    db_manager = current_app.config['DB_MANAGER']
    result = db_manager.execute_query(query)

    return send_file(
        io.BytesIO(result[0][0]),
        mimetype='image/tiff',
        as_attachment=False,
        download_name='ethnic.tif')


@real_routes.route('/conflict')
def db_conflict_route():
    try:
        type_of_violence = request.args.get("type_of_violence", type=int)  # Get type_of_violence from query params
        if type_of_violence not in [1, 2, 3]:
            abort(400, description="Invalid type_of_violence. Must be 1, 2, or 3.")
        
        # Adjusted query to select based on type_of_violence
        query = f"""
            SELECT "id", "type_of_violence", "best", "dyad_name",
                   ST_AsGeoJSON(ST_SetSRID(ST_MakePoint("longitude", "latitude"), 4326))::jsonb AS location
            FROM afr_09_ucdp WHERE "type_of_violence" = {type_of_violence}
        """
        db_manager = current_app.config['DB_MANAGER']
        result = db_manager.execute_query(query)
        geojson = []
        for r in result:
            geojson.append({
                "type": "Feature",
                "properties": {
                    "id": r[0],
                    "type_of_violence": r[1],
                    "best": r[2],
                    "dyad_name": r[3]
                },
                "geometry": r[4]
            })
    except Exception as e:
        abort(500, description=str(e))
    return jsonify({
        "type": "FeatureCollection", "features": geojson
    }), 200