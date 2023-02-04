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
                $(".risultato").append("<div class='card' style='width: 100%;'> <div class='card-body'> <h5 class='card-title'>" + item.Nome + "</h5> <h6 class='card-subtitle mb-2 text-muted'></h6> <p class='card-text'>" + item.Descrizione + "</p> <a href='#' class='card-link'>Card link</a> <a href='#' class='card-link'>Another link</a> </div> </div>");
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
        method: "GET",
        cache: false,
        data: {
            azione: azione,
            comune: comune,
        },
        success: function (response) {
            console.log(response)
            console.log(comune)

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

function getChecked() {
    var checked = [];
    var inputs = document.getElementsByName('a');
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            checked.push(inputs[i].value);
        }
    }
    
    console.log(checked)
}