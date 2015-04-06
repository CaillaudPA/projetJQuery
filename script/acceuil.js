$(document).ready(function(){
   
    ville = $('#ville').val();
    // de base la vue est en carousel
    var affichage ="liste";
    var select = $("#nombre");
    var images = []


	$("#ville").change(function(){
        // on rempli le dictionnaire
        var ville = $('#ville').val();
        //var nombre = select.options[select.selectedIndex].text;
        var nombre = select.val();
        getPhoto(ville);
        loads();
	});


    $("#sort").on("click",function(){
        images = sortByAuthor(images);
        changerVue(images, affichage);
        loads();
    });

    $("#list").on("click",function(){

        affichage = "liste";
        changerVue(images, affichage);
        loads();
    });

    $("#carousel").on("click",function(){
        affichage = "carousel";
        changerVue(images, affichage);
        loads();
    });


    function loads(){
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


     // mise en place de l'autocomplete
        $( "#ville" ).autocomplete({
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
        });

    function clicks(indice){
        
        //alert(indice);
        $('.modal').html(" <span class='modal_close'>&#215;</span>" + images[indice].titleImg +" <br/> "+ images[indice].date +" <br/> " + images[indice].auteur +" <br/> "+ images[indice].url);
        $('.modal').css('display', 'block');
        $('.modal_close').click(function(){
        $('.modal').css('display', 'none');
         });
        //window.alert(images[i].titleImg +"  "+ images[i].date +" | " + images[i].auteur +" | "+ images[i].url);  
    }


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

    function sortByAuthor(dico){
        var newTab = [];
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

                for (var i = 0; i < $('#nombre').val(); i++) {
                    content += "<div class='item'> <img class='imgListe' src='"+ dico[i].url +"' /></div>"; //;$("<img id='tailleImg'/>").attr("src", item.media.m).appendTo("#rowPhoto");
                    $('#owl-demo').html(content);
                    setTimeout(function(){$('#owl-demo').owlCarousel({navigation : true, // Show next and prev buttons
                    slideSpeed : 300,
                    paginationSpeed : 400,
                    singleItem:true});},100);
                };
            }
            else{

            $("#rowPhoto").empty();
            //$('#rowPhoto').html("<div class='row' id='row'></div>");

            for (var i = 0; i< $('#nombre').val(); i++) {
                var titre = dico[i].titleImg;
                $("#rowPhoto").append("<div class='col-lg-3 col-md-4 col-sm-6 col-xs-12'><img id='imgListe' src='"+dico[i].url+"'/></div>");
            };
        }
    }

});
 





