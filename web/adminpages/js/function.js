function visualizzaTipoCheck(tipo, azione) {
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

            $(".risultato").css("text-align", "left");
            $(".risultato").css("margin", "0 auto");
            $(".risultato").css("position", "relative");
            $(".risultato").css("width", "100%");
            response.luoghi.forEach(function (item) {
                $(".risultato").append("<div class='card' style='width: 80%; margin: 0 auto; margin-bottom: 10px;'> <div class='card-body'> <h5 class='card-title'>" + item.Nome + "</h5> <h6 class='card-subtitle mb-2 text-muted'></h6> <p class='card-text'>" + item.Descrizione + "</p> <a href='#' class='card-link'>Modifica</a> <a href='#' class='card-link'>Elimina</a> </div> </div>");
            });
        },
        error: function () {
            alert("ERRORE CHIAMATA ASINCRONA");
        }
    });
}

function visualizzaVicinoComune(azione, comune) {
    $.ajax({
        url: "http://127.0.0.1:5000/visualizzaVicinoComune",
        method: "POST",
        cache: false,
        data: {
            azione: azione,
            comune: comune,
        },
        success: function (response) {
            console.log(response)

            $(".risultato").empty();

            $(".risultato").css("text-align", "left");
            $(".risultato").css("margin", "0 auto");
            $(".risultato").css("position", "relative");
            $(".risultato").css("width", "100%");



            response.luoghi.forEach(function (item){
                $(".risultato").append("<div class='card' style='width: 80%; margin: 0 auto; margin-bottom: 10px'> <div class='card-body'> <h5 class='card-title'>" + item.nome + "</h5> <h6 class='card-subtitle mb-2 text-muted'></h6> <p class='card-text'>" + item.descrizione + "</p> </div> </div>");
                console.log(item)
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
            response.fermate.forEach(function (item) {
                if (item.Tipo == "Autobus") {
                    
                    if (item.Nome == NaN) {
                        $('#listarisultato').append("<li class='list-group-item d-flex justify-content-between align-content-center'><div class='d-flex flex-row'><i class='fa-sharp fa-solid fa-map-pin'></i><div class='ml-2'><h6 class='mb-0' onclick=visualizzafermatasumappa("+ item.Latitudine + "," + item.Longitudine+")>" + item.Comune + "</h6><div class='about'><span id='coord'>"+item.Latitudine+","+item.Longitudine+"</span></div></div></div><div class='check'><input type='checkbox' name='a'></div></li>")
                    }
                    else {
                        $('#listarisultato').append("<li class='list-group-item d-flex justify-content-between align-content-center'><div class='d-flex flex-row'><i class='fa-sharp fa-solid fa-map-pin'></i><div class='ml-2'><h6 class='mb-0' onclick=visualizzafermatasumappa("+ item.Latitudine + "," + item.Longitudine+")>" + item.Comune + "</h6><div class='about'><span>" + item.Nome + "</span><span id='coord'>"+item.Latitudine+","+item.Longitudine+"</span></div></div></div><div class='check'><input type='checkbox' name='a'></div></li>")

                    }
                }
                else {
                    $('#listarisultato').append("<li class='list-group-item d-flex justify-content-between align-content-center'><div class='d-flex flex-row'><i class='fa-sharp fa-solid fa-map-pin'></i><div class='ml-2'><h6 class='mb-0' onclick=visualizzafermatasumappa("+ item.Latitudine + "," + item.Longitudine+")>" + item.Nome + "</h6><div class='about'><span id='coord'>"+item.Latitudine+","+item.Longitudine+"</span></div></div></div><div class='check'><input type='checkbox' name='a'></div></li>")
                }
            });
        },
        error: function () {
            alert("ERRORE CHIAMATA ASINCRONA");
        }
    });
}