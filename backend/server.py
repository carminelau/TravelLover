#!/usr/bin/env python
from ast import literal_eval
from io import BytesIO
from itertools import chain
import os
import sys
import string
import random
from urllib import response
import requests
from databases import *
from flask import Flask,request,jsonify, send_file
import datetime
import json
import geojson
import pandas as pd
import re
import hashlib
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route("/")
def hello():
    return "Hello World!"

#inserire tutte corse dei treni
@app.route("/insertAllTrains", methods=['POST'])
def insertAllTrains():
    data = request.get_json()
    train_line.insert_one(data)
    return "ok"

#login
@app.route("/login", methods=['POST'])
def login():
    username = request.form.get("username")
    password = request.form.get("password")

    user = users.find_one({"email": username, "password": hashlib.sha256(password.encode('utf-8')).hexdigest()}, {"_id": 0})

    if user is not None:
        return jsonify({"status": "success", "user": user})
    else:
        return jsonify({"status": "failed"})




#registrazione con username, password, email, nome, cognome, data di nascita
@app.route("/register", methods=['POST'])
def register():
    username = request.form.get("username")
    password = request.form.get("password")
    email = request.form.get("email")
    if users.find_one({"email": email}) is not None:
        return jsonify({"status": "failed", "message": "email already exists"})
    else:
        users.insert_one({"email": email, "password": hashlib.sha256(password.encode('utf-8')).hexdigest(), "username": username})
        return jsonify({"status": "success"})


if __name__ == "__main__":
    app.run(host='0.0.0.0', port="5000", debug=True)

