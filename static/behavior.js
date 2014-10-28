
(function ($) {

  $(function () {

    $('.segment')
      .on('mouseenter', function () {
        $(this).addClass('over');
      })
      .on('mouseleave', function () {
        $(this).removeClass('over');
      });

  });

})(jQuery);
