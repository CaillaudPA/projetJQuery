$(document).ready(function(){

	$("#ville").change(function(){
		getPhoto();
	});

    $('.rowPhoto').slick({  
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'linear'
    });

	$( "#ville" ).autocomplete({
        source: function(requete,reponse){
            $.ajax({
                url : "​http://infoweb-ens/~jacquin-c/codePostalComplete.php",
                data : "maxRows=10&commune=" + requete.term,
                dataType : "json",
                method : "GET",
                success : function (json) {
                    Villes = [];
                    $.each(json, function(i,item){
                        //supprimer les doublons
                        if ($.inArray(item.Ville,Villes) == -1){
                        Villes.push(item.Ville);
                        //$('#submit').css({"visibility" :'visible'});
                        //$('#reset').css({"visibility" :'visible'});
                        }
                    });
                    reponse(Villes);
                },
                    error : function (){
                    reponse(["rien"]);
                    }
            });
        }
    });	
});


function getPhoto (){
	$('#row').empty();
	$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags="+ $('#ville').val() +"&tagmode=any&format=json&jsoncallback=?",
	function(data){
		$.each(data.items, function(i,item){
			//$("<div id='divPhoto' class='col-xs-4 col-sm-3 col-md-2'></div>").appendTo("#rowPhoto");
			$("<img />").attr("src", item.media.m).appendTo("#row").wrap("<div></div>");
            if(i==4){
                return false;
            }
		});
	});
}


