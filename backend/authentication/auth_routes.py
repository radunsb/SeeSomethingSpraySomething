from flask import Blueprint

auth_v1 = Blueprint(
    'auth_v1', 'auth_v1', url_prefix='/auth/v1')