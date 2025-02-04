from flask import Blueprint, request, jsonify
from db import get_controllers, does_project_exist, get_users, get_user_by_id, get_nozzles, get_guns
from db import save_new_project, overwrite_existing_project, delete_project
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

@api_v1.route('/users/<int:user_id>/new', methods=['GET', 'POST'])
def api_post_new_project(user_id):
    project = request.get_json()
    if(user_id == 1 and project['data']['project_id'] == 0):
        user = save_new_project(user_id, project['data'])
    elif(does_project_exist(user_id, project['data']['project_id'])):
        user = overwrite_existing_project(user_id, project['data'])
    else:
        user = save_new_project(user_id, project['data'])
    return jsonify({
        "retrieved": datetime.utcnow().isoformat(),
		"user": user
    })

@api_v1.route('/users/<int:user_id>/<int:project_id>/delete', methods=['GET', 'POST'])
def api_delete_project(user_id, project_id):
    user = delete_project(user_id, project_id)
    return jsonify({
        "retrieved": datetime.utcnow().isoformat(),
		"user": user
    })