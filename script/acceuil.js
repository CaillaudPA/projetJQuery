$(document).ready(function(){
    // de base la vue est en carousel
    var affichage ="liste";
    // initialisation du tableau qui contiendra nos images sous forme d'objet
    var images = []

    // Au changement de ville on charge les nouvelles photos
	$("#ville").change(function(){
        var ville = $('#ville').val();
        getPhoto(ville);
        loads();
	});

    // A la demande de tri, on tri le tableau et on re-affiche le tout suivant l'affichage demandé 
    $("#sort").on("click",function(){
        sortByAuthor();
        changerVue(images, affichage);
        loads();
    });

    // Quand on demande l'affichage en liste, le changement se fait ( voir changerVue )
    $("#list").on("click",function(){
        affichage = "liste";
        changerVue(images, affichage);
        loads();
    });

    // Quand on demande l'affichage en Carousel, le changement se fait ( voir changerVue )
    $("#carousel").on("click",function(){
        affichage = "carousel";
        changerVue(images, affichage);
        loads();
    });


     // mise en place de l'autocomplete
    $( "#ville" ).autocomplete({
        source: function(requete,reponse){
            // mise en place de la requette ajax
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
    });

    // cette fonction permet de charger les images pour la fenetre modale
    function loads(){
        /* pour chaque image dans le body on la compare avec une image dans notre tableau 
           si elles correspondes, on selectionne l'indice du tableau et on le renvoi pour la fenetre modale
        */
        $("body").find("img").on("click",function(){
            var indice = 0;
            for(var i = 0 ; i < $('#nombre').val() ; i++){
                if(images[i].url == $(this).attr("src")){
                    indice = i;
                }
            }
            clicks(indice);
        });
    }

    // ce fonction permet grace a loads défini précédament de remlir la fenetre modale avec les informations de l'image
    function clicks(indice){

        $('.modal').html(" <span class='modal_close'>&#215;</span>" + images[indice].titleImg +" <br/> "+ images[indice].date +" <br/> " + images[indice].auteur +" <br/> "+ images[indice].url);
        $('.modal').css('display', 'block');
        $('.modal_close').click(function(){
        $('.modal').css('display', 'none');
         });
    }

    // rempli le tableau d'objets images grace a une requette getJSON
    function getPhoto (ville){
        images = [];
        $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags="+ ville +"&tagmode=any&format=json&jsoncallback=?",
        function(data){
                
            $.each(data.items, function(i,item){
                //mise en place du dictionnaire ( autheur -> url)
                var image = {"url" : item.media.m,"auteur" : item.author, "date" : item.date_taken, "titleImg" : item.title};
                images.push(image);
                //window.alert(images);
                if(i == 20){
                    return false;
                }
            }); 
        });
    }

    // tri notre tableau d'images grace a notre comparateur personnalisé
    function sortByAuthor(){
        images = images.sort(compareAuthor);
    }

    // notre comparateur, tri par rapport aux auteurs
    function compareAuthor(a,b) {
        if (a.auteur < b.auteur)
            return -1;
        if (a.auteur > b.auteur)
            return 1;
        return 0;
    }

    // permet d'effectuer le changement de vue entre carousel et liste
    function changerVue(vue){
        // si la vue est carousel on vide l'espace et on rempli avec nos photos 
        // contenues dans la liste ( en suivant le modele de carousel )
        if(vue == "carousel"){

            $("#rowPhoto").empty();
            $("#rowPhoto").html('<div id="owl-demo" class="owl-carousel"></div>');

            var content = "";

            for (var i = 0; i < $('#nombre').val(); i++) {
                content += "<div class='item'> <img class='imgListe' src='"+ images[i].url +"' /></div>"; //;$("<img id='tailleImg'/>").attr("src", item.media.m).appendTo("#rowPhoto");
                $('#owl-demo').html(content);
                setTimeout(function(){$('#owl-demo').owlCarousel({navigation : true, // Show next and prev buttons
                slideSpeed : 300,
                paginationSpeed : 400,
                singleItem:true});},100);
            };
        }
        // sinon c'est la demande de liste
        // pareil on vide l'espace et on rempli en suivant notre formattage en liste
        else{

            $("#rowPhoto").empty();
            for (var i = 0; i< $('#nombre').val(); i++) {
                var titre = images[i].titleImg;
                $("#rowPhoto").append("<div class='col-lg-3 col-md-4 col-sm-6 col-xs-12'><img id='imgListe' src='"+images[i].url+"'/></div>");
            };
        }
    }

});
 





