from flask import jsonify

from configs import db
import PacchettiTuristici as pt
import pandas as pd
from pymongo import MongoClient

poi_places = db.luoghi_di_interesse
train_stations = db.train_stations
bus_station= db.bus_stations
train_line = db.train_lines
bus_line = db.bus_lines
poi_itinerary = db.poi_itinerary
users = db.users

#tutti i luoghi di interesse (DA PRENDERE NEL DB)
luoghi_di_interesse = pd.read_csv("../dati/luoghi-di-interesse.csv", sep=";", encoding_errors="ignore")


#estrai tutti i luoghi di interesse di un determinato tipo
def estrai_lista_luoghi(type):
    # collection contenente tutti i luoghi di interesse (DA PRENDERE NEL DB)

    lista_luoghi_interesse = []

    # s=poi_places.find({"Tipo": "type"})
    # for d in s:
    #     print(d)

    for riga in range(luoghi_di_interesse.shape[0]):
        nome = luoghi_di_interesse.loc[riga, "Nome"]
        tipo = luoghi_di_interesse.loc[riga, "Tipo"]
        latitudine = luoghi_di_interesse.loc[riga, "Latitudine"]
        longitudine = luoghi_di_interesse.loc[riga, "Longitudine"]
        descrizione = luoghi_di_interesse.loc[riga, "Descrizione"]
        if type == tipo:
            luogo = pt.LuogoInteresse(nome, tipo, latitudine, longitudine, descrizione).to_json()
            lista_luoghi_interesse.append(luogo)

    return lista_luoghi_interesse


def estra_lista_luoghi_comune(comune):
    pass


#salva un pacchetto turistico
def salva_pacchetto(pacchetto):
    pass