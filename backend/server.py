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
from flask import Flask, redirect, url_for, render_template, request, jsonify
import numpy


app = Flask(__name__)
CORS(app)

@app.route("/")
def hello():
    return "Hello World"

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

#estrai luoghi di interesse di un determinato tipo
@app.route("/visualizzaTipo", methods=['POST','GET'])
def byTipo():
    tipo = request.form.get("criterio")

    luoghi= poi_places.find({"Tipo": tipo}, {"_id": 0})
    
    risposta = {"status": "success", "luoghi": list(luoghi), "tipo": tipo}
    return jsonify(risposta)

#estrai luoghi di interesse di un determinato tipo
@app.route("/visualizzaVicinoComune", methods=['POST','GET'])
def vicinoComune():
    #comune contiene il nome del comune del quale vogliamo cercare i luoghi di interesse vicini
    comune = request.form.get("comune")

    #prendo il parametro range per settare nella query near la distanza massima (attualmente 5000metri)
    #range= request.form.get("range")

    #prendo le coordinate del comune di riferimento per eseguire la query near (attualmente manca il geojson con i punti dei comuni)
    #coordinate_comune=comuni_geojson.find({"properties.name": comune},{"geometry.coordinates":1})


    #restituisce tutti i luoghi di interesse da 0 a 5 km rispetto un paio di cordinate (che dovrebbero essere quelle del comune di riferimento)
    luoghi_vicino_comune=luoghi_di_interesse_geo.find({"features.geometry":{"$near":{"$geometry":{"type":"Point", "coordinates": [15.037362, 40.763152]},"$minDistance": 0,"$maxDistance": 5000}}},{"_id": 0})
    risposta = {"status":"success", "luoghi":list(luoghi_vicino_comune),"comune_scelto":comune}

    return jsonify(risposta)

#inserire geojson dei comuni della provincia di salerno
@app.route("/insertComuni", methods=['POST'])
def insertComuni():
    with open("backend\\geojsonprovinciasalerno.geojson", "r") as f:
        data = json.load(f)
        for item in data['features']:
            comuni_geojson.insert_one(item)

    return jsonify({"status": "success"})

#inserire fermate autobus nella collection fermate
@app.route("/insertFermate", methods=['POST'])
def insertFermate():
    stations.drop()
    autob= pd.read_csv("dati\\fermate-autobus.csv", sep=";").replace(numpy.nan, '', regex=True)
    stations.insert_many(autob.to_dict('records'))
    treni= pd.read_csv("dati\\stazioni-treni.csv", sep=",")
    stations.insert_many(treni.to_dict('records'))

    return jsonify({"status": "success"})

#restituisci tutte le fermate dato il tipo
@app.route("/getFermate", methods=['POST'])
def getFermate():
    tipo = request.form.get("tipo")
    fermate = stations.find({"Tipo": tipo}, {"_id": 0})
    return jsonify({"status": "success", "fermate": list(fermate)})

@app.route("/insertPercorso", methods=['POST'])
def insertPercorso():
    coordinate= request.form.get("coordinate")
    nome= request.form.get("nome")
    percorso = geojson.LineString(coordinate)
    
    percorso.insert_one(percorso)
    return jsonify({"status": "success"})


if __name__ == "__main__":
    app.run(host='0.0.0.0', port="5000", debug=True)

