jQuery(document).ready(function ($) {
    // move quillforms-popup-overlay to body
    $('.quillforms-popup-overlay').appendTo('body');

    $('.quillforms-popup-button').on('click', function (e) {
        e.preventDefault();
        var formId = $(this).attr('data-formId');
        var $targetOverlay = $('.quillforms-popup-overlay[data-formId="' + formId + '"]').first();

        // Add active class to body and the specific overlay
        $('body').addClass('quillforms-popup-active');
        $targetOverlay.addClass('active');

        // Try to focus existing iframe immediately after modal opens
        setTimeout(function () {
            var iframe = $targetOverlay.find('iframe')[0];
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
    });

    // exit the modal on Escape click - close all active popups
    $(document).keydown(function (event) {
        if (event.keyCode == 27) {
            $('.quillforms-popup-overlay.active').removeClass('active');
            $('body').removeClass('quillforms-popup-active');
        }
    });

    // Close button - close only the parent overlay
    $('.quillforms-popup-close').on('click', function () {
        var $overlay = $(this).closest('.quillforms-popup-overlay');
        $overlay.removeClass('active');

        // Only remove body class if no other popups are active
        if ($('.quillforms-popup-overlay.active').length === 0) {
            $('body').removeClass('quillforms-popup-active');
        }
    });

    // close pop up on click outside - close only the clicked overlay
    $(document).mouseup(function (e) {
        var $activeOverlays = $(".quillforms-popup-overlay.active");

        $activeOverlays.each(function () {
            var $container = $(this).find(".quillforms-popup-container");
            if (!$container.is(e.target) && $container.has(e.target).length === 0) {
                $(this).removeClass('active');
            }
        });

        // Only remove body class if no other popups are active
        if ($('.quillforms-popup-overlay.active').length === 0) {
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