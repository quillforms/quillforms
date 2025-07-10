jQuery(document).ready(function ($) {
    // move quillforms-popup-overlay to body
    $('.quillforms-popup-overlay').appendTo('body');

    $('.quillforms-popup-button').on('click', function (e) {
        $('body').addClass('quillforms-popup-active');
        e.preventDefault();
        var formId = $(this).attr('data-formId');
        $('.quillforms-popup-overlay[data-formId=' + formId + ']').addClass('active');

        // Try to focus existing iframe immediately after modal opens
        setTimeout(function () {
            var iframe = $('.quillforms-popup-overlay[data-formId=' + formId + '] iframe')[0];
            if (iframe) {
                // Focus on iframe content if accessible
                try {
                    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    if (iframeDoc) {
                        var formFlow = iframeDoc.querySelector('.renderer-core-form-flow__wrapper, .renderer-core-form-flow, input, textarea, button');
                        if (formFlow) {
                            formFlow.focus();
                        }
                    }
                } catch (e) {
                    // Fallback to iframe focus
                    iframe.tabIndex = 0;
                    iframe.focus();
                }
            }
        }, 400);

        // Uncomment these if you need to create iframe dynamically:
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

    // Handle iframe load and focus
    $('.quillforms-popup-iframe-wrapper iframe').on('load', function () {
        var iframe = this;
        $(this).closest('.quillforms-popup-iframe-wrapper').addClass('active');

        // Focus on content inside iframe (this works!)
        setTimeout(function () {
            try {
                var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc && iframeDoc.readyState === 'complete') {
                    console.log('=== IFRAME LOAD FOCUS ATTEMPT ===');
                    console.log('Document ready state:', iframeDoc.readyState);

                    // Try multiple selectors
                    var selectors = [
                        '.renderer-core-form-flow__wrapper',
                        '.renderer-core-form-flow'
                    ];

                    var focused = false;
                    for (var i = 0; i < selectors.length; i++) {
                        var element = iframeDoc.querySelector(selectors[i]);
                        if (element) {
                            element.focus();
                            focused = true;
                            break;
                        }
                    }

                    if (!focused) {
                        console.log('No focusable elements found');
                    }
                }
            } catch (e) {
                console.log('Error accessing iframe content:', e);
                // Fallback for cross-origin
                iframe.tabIndex = 0;
                iframe.focus();
            }
        }, 300);
    });

    // Add keydown listener to see what happens with Tab
    $(document).on('keydown', function (e) {
        if (e.key === 'Tab') {

            if (document.activeElement.tagName === 'IFRAME') {
                try {
                    var iframeDoc = document.activeElement.contentDocument;
                } catch (e) {
                }
            }
        }
    });
});