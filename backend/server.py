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
from bson.json_util import dumps
from random import randint

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello():
    pacchetti=poi_itinerary.find()
    return "hello"

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

    #prendo il comune di riferimento per eseguire la query wihin e il suo array di coordinate
    geo_comune=comuni_geojson.find_one({"properties.name": comune})["geometry"]["coordinates"][0]

    #restituisco i luoghi di interesse in un determinato comune
    luoghi_dentro_comune=luoghi_di_interesse_geo.find({"features.geometry":{"$geoWithin":{"$polygon":geo_comune}}},{"_id":0})
    risposta = {"status":"success", "luoghi":list(luoghi_dentro_comune),"comune_scelto":comune}

    return jsonify(risposta)

@app.route("/visualizzaVicinoComuneTipi", methods=['POST'])
def vicinoComuneTipi():
    comune = request.form.get("comune")
    geo_comune=comuni_geojson.find_one({"properties.name": comune})["geometry"]["coordinates"][0]
    luoghi_dentro_comune=luoghi_di_interesse_geo.find({"features.geometry":{"$geoWithin":{"$polygon":geo_comune}}},{"_id":0})
    tipi_disponibili= luoghi_dentro_comune.distinct("tipo")
    return tipi_disponibili

@app.route("/getNumPOIOgniComune", methods=['POST'])
def getNumPOIOgniComune():
    tipi_disponibili = {}

    geo_comuni = comuni_geojson.find({})

    for geo_comune in geo_comuni:

        try:
            luoghi_dentro_comune = list(luoghi_di_interesse_geo.find({"features.geometry": {"$geoWithin": {"$polygon": geo_comune["geometry"]["coordinates"][0]}}}, {"_id": 0}))
        except:
            print(geo_comune)

        tipi = {}
        for luogo in luoghi_dentro_comune:
            tipo = luogo.get("tipo")
            tipi[tipo] = tipi.get(tipo, 0) + 1

        tipi_disponibili[geo_comune["properties"]["name"]] = tipi

    return jsonify({"tipi": tipi_disponibili, "comuni": comuni_geojson.distinct("properties.name")})

@app.route("/getNumPaccchettiOgniTipologia", methods=['POST'])
def getNumPacchettiOgniTipologia():
    tipi_disponibili = {}

    for pacchetto in poi_itinerary.find({}):
        tipo = pacchetto.get("tipologia")

        if tipo in tipi_disponibili:
            tipi_disponibili[tipo] += 1
        else:
            tipi_disponibili[tipo] = 1

    return jsonify({"tipi_pacchetto": tipi_disponibili})

@app.route("/getNumPOIOgniTipologia", methods=['POST'])
def getNumPOIOgniTipologia():
    tipi_disponibili = {}

    for luogo in luoghi_di_interesse_geo.find({}):
        tipo = luogo.get("tipo")

        if tipo in tipi_disponibili:
            tipi_disponibili[tipo] += 1
        else:
            tipi_disponibili[tipo] = 1

    return jsonify({"tipi_luogo": tipi_disponibili})


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

@app.route("/creaPercorsoClient", methods=['POST'])
def creaPercorsoClient():
    mezzi = request.form.getlist("mezzi[]")
    range = request.form.getlist("range")
    tipi = request.form.getlist("luoghi[]")
    lat= request.form.get("posizioneUtenteLat")
    long=request.form.get("posizioneUtenteLong")

    #mezzi: auto treno bus    range: 0-5 5-10 -10-15 15-20 +20   luoghi: alberi vini eccc

    #find near       {"features.geometry":{"$near":{"$geometry": {"type": "Point", "coordinates": [15.037362, 40.763152]},"$minDistance": 1000,"$maxDistance": 5000}}}
    #find_by_tipi    {"tipo":{"$in":["alberi","vini","agriturismi"]}

    min=0
    max=0

    if "0-5" in range:
        min=0
        max=5000
    if "5-10" in range:
        min=5000
        max=10000
    if "10-15" in range:
        min=10000
        max=15000
    if "15-20" in range:
        min=15000
        max=20000
    if "+20" in range:
        min=20000
        max=50000


    luoghi_percorso=luoghi_di_interesse_geo.find({"$and":[{"features.geometry":{"$near":{"$geometry":{"type":"Point","coordinates": [float(long), float(lat)]},"$minDistance": min,"$maxDistance": max}}},{"tipo": {"$in":tipi}}]},{"_id":0})
    luoghi2=list(luoghi_di_interesse_geo.find({"$and":[{"features.geometry":{"$near":{"$geometry":{"type":"Point","coordinates": [float(long), float(lat)]},"$minDistance": min,"$maxDistance": max}}},{"tipo": {"$in":tipi}}]},{"_id":0}))
    luogoA=[]
    for luogo in luoghi2:
        long=luogo["features"][0]["geometry"]["coordinates"][0]
        lat=luogo["features"][0]["geometry"]["coordinates"][1]
        stazione_vicina=list(stazioni_fermate_geo.find({"$and":[{"features.geometry":{"$near": {"$geometry": {"type": "Point", "coordinates": [long, lat]}}}},{"Tipo": "Treni"}]},{"_id":0}))[0]
        luogo["fermata_vicina"]=stazione_vicina
        luogoA.append(luogo)

    lista_stazioni_suggerite=[]
    print(luoghi_percorso)
    if "treno" in list(mezzi):
        for luogo in luoghi_percorso:
            long=luogo["features"][0]["geometry"]["coordinates"][0]
            lat=luogo["features"][0]["geometry"]["coordinates"][1]
            stazione_vicina=stazioni_fermate_geo.find({"$and":[{"features.geometry":{"$near": {"$geometry": {"type": "Point", "coordinates": [long, lat]}}}},{"Tipo": "Treni"}]},{"_id":0})[0]
            if stazione_vicina not in lista_stazioni_suggerite:
                lista_stazioni_suggerite.append(stazione_vicina)
    


    return jsonify({"luoghi_pacchetto":luoghi2, "percorso_suggerito":lista_stazioni_suggerite, "status":"success"})

@app.route("/inserisciNuovoPOI", methods=['POST','GET'])
def inserisciNuovoPOI():
    nome=request.form.get("nome")
    descrizione=request.form.get("descrizione")
    tipo=request.form.get("tipo")
    latitudine=request.form.get("latitudine")
    longitudine=request.form.get("longitudine")

    nuovo_POI={"nome":nome, "descrizione":descrizione, "tipo": tipo, "type":"FeatureCollection","features":[{"type":"Feature", "properties":{},"geometry":{"coordinates":[float(longitudine),float(latitudine)],"type":"Point"}}]}

    #inserire POI nel db, ma non funziona
    #luoghi_di_interesse_geo.insert_one(nuovo_POI)

    return nuovo_POI

#inserire percorso come geojson nella collection percorso
@app.route("/insertPercorso", methods=['POST'])
def insertPercorso():
    nome=request.form.get("nome")
    arry=[]
    futures = []
    arrcoo=request.form.get("array")
    arr=literal_eval(arrcoo)
    nomi_stazioni = request.form.getlist("stazioni[]")

    # features = []
    # for i, coord in enumerate(arr):
    #     nome_stazione = nomi_stazioni[i]
    #     lat, lon = map(float, coord.split(","))
    #     point = geojson.Point((lon, lat))
    #     feature = geojson.Feature(geometry=point, properties={"nome": nome_stazione, "tipo": "Treni"})
    #     feature_collection = geojson.FeatureCollection([feature])
    #     feature["features"] = [feature_collection]
    #     features.append(feature)
    #
    # feature_collection = geojson.FeatureCollection(features)

    cordinate_list = []  # lista per due cordinate
    geo_json_list = []
    location_json = {}
    geometry_json = {}
    for i, coord in enumerate(arr):
        lat, lon = map(float, coord.split(","))

        cordinate_list.append(lon)
        cordinate_list.append(lat)

        geo_json = {}  # create a new dictionary object

        geo_json["Nome"] = nomi_stazioni[i]
        geo_json["Tipo"] = "Treni"
        geo_json["type"] = "FeatureCollection"

        location_json["type"] = "Feature"
        location_json["properties"] = {}

        geometry_json["coordinates"] = cordinate_list
        geometry_json["type"] = "Point"

        location_json["geometry"] = geometry_json

        geo_json["features"] = [location_json]
        geo_json_list.append(geo_json)

        cordinate_list = []
        location_json = {}
        geometry_json = {}

    ids = randint(0, 1000000)
    cercaid = percorso.find_one({"ID": ids})
    while cercaid is not None:
        ids = randint(0, 1000000)

    nuovo_percorso = {"ID": ids, "nome": nome, "geojson": geo_json_list}
    percorso.insert_one(nuovo_percorso)

    return jsonify({"status": "success"})


#restituisci la lista di percorsi
@app.route("/getPercorsiList", methods=['POST'])
def getPercorsiList():
    percorsi = percorso.find({}, {"_id": 0, "geojson": 0})
    lista =list(percorsi)
    if len(lista) == 0:
        return jsonify({"status": "error"})
    else:
        return jsonify({"status": "success", "percorsi": lista})

#restituisci il percorso dato il nome
@app.route("/getPercorso", methods=['POST'])
def getPercorso():
    ID = request.form.get("ID")
    p = percorso.find_one({"ID": int(ID)}, {"_id": 0})
    if p is None:
        return jsonify({"status": "error"})
    else:
        return jsonify({"status": "success", "percorso": p})

@app.route("/creaPacchetto", methods=['POST'])
def creaPacchetto():
    titolo=request.form.get("titolo")
    descrizione=request.form.get("descrizione")
    listaPOI=json.loads(request.form.get("POIList"))
    percorso=json.loads(request.form.get("percorso"))
    tipologia=request.form.get("tipologia")

    res = []
    temp = {}
    for i in percorso:
        temp = i
        if temp not in res:
            res.append(temp)
    pacchetto={"titolo":titolo, "descrizione": descrizione, "listaPOI":listaPOI, "percorso": res, "tipologia":tipologia}

    #a questo punto dovremmo inserire il nuovo pacchetto nel db, e il percorso nella sua collection, ma non mi funziona
    poi_itinerary.insert_one(pacchetto)

    return jsonify({"status":"success"})

#Autobus
@app.route("/mostraFermateConPacchetto", methods=['POST'])
def mostraFermateConPacchetto():
    listaPOI=json.loads(request.form.get("POIList"))
    lista_fermate_vicino_poi=[]
    for POI in listaPOI:
        lista_fermate_vicino_poi_corrente=[]
        latitudine_POI=POI["Latitudine"]
        longitudine_POI=POI["Longitudine"]
        #restituisce tutte gli elementi della collection ordinati dal più vicino al più lontano
        #find in collection geojson fermate 5 near a longitudine_POI, latiduine_POI
        lista_fermate_vicino_poi_corrente= stazioni_fermate_geo.find({"$and":[{"features.geometry":{"$near":{"$geometry":{"type": "Point","coordinates":[longitudine_POI, latitudine_POI]}}}},{"Tipo": "Autobus"}]},{"_id":0})
        lista_fermate_vicino_poi.append(list(lista_fermate_vicino_poi_corrente))

    return lista_fermate_vicino_poi

#Treni
@app.route("/mostraStazioniConPacchetto", methods=['POST'])
def mostraStazioniConPacchetto():
    listaPOI = json.loads(request.form.get("POIList"))
    lista_fermate_vicino_poi = []

    for POI in listaPOI:
        lista_fermate_vicino_poi_corrente = []
        latitudine_POI = POI["Latitudine"]
        longitudine_POI = POI["Longitudine"]
        # restituisce tutte gli elementi della collection ordinati dal più vicino al più lontano
        # find in collection geojson 3 fermate near a longitudine_POI, latiduine_POI
        lista_fermate_vicino_poi_corrente = stazioni_fermate_geo.find({"$and":[{"features.geometry":{"$near": {"$geometry": {"type": "Point", "coordinates": [float(longitudine_POI), float(latitudine_POI)]}}}},{"Tipo": "Treni"}]},{"_id":0})
        for i in range (0,1):
            if lista_fermate_vicino_poi_corrente[i] not in lista_fermate_vicino_poi:
                lista_fermate_vicino_poi.append(lista_fermate_vicino_poi_corrente[i])

    print(lista_fermate_vicino_poi)
    return jsonify({"status":"success","lista_stazioni":lista_fermate_vicino_poi})

@app.route("/api/data", methods=['GET'])
def data():
    data = list(poi_itinerary.find({},{"_id":0}))
    return jsonify(data)

@app.route("/getPacchetti", methods=['POST'])
def getpacchetti():
    tipo = request.form.get("tipo")
    if tipo == "all":
        pagina = max(int(request.form.get("pagina", 1)), 1)
        data = poi_itinerary.find({},{"_id":0}).limit(5).skip((pagina-1)*5)
        pagine_totali = -(poi_itinerary.count_documents({}) // -(5))
    else:
        pagina = max(int(request.form.get("pagina", 1)), 1)
        data = poi_itinerary.find({"tipologia":tipo},{"_id":0}).limit(5).skip((pagina-1)*5)
        pagine_totali = -(poi_itinerary.count_documents({"tipologia":tipo}) // -(5))

    risultato = {
        "data": list(data),
        "pagine_totali": pagine_totali,
        "pagina_corrente": pagina
    }
    return jsonify(risultato)

@app.route("/getPagineTotaliPacchetti", methods=['POST'])
def getPagineTotaliPacchetti():
    pagine_totali = -(poi_itinerary.count_documents({}) // -(5))
    return jsonify(pagine_totali)

#creare una route che restituisca il pacchetti dato il nome
@app.route("/getPacchetto", methods=['POST'])
def getPacchetto():
    nome = request.form.get("nome")
    p = poi_itinerary.find_one({"titolo": nome}, {"_id": 0})
    if p is None:
        return jsonify({"status": "error"})
    else:
        return jsonify({"status": "success", "pacchetto": p})
    
#creare una route per sostituire i valori nan con "" per evitare errori
@app.route("/replaceNan", methods=['POST'])
def replaceNan():
    data = luoghi_di_interesse_geo.find({},{"_id":0})
    array = list(data)
    lista=[]
    for d in array:
        if(type(d['descrizione']) is float):
            d['descrizione']=""
        lista.append(d)
    luoghi_di_interesse_geo.drop()
    luoghi_di_interesse_geo.insert_many(lista)
    return jsonify({"status": "success"})

@app.route("/getLuoghiDisponibili", methods=['POST'])
def getLuoghiDisponibili():
    range = request.form.getlist("range")
    latitudine=request.form.get("latitudine")
    longitudine=request.form.get("longitudine")

    min = 0
    max = 0

    if "0-5" in range:
        min = 0
        max = 5000
    if "5-10" in range:
        min = 5000
        max = 10000
    if "10-15" in range:
        min = 10000
        max = 15000
    if "15-20" in range:
        min = 15000
        max = 20000
    if "+20" in range:
        min = 20000
        max = 50000

    luoghi_percorso = luoghi_di_interesse_geo.find({"$and": [{ "features.geometry": {"$near": {"$geometry": {"type": "Point","coordinates": [float(longitudine), float(latitudine)]},"$minDistance": min,"$maxDistance": max}}}]},{"_id":0})
    luoghi2 = luoghi_di_interesse_geo.find({"$and": [{"features.geometry": {"$near": {"$geometry": {"type": "Point", "coordinates": [float(longitudine), float(latitudine)]}, "$minDistance": min,"$maxDistance": max}}}]}, {"_id": 0})

    tipi_disponibili= luoghi2.distinct("tipo")

    return tipi_disponibili

#creare una route che restituisce i luoghi di interesse intorno ad un percorso
@app.route("/getLuoghiPercorso", methods=['POST'])
def getLuoghiPercorso():
    ID=request.form.get("ID")

    per_corso = percorso.find_one({"ID": int(ID)}, {"_id": 0})
    # prendo i punti del percorso
    punti_percorso = []
    for geojson in per_corso["geojson"]:
        punti_percorso += geojson["features"]
    arr = []
    for punto in punti_percorso:
        if punto['geometry']['type'] == "Point":
            # per ogni punto prendo la latitudine e la longitudine
            latitudine = punto['geometry']['coordinates'][1]
            longitudine = punto['geometry']['coordinates'][0]
            # per ogni punto prendo i luoghi di interesse vicini
            luoghi_percorso = luoghi_di_interesse_geo.find({"$and": [{"features.geometry": {
                "$near": {"$geometry": {"type": "Point", "coordinates": [longitudine, latitudine]}, "$minDistance": 0,
                          "$maxDistance": 5000}}}]}, {"_id": 0})
            tipi_disponibili = luoghi_percorso.distinct("tipo")
            # per ogni punto aggiungo i tipi di luoghi di interesse vicini
            punto["tipi"] = tipi_disponibili
            # per ogni punto aggiungo i luoghi di interesse vicini
            for luogo in luoghi_percorso[0:2]:
                arr.append(luogo)

    return jsonify({"status": "success", "luoghi": arr})


#route per ricevere nome e tipo di una stazione dato latitudine e longitudine
@app.route("/getStazione", methods=['POST'])
def getStazione():
    latitudine=request.form.get("latitudine")
    longitudine=request.form.get("longitudine")
    print(latitudine, longitudine)
    stazione = stations.find_one({"Latitudine":float(latitudine),"Longitudine":float(longitudine)}, {"_id": 0})
    #geo_stazione = stazioni_fermate_geo.find_one({"Nome": stazione["Nome"]}, {"_id": 0})
    return jsonify({"status": "success", "stazione": stazione})



if __name__ == "__main__":
    app.run(host='0.0.0.0', port="5000", debug=True)

