from flask import Flask
from flask_pymongo import PyMongo

application = Flask( __name__)

application.config["MONGO_URI"] = "mongodb+srv://root:Lu4eRbp0ofaoWb9Q@travellover.irvmm4y.mongodb.net/main"
application.config['MONGO_CONNECT'] = True

mongo = PyMongo(application)
db=mongo.db