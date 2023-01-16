import json

class LuogoInteresse:
    def __init__(self, nome, tipo, latitudine, longitudine, descrizione):
        self.Nome=nome
        self.Tipo=tipo
        self.Latitudine=latitudine
        self.Longitudine=longitudine
        self.Descrizione=descrizione

    def __iter__(self):
        yield from {
            "nome": self.Nome,
            "tipo": self.Tipo,
            "latitudine": self.Latitudine,
            "longitudine": self.Longitudine,
            "descrizione": self.Descrizione
        }.items()

    def __str__(self):
        return json.dumps(dict(self), ensure_ascii=False)

    def __repr__(self):
        return self.__str__()

    def to_json(self):
        return self.__str__()


class LuogoPernottamento:
    def __init__(self, nome, latitudine, longitudine):
        self.Nome=nome
        self.Latitudine=latitudine
        self.Longitudine=longitudine

    def __iter__(self):
        yield from {
            "nome": self.Nome,
            "latitudine": self.Latitudine,
            "longitudine": self.Longitudine
        }.items()

    def __str__(self):
        return json.dumps(dict(self), ensure_ascii=False)

    def __repr__(self):
        return self.__str__()

    def to_json(self):
        return self.__str__()


class Pacchetto:
    def __init__(self, nome, descrizione, lista_luoghi_pernottamento, lista_mezzi_consigliati, durata, lista_loughi_interesse):
        self.Nome=nome
        self.Descrizione=descrizione
        self.Lista_luoghi_pernottamento=lista_luoghi_pernottamento
        self.Lista_mezzi_consigliati=lista_mezzi_consigliati
        self.Durata = durata
        self.Lista_luoghi_interesse=lista_loughi_interesse

    def __iter__(self):
        yield from {
            "nome": self.Nome,
            "descrizione": self.Descrizione,
            "lista_luoghi_pernottamento": self.Lista_luoghi_pernottamento,
            "lista_mezzi_consigliati": self.Lista_mezzi_consigliati,
            "duarata": self.Durata,
            "lista_luohi_interesse":self.Lista_luoghi_interesse
        }.items()

    def __str__(self):
        return json.dumps(dict(self), ensure_ascii=False)

    def __repr__(self):
        return self.__str__()

    def to_json(self):
        return self.__str__()
