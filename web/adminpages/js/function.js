function visualizzaTipoCheck(tipo,azione){
        $.ajax({
            url: "http://127.0.0.1:5000/visualizzaTipo",
            method: "POST",
            cache: false,
            data:{
                criterio: tipo,
                azione: azione,
            },
            success: function (response) {
                console.log(response)

                $(".risultato").css("text-align", "left");
                $(".risultato").css("margin", "0 auto");
                $(".risultato").css("position", "relative");
                $(".risultato").css("width", "100%");
                let dataArr = ['ciao','sono', 'un', 'array'];
                response.luoghi.forEach(function (item) {
                    $(".risultato").append("<div class='card' style='width: 100%;'> <div class='card-body'> <h5 class='card-title'>"+item.Nome+"</h5> <h6 class='card-subtitle mb-2 text-muted'></h6> <p class='card-text'>"+item.Descrizione+"</p> <a href='#' class='card-link'>Card link</a> <a href='#' class='card-link'>Another link</a> </div> </div>");
                });
            },
            error: function () {
                alert("ERRORE CHIAMATA ASINCRONA");
            }
        });
}

function visualizzaByComune(tipo,azione){
        $.ajax({
            url: "http://127.0.0.1:5000/visualizzaByComune",
            method: "GET",
            cache: false,
            data:{
                criterio: tipo,
                azione: azione,
            },
            success: function (response) {
                console.log(response)


            },
            error: function () {
                alert("ERRORE CHIAMATA ASINCRONA");
            }
        });
}