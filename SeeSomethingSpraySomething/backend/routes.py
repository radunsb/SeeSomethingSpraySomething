from flask import Blueprint, request, jsonify
from db import get_controllers, get_db
from flask_cors import CORS
from datetime import datetime

class Controller():
    _id: int
    controller_name: str
    doc_link: str
    def to_json(self):
        return {
            '_id': self._id,
            'controller_name': self.controller_name,
            'doc_link': self.doc_link
        }
    @staticmethod
    def from_json(response):
        return Controller(_id=response._id, controller_name=response.controller_name, doc_link=response.doc_link)

api_v1 = Blueprint(
    'api_v1', 'api_v1', url_prefix='/api/v1')

CORS(api_v1)

@api_v1.route('/controllers')
def api_get_controllers():
    controllers = list(map(Controller.from_json(request.json), get_controllers()))
    return jsonify({
        "retrieved": datetime.utcnow().isoformat(),
		"count": len(controllers),
		"comments": [map(lambda controller: controller.toJson(), controllers)]
    })