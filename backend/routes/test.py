from flask import Blueprint, jsonify, abort, current_app

# register the blueprint 
test_routes = Blueprint('test', __name__, url_prefix='/test')


@test_routes.route('/basic')
def basic_test():
    return jsonify("Test successful!"), 200


@test_routes.route('/dbtest')
def db_test_route():
    try:
        query = """
            select "DISTRICT", "SECTOR", "BEAT", "BEAT_NUM", ST_AsGeoJSON(ST_simplify("the_geom", .003))::jsonb from police_beats"""

        # get the db_manager from the app context
        db_manager = current_app.config['DB_MANAGER']
        result = db_manager.execute_query(query)

        geojson = []
        for r in result:
            geojson.append({
                "type": "Feature",
                "properties": {
                    "district": r[0],
                    "sector": r[1],
                    "beat": r[2],
                    "beat_num": r[3]
                },
                "geometry": r[4]
            })

    except Exception as e:
        abort(500, description=e)  

    return jsonify({
        "type": "FeatureCollection", "features": geojson
    }), 200