import json

diz = {"nome": "Nocera inf. - Salerno", "geojson": {"type": "FeatureCollection", "features": [{"type": "Feature", "geometry": {"type": "Point", "coordinates": [14.708496, 40.703586]}, "properties": {}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [14.636067, 40.745303]}, "properties": {}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [14.672435, 40.742695]}, "properties": {}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [14.76234, 40.681393]}, "properties": {}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [14.727667, 40.674354]}, "properties": {}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [14.770101, 40.675287]}, "properties": {}}, {"type": "Feature", "geometry": {"type": "LineString", "coordinates": [[14.708496, 40.703586], [14.636067, 40.745303], [14.672435, 40.742695], [14.76234, 40.681393], [14.727667, 40.674354], [14.770101, 40.675287]]}, "properties": {}}]}, "ID": 12}

print(diz['geojson']['features'])

punti_percorso = []
for geojson in diz['geojson']['features']:
    if geojson['geometry']['type'] == 'Point':
        punti_percorso.append(geojson)

print(punti_percorso)