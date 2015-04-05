


$(document).ready(function(){
   
    ville = $('#ville').val();
    // de base la vue est en carousel
    var affichage ="liste";
    var select = document.getElementById("nombre");
    var imgs = [];

	$("#ville").change(function(){
        // on rempli le dictionnaire
        ville = $('#ville').val();
        var nombre = select.options[select.selectedIndex].text;
        imgs = getPhoto(ville,nombre);
        window.alert(affichage);
        changerVue(imgs,affichage);

	});

    $("#ok").on("click",function(){
        changerVue(imgs,affichage);
    });

    $("#sort").on("click",function(){
        imgs = sortByAuthor(imgs);
    });

    $("#list").on("click",function(){
        affichage = "liste";
    });

    $("#carousel").on("click",function(){
        affichage = "carousel";
    });

    $(".item > img").on("click",function(){
        window.alert("test");
    });


     // mise en place de l'autocomplete
        /*$( "#ville" ).autocomplete({
            source: function(requete,reponse){
                $.ajax({
                    url : "http://infoweb/~jacquin-c/codePostalComplete.php",
                    data : "maxRows=10&commune=" + requete.term,
                    dataType : "json",
                    method : "GET",

                    success : function (json) {
                    Villes = [];
                        $.each(json, function(i,item){
                            //supprimer les doublons
                            if ($.inArray(item.Ville,Villes) == -1){
                            Villes.push(item.Ville);
                            $('#submit').css({"visibility" :'visible'});
                            $('#reset').css({"visibility" :'visible'});
                            }
                        });
                            reponse(Villes);
                        },
                            error : function (){
                            reponse([]);
                        }
                });
            }
        });*/


    function getPhoto (ville,nombre){
        var images=[];

        $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags="+ ville +"&tagmode=any&format=json&jsoncallback=?",
        function(data){
            
            $.each(data.items, function(i,item){
                //mise en place du dictionnaire ( autheur -> url)
                var image = {"url" : item.media.m,"auteur" : item.author, "date" : item.date_taken };
                images.push(image);
                window.alert(images[i]);
                if(nombre == i){
                    return false;
                }
            });
        });
        return images;
    }

    function sortByAuthor(dico){

        newTab = [];
        newTab = dico.sort(compareAuthor);
        return newTab;
    }

    function compareAuthor(a,b) {
        if (a.auteur < b.auteur)
            return -1;
        if (a.auteur > b.auteur)
            return 1;
        return 0;
    }

    function changerVue(dico,vue){
        if(vue == "carousel"){
            $("#rowPhoto").empty();
            $("#rowPhoto").html('<div id="owl-demo" class="owl-carousel"></div>');

            var content = "";

            for (var i = 0; i < dico.length - 1; i++) {
                content += "<div class='item'> <img src='"+ dico[i].url +"' /></div>"; //;$("<img id='tailleImg'/>").attr("src", item.media.m).appendTo("#rowPhoto");
                $('#owl-demo').html(content);
                setTimeout(function(){$('#owl-demo').owlCarousel({navigation : true, // Show next and prev buttons
                slideSpeed : 300,
                paginationSpeed : 400,
                singleItem:true});},2000);
            };
        }
        else{

            $("#rowPhoto").empty();

            for (var i = 0; i< dico.length - 1; i++) {
                $("#rowPhoto").append("<img src='"+dico[i].url+"' />");
            };
        }
        
    }
});



