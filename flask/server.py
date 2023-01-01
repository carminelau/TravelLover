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

app = Flask(__name__)

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
    username = request.form["username"]
    password = request.form["password"]
    user = users.find_one({"username": username, "password": password})
    if user is not None:
        user = users.find_one({"email": username, "password": password})
        if user is not None:
            return jsonify({"status": "ok", "user": user})
        else:
            return jsonify({"status": "nessun account trovato"})
    else:
        return jsonify({"status": "nessun account trovato"})

#registrazione con username, password, email, nome, cognome, data di nascita
@app.route("/register", methods=['POST'])
def register():
    username = request.form["username"]
    password = request.form["password"]
    email = request.form["email"]
    name = request.form["name"]
    surname = request.form["surname"]
    birthdate = request.form["birthdate"]
    risposta = {}
    if re.match(r"[^@]+@[^@]+\.[^@]+", email):
        if re.match(r"^[a-zA-Z0-9]*$", username):
            if re.match(r"^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$", password):
                if re.match(r"^[a-zA-Z]*$", name):
                    if re.match(r"^[a-zA-Z]*$", surname):
                        if re.match(r"^[0-9]{4}-[0-9]{2}-[0-9]{2}$", birthdate):
                            user = users.insert_one({"username": username, "password": password, "email": email, "name": name, "surname": surname, "birthdate": birthdate})
                            risposta["status"] = "ok"
                            risposta["user"] = user
                        else:
                            risposta["status"] = "errore data di nascita"
                    else:
                        risposta["status"] = "errore cognome"
                else:  
                    risposta["status"] = "errore nome"
            else:
                risposta["status"] = "errore password"
        else:   
            risposta["status"] = "errore username"
    else:
        risposta["status"] = "errore email"
    return jsonify(risposta)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port="5000", debug=True)

