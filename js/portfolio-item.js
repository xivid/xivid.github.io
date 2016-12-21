
$('[rel="tooltip"]').tooltip();


$('.thumbnail').hover(
  function(){
    $(this).find('.caption').fadeIn(300);
  },
  function(){
    $(this).find('.caption').fadeOut(300);
  }
);
