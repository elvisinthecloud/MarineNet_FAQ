window.addEventListener('load', function () {
    

        $('.dropdown-submenu a.sub').on("click", function(e){
            //hide any others shown, unless this is the same menu open in which case toggle below will close it
            $('.dropdown-menu .subUl').not($(this).next('ul')).each(function(){
                $(this).hide();
            });
            $(this).next('ul').toggle();
            e.stopPropagation();
            e.preventDefault();
        });

    

});