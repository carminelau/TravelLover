from flask import Flask
from flask_pymongo import PyMongo

application = Flask( __name__)
application.config["MONGO_URI"] = "mongodb+srv://root:BDq0yVKajvkufJoD@travellover.irvmm4y.mongodb.net/test"
application.config['MONGO_CONNECT'] = True

mongo = PyMongo(application)
db=mongo.db