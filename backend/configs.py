from flask import Flask
from flask_pymongo import PyMongo

application = Flask( __name__)
application.config["MONGO_URI"] = "mongodb://gis-code-mongo-1:27017/GIS"
application.config['MONGO_CONNECT'] = True

mongo = PyMongo(application)

db=mongo.db