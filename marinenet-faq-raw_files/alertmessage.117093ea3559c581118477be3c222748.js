window.addEventListener('load', function () {



$(".closureBtn").on('click', function(){

    var $this = $(this);

    //console.log( $this.data("id"));

   $.ajax({
        type : "POST",
        url : '/bin/portal/alert/closure',
        data : {
           alertName : $this.data("id")
        },
        success : function(data, textStatus, jqXHR) {
           console.log(data);
                    },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
              console.log(errorThrown) 
        }
    });



});



});