jQuery(document).ready(function ($) {
    // move quillforms-popup-overlay to body
    $('.quillforms-popup-overlay').appendTo('body');
    $('.quillforms-popup-button').on('click', function (e) {
        $('body').addClass('quillforms-popup-active');
        e.preventDefault();
        var formId = $(this).attr('data-formId');
        $('.quillforms-popup-overlay[data-formId=' + formId + ']').addClass('active');
        // $('.quillforms-popup-iframe-wrapper').append('<iframe src="' + $(this).attr('data-url') + '" width="100%" height="100%" style="border:0;"></iframe>');
        // add loader before iframe loads
        // $('.quillforms-popup-iframe-wrapper').removeClass('active');
        // add loader
        // $('.quillforms-popup-iframe-wrapper').append('<div class="quillforms-popup-loader"><div class="quillforms-loading-circle"></div></div>');


    });
    // exit the modal on Escape click


    $(document).keydown(function (event) {
        if (event.keyCode == 27) {
            $('.quillforms-popup-overlay').removeClass('active');
            $('body').removeClass('quillforms-popup-active');
        }
    });
    $('.quillforms-popup-close').on('click', function () {
        $(this).closest('.quillforms-popup-overlay').removeClass('active');
        $('body').removeClass('quillforms-popup-active');
    });

    // close pop up on click outside
    $(document).mouseup(function (e) {
        var container = $(".quillforms-popup-overlay.active .quillforms-popup-container");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.closest('.quillforms-popup-overlay').removeClass('active');
            $('body').removeClass('quillforms-popup-active');
        }
    });

    $('.quillforms-popup-iframe-wrapper iframe').on('load', function () {
        $(this).closest('.quillforms-popup-iframe-wrapper').addClass('active');
    });
});