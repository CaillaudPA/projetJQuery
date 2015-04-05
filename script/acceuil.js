$(document).ready(function(){

	$("#ville").change(function(){
		getPhoto();
	});
        

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
});


function getPhoto (){

    var content = "";
	$("#rowPhoto").empty();
    $("#rowPhoto").html('<div id="owl-demo" class="owl-carousel"></div>');

    

    	$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags="+ $('#ville').val() +"&tagmode=any&format=json&jsoncallback=?",
    	function(data){
           
    		$.each(data.items, function(i,item){
    			//$("<div id='divPhoto' class='col-xs-4 col-sm-3 col-md-2'></div>").appendTo("#rowPhoto");
                    if ($('#checkBoxCcarousel').is(':checked')){
        			content += "<div class='item'> <img src='"+ item.media.m+"' /></div>"; //;$("<img id='tailleImg'/>").attr("src", item.media.m).appendTo("#rowPhoto");
        		    $('#owl-demo').html(content);
                    setTimeout(function(){$('#owl-demo').owlCarousel({navigation : true, // Show next and prev buttons
                    slideSpeed : 300,
                    paginationSpeed : 400,
                    singleItem:true});},2000);
                }
        
            });
    	});


    
}


