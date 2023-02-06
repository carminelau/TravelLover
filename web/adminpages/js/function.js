var listaPOIPacchetto = JSON.parse(localStorage.getItem("POIPacchetto")) || [];

function aggiungiPOIaLista(poi){
    listaPOIPacchetto.push(poi)
    localStorage.setItem("POIPacchetto", JSON.stringify(listaPOIPacchetto));
    console.log(listaPOIPacchetto)
}
function visualizzaTipoCheck(tipo, azione, scegli) {

    $.ajax({
        url: "http://127.0.0.1:5000/visualizzaTipo",
        method: "POST",
        cache: false,
        data: {
            criterio: tipo,
            azione: azione,
        },
        success: function (response) {
            console.log(response)

            var lista =[]

            $(".risultato").css("text-align", "left");
            $(".risultato").css("margin", "0 auto");
            $(".risultato").css("position", "relative");
            $(".risultato").css("width", "100%");

            response.luoghi.forEach(function (item) {

                var poi = {"Nome":item.Nome, "Descrizione":item.Descrizione, "Tipo":item.Tipo, "Latitudine":item.Latitudine, "Longitudine":item.Longitudine}
                var poi = JSON.stringify(poi).replace(/'/g, " ")
                $(".risultato").append("<div class='card' style='width: 80%; margin: 0 auto; margin-bottom: 10px;'> <div class='card-body'> <h5 class='card-title'>" + item.Nome + "</h5> <h6 class='card-subtitle mb-2 text-muted'></h6> <p class='card-text'>" + item.Descrizione + "</p> <a href='#' class='card-link'>Modifica</a> <a href='#' class='card-link'>Elimina</a>   <a href='javascript:aggiungiPOIaLista("+poi+");' class='card-link' style='text-decoration: black; hover: underline;'>Aggiungi a pacchetto</a> </div> </div>");

                var links = document.getElementsByClassName("card-link");
                for (let i = 0; i < links.length; i++) {
                  links[i].addEventListener("click", function() {
                    if (scegli==null){window.location.replace("inserisciPacchetti.html");}
                    else{this.style.color = "black"; this.textContent="Aggiunto a pacchetto"}
                  });
                  links[i].addEventListener("mouseover", function() {
                    this.style.textDecoration = "underline";
                  });
                  links[i].addEventListener("mouseout", function() {
                    this.style.textDecoration = "none";
                  });
                }

            });
        },
        error: function () {
            alert("ERRORE CHIAMATA ASINCRONA");
        }
    });
}


function visualizzaVicinoComune(azione, comune, scegli) {
    $.ajax({
        url: "http://127.0.0.1:5000/visualizzaVicinoComune",
        method: "POST",
        cache: false,
        data: {
            azione: azione,
            comune: comune,
        },
        success: function (response) {

            if (scegli == null){console.log("non puoi scegliere")}

            var selectedValues = [];
            var agriturismi = document.getElementById('agriturismi2');
            var alberi = document.getElementById('alberi2');
            var vini = document.getElementById('vini2');
            var torri = document.getElementById('torri2');
            var bandiere = document.getElementById('bandiere2');
            var generici = document.getElementById('generici2');
            var caseifici = document.getElementById('caseifici2');
            var biblioteche = document.getElementById('biblioteche2');
            var culto = document.getElementById('culto2');
            var musei = document.getElementById('musei2');
            var teatri = document.getElementById('teatri2');
            var fattorie = document.getElementById('fattorie2');

            if (agriturismi.checked == true ) selectedValues.push("agriturismi");
            if (alberi.checked == true) selectedValues.push("alberi");
            if (vini.checked == true) selectedValues.push("vino");
            if (torri.checked == true) selectedValues.push("torri");
            if (bandiere.checked == true) selectedValues.push("bandiere");
            if (generici.checked == true) selectedValues.push("generici");
            if (caseifici.checked == true) selectedValues.push("caseifici");
            if (biblioteche.checked == true) selectedValues.push("biblioteche");
            if (culto.checked == true) selectedValues.push("culto");
            if (musei.checked == true) selectedValues.push("musei");
            if (teatri.checked == true) selectedValues.push("teatri");
            if (fattorie.checked == true) selectedValues.push("fattorie");

            console.log(response)

            $(".risultato").empty();

            $(".risultato").css("text-align", "left");
            $(".risultato").css("margin", "0 auto");
            $(".risultato").css("position", "relative");
            $(".risultato").css("width", "100%");

            console.log(response.luoghi)

            response.luoghi.forEach(function (item){
                var poi = {"Nome":item.nome, "Descrizione":item.descrizione, "Tipo":item.tipo, "Latitudine":item.features[0].geometry.coordinates[1], "Longitudine":item.features[0].geometry.coordinates[0]}

                var poi = JSON.stringify(poi).replace(/'/g, " ")
                if(selectedValues.includes(item.tipo) || selectedValues.length==0){
                    $(".risultato").append("<div class='card' style='width: 80%; margin: 0 auto; margin-bottom: 10px'> <div class='card-body'> <h5 class='card-title'>" + item.nome + "</h5> <h6 class='card-subtitle mb-2 text-muted'></h6> <p class='card-text'>" + item.descrizione + "</p> <a href='#' class='card-link'>Modifica</a> <a href='#' class='card-link'>Elimina</a> <a href='javascript:aggiungiPOIaLista("+poi+");' class='card-link'>Aggiungi a pacchetto </div> </div>");
                }

                var links = document.getElementsByClassName("card-link");
                for (let i = 0; i < links.length; i++) {
                  links[i].addEventListener("click", function() {
                    if (scegli==null){window.location.replace("inserisciPacchetti.html");}
                    else{this.style.color = "black";this.textContent="Aggiunto a pacchetto"}
                  });
                  links[i].addEventListener("mouseover", function() {
                    this.style.textDecoration = "underline";
                  });
                  links[i].addEventListener("mouseout", function() {
                    this.style.textDecoration = "none";
                  });
                }

            });
        },
        error: function () {
            alert("ERRORE CHIAMATA ASINCRONA");
        }
    });
}

function visualzzafermatebytipo(tipo, azione) {
    $.ajax({
        url: "http://127.0.0.1:5000/getFermate",
        method: "POST",
        cache: false,
        data: {
            azione: azione,
            tipo: tipo,
        },
        success: function (response) {
            console.log(response)
            $('#listarisultato').empty();
            response.fermate.forEach(function (item) {

                if (item.Tipo == "Autobus") {


                    $('#listarisultato').append("<li class='list-group-item d-flex justify-content-between align-content-center'><div class='d-flex flex-row'><i class='fa-sharp fa-solid fa-map-pin'></i><div class='ml-2'><h6 class='mb-0' onclick=visualizzafermatasumappa(" + item.Latitudine + "," + item.Longitudine + ")>" + item.Comune + "</h6><div class='about'><span id='coord'>" + item.Latitudine + "," + item.Longitudine + "</span></div></div></div><div class='check'><input type='checkbox' name='a' value='"+ item.Latitudine + "," + item.Longitudine + "'></div></li>")

                }
                else {
                    $('#listarisultato').append("<li class='list-group-item d-flex justify-content-between align-content-center'><div class='d-flex flex-row'><i class='fa-sharp fa-solid fa-map-pin'></i><div class='ml-2'><h6 class='mb-0' onclick=visualizzafermatasumappa(" + item.Latitudine + "," + item.Longitudine + ")>" + item.Nome + "</h6><div class='about'><span id='coord'>" + item.Latitudine + "," + item.Longitudine + "</span></div></div></div><div class='check'><input type='checkbox' name='a' value='"+ item.Latitudine + "," + item.Longitudine + "'></div></li>")
                }
            });
        },
        error: function () {
            alert("ERRORE CHIAMATA ASINCRONA");
        }
    });
}

function inserisciPercorso() {
    var checked = [];
    var inputs = document.getElementsByName('a');
    var nome = document.getElementById("nome_percorso").value;
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            checked.push(inputs[i].value);
        }
    }
    console.log(nome)
    console.log(JSON.stringify(checked))

    $.ajax({
        url: "http://127.0.0.1:5000/insertPercorso",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        cache: false,
        data: {
            nome : nome,
            array : JSON.stringify(checked),
        },
        success: function (response) {
            console.log(response)
            alert("Percorso Inserito");
        },
        error: function () {
            alert("ERRORE CHIAMATA ASINCRONA");
        }
    });

function creaPercorsoClient(azione, mezzi, range, luoghi, posizioneUtenteLat, posizioneUtenteLong) {
    $.ajax({
        url: "http://127.0.0.1:5000/creaPercorsoClient",
        method: "POST",
        cache: false,
        data: {
            azione: azione,
            mezzi: mezzi,
            range: range,
            luoghi: luoghi,
            posizioneUtenteLat: posizioneUtenteLat,
            posizioneUtenteLong:posizioneUtenteLong,
        },
        success: function (response) {

           /* console.log(mezzi)
            console.log(range)
            console.log(luoghi)
            console.log(posizioneUtenteLat)
            console.log(posizioneUtenteLong)*/
            console.log(response)

            var totalecordinate=[]

            response.luoghi_percorso.forEach(function (item) {
                var nome=item.nome;
                var descrizione=item.descrizione;
                var latitudine = item.features[0].geometry.coordinates[1];
                var longitudine = item.features[0].geometry.coordinates[0];
                totalecordinate.push([latitudine,longitudine])

                visualizzaLuoghiSuMappa(latitudine, longitudine, nome, descrizione, totalecordinate)
            });
        },
        error: function () {
            alert("ERRORE CHIAMATA ASINCRONA");
        }
    });
}

}

function visualizzaFermateLista(id) {
    $.ajax({
        url: "http://127.0.0.1:5000/getPercorsiList",
        method: "POST",
        cache: false,
        data: {
            id: id,
        },
        success: function (response) {
            console.log(response)
            $('#listapercorsi').empty();
            response.percorsi.forEach(function (item) {
                    $('#listapercorsi').append("<li class='list-group-item d-flex justify-content-between align-content-center' onclick=visualizzapercorsi(" + item.ID + ")><div class='d-flex flex-row'><i class='fa-sharp fa-solid fa-map-pin'></i><div class='ml-2'><h6 class='mb-0'>" + item.nome + "</h6><div class='about'><span id='coord'></span></div></div></div></li>")
            });
        },
        error: function () {
            alert("ERRORE CHIAMATA ASINCRONA");
        }
    });
}

function creaPacchetto(titolo, descrizione, POIList) {
    $.ajax({
        url: "http://127.0.0.1:5000/creaPacchetto",
        method: "POST",
        cache: false,
        data: {
            titolo: titolo,
            descrizione: descrizione,
            POIList: JSON.stringify(POIList),
        },
        success: function (response) {


            console.log(POIList)
            console.log(response)

            $("#creato").empty()

            $("#creato").css("text-align", "center");
            $("#creato").css("margin", "0 auto");
            $("#creato").css("position", "relative");
            $("#creato").css("width", "100%");

            $("#creato").append("<hr><h3><b>PACCHETTO CREATO CON SUCCESSO<b></h3><hr>");


        },
        error: function () {
            alert("ERRORE CHIAMATA ASINCRONA");
        }
    });
}


