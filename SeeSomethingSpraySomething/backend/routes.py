from flask import Blueprint, request, jsonify
from db import get_controllers, get_users, get_user_by_id, get_nozzles, get_guns
from flask_cors import CORS
from datetime import datetime

api_v1 = Blueprint(
    'api_v1', 'api_v1', url_prefix='/api/v1')

CORS(api_v1)

@api_v1.route('/controllers/')
def api_get_controllers():
    controllers = get_controllers()
    return jsonify({
        "retrieved": datetime.utcnow().isoformat(),
		"count": len(controllers),
		"controllers": controllers
    })

@api_v1.route('/nozzles/')
def api_get_nozzles():
    nozzles = get_nozzles()
    return jsonify({
        "retrieved": datetime.utcnow().isoformat(),
		"count": len(nozzles),
		"nozzles": nozzles
    })

@api_v1.route('/guns/')
def api_get_guns():
    guns = get_guns()
    return jsonify({
        "retrieved": datetime.utcnow().isoformat(),
		"count": len(guns),
		"guns": guns
    })


@api_v1.route('/users/')
def api_get_users():
    users = get_users()
    return jsonify({
        "retrieved": datetime.utcnow().isoformat(),
		"count": len(users),
		"users": users
    })

@api_v1.route('/users/<int:user_id>/')
def api_get_user_projects(user_id):
    user = get_user_by_id(user_id)
    return jsonify({
        "retrieved": datetime.utcnow().isoformat(),
		"user": user
    })