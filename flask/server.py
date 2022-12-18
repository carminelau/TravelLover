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


if __name__ == "__main__":
    app.run(host='0.0.0.0', port="5000", debug=True)

