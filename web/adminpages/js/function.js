function visualizzaTipoCheck(tipo,azione){
        $.ajax({
            url: "http://127.0.0.1:5000/visualizzaTipo",
            method: "GET",
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

                response.map(el=>{$(".risultato").append(el)});
                $(".risultato").append("<hr>")
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