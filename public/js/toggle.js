$( document ).ready(function() {
    console.log( "ready! soy yo toggle" );
    $("#otra-ctolenk").on('click', function(e) {
      console.log('Entrando al toggle');
            e.preventDefault();
            $("#wrapper").toggleClass("active");
    });
});
