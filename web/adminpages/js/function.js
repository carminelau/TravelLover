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
    console.log(comune);
    console.log(scegli);
    $.ajax({
        url: "http://127.0.0.1:5000/visualizzaVicinoComune",
        method: "POST",
        cache: false,
        data: {
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
                console.log(selectedValues);
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

function visualizzaVicinoComune2(azione, comune, scegli) {
    console.log(comune);
    console.log(scegli);
    const form = new FormData();
    form.append("comune", comune);

    const options = {
        method: 'POST',
        headers: {}
    };

    options.body = form;
    fetch("http://127.0.0.1:5000/visualizzaVicinoComune",options)
    .then(response => response.json())
    .then(data => {
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

        console.log(data)

        $(".risultato").empty();

        $(".risultato").css("text-align", "left");
        $(".risultato").css("margin", "0 auto");
        $(".risultato").css("position", "relative");
        $(".risultato").css("width", "100%");

        console.log(data.luoghi)

        data.luoghi.forEach(function (item){
            var poi = {"Nome":item.nome, "Descrizione":item.descrizione, "Tipo":item.tipo, "Latitudine":item.features[0].geometry.coordinates[1], "Longitudine":item.features[0].geometry.coordinates[0]}

            var poi = JSON.stringify(poi).replace(/'/g, " ")
            console.log(selectedValues);
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
}
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
            console.log(response)
            console.log(range)

            var totalecordinate=[]
            $("#percorso-client-result").empty();

            response.luoghi_pacchetto.forEach(function (item) {
                var nome=item.nome;
                var descrizione=item.descrizione;
                var latitudine = item.features[0].geometry.coordinates[1];
                var longitudine = item.features[0].geometry.coordinates[0];
                totalecordinate.push([latitudine,longitudine])
                visualizzaLuoghiSuMappa(latitudine, longitudine, nome, descrizione, totalecordinate)


                $("#percorso-client-result").append("<br><h6>Nome luogo d'interesse: </h6>"+nome+"<br><h6>Descrizione: </h6>"+descrizione+"<br>");

            });

            $("#percorso-client-result").append("<hr><h5>STAZIONI CONSIGLIATE</h5><br>");
            response.percorso_suggerito.forEach(function (item) {
                var nome=item.Nome;
                var latitudine = item.features[0].geometry.coordinates[1];
                var longitudine = item.features[0].geometry.coordinates[0];

                if(range=='0-5'){visualizzaLuoghiSuMappa(latitudine, longitudine, nome, "Stazione", totalecordinate, "blue", 2500);}
                if(range=='5-10'){visualizzaLuoghiSuMappa(latitudine, longitudine, nome, "Stazione", totalecordinate, "blue", 5000);}
                if(range=='10-15'){visualizzaLuoghiSuMappa(latitudine, longitudine, nome, "Stazione", totalecordinate, "blue", 8000);}
                if(range=='15-20'){visualizzaLuoghiSuMappa(latitudine, longitudine, nome, "Stazione", totalecordinate, "blue", 10000);}
                if(range=='+20'){visualizzaLuoghiSuMappa(latitudine, longitudine, nome, "Stazione", totalecordinate, "blue", 30000);}

                $("#percorso-client-result").append("<h6>"+nome+"</h6><br>");

            });


        },
        error: function () {
            alert("ERRORE CHIAMATA ASINCRONA");
        }
    });
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

function creaPacchetto(titolo, descrizione, POIList, percorso) {
    $.ajax({
        url: "http://127.0.0.1:5000/creaPacchetto",
        method: "POST",
        cache: false,
        data: {
            titolo: titolo,
            descrizione: descrizione,
            POIList: JSON.stringify(POIList),
            percorso: JSON.stringify(percorso),
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

function mostraFermateConPacchetto(POIList) {
    $.ajax({
        url: "http://127.0.0.1:5000/mostraFermateConPacchetto",
        method: "POST",
        cache: false,
        data: {
            POIList: JSON.stringify(POIList),
        },
        success: function (response) {

            console.log(response)

        },
        error: function () {
            alert("ERRORE CHIAMATA ASINCRONA");
        }
    });
}

function mostraStazioniConPacchetto(POIList) {
    $.ajax({
        url: "http://127.0.0.1:5000/mostraStazioniConPacchetto",
        method: "POST",
        cache: false,
        data: {
            POIList: JSON.stringify(POIList),
        },
        success: function (response) {
            $("#percorso-suggeriti").empty();

            var lista_stazioni_suggerite=[]
            response.lista_stazioni.forEach(function (item) {
                    var i = 0;
                    lista_stazioni_suggerite.push(item)
                    
                    visualizzaLuoghiSuMappa(item.features[0].geometry.coordinates[1], item.features[0].geometry.coordinates[0], item.Nome, "Stazione", col="blue")
                    // item.forEach(function (item2) {
                    //     //$('#percorsi-suggeriti').append("<li class='list-group-item d-flex justify-content-between align-content-center'><div class='d-flex flex-row'><i class='fa-sharp fa-solid fa-map-pin'></i><div class='ml-2'><h6 class='mb-0'>" +item2.Nome+ "</h6><div class='about'><span id='coord'></span></div></div></div></li>")
                    //     visualizzaLuoghiSuMappa(item2.features[0].geometry.coordinates[1], item2.features[0].geometry.coordinates[0], item2.Nome, "Stazione", col="blue")
                    //     if(i==0){

                    //             console.log("weeeeeee")
                    //             lista_stazioni_suggerite.push(item2)

                    //     }
                    //     i++;
                    // });
            });
            localStorage.setItem("listaPercorso","")
            localStorage.setItem("listaPercorso",JSON.stringify(lista_stazioni_suggerite))

            $("#percorsi-suggeriti").append("<hr><h4>PERCORSO CONSIGLIATO:</h4>");
            for(var j=0;j<lista_stazioni_suggerite.length;j++){
                if (!(lista_stazioni_suggerite[j] in  lista_stazioni_suggerite)){
                    $("#percorsi-suggeriti").append(lista_stazioni_suggerite[j].Nome+"<br>");
                }
            }

            $("#percorsi-suggeriti").append("<hr><h5><a href='inserisciPercorso.html' class='seleziona'>Valuta percorsi alternativo</a></h5><hr>");
        },
        error: function () {
            alert("ERRORE CHIAMATA ASINCRONA");
        }
    });
}


