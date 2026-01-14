/**
 * QuillForms Embed Script
 * 
 * This script should be hosted on your SaaS server and included alongside
 * the iframe embed code. It listens for postMessage events from QuillForms
 * iframes and handles cross-origin redirects.
 * 
 * Usage:
 * <script src="https://quillforms.app/embed/quillforms-embed.js"></script>
 * <iframe src="https://yoursubdomain.quillforms.app/form/123" ...></iframe>
 */
(function () {
    'use strict';

    // QuillForms SaaS domain - accepts any subdomain of quillforms.app
    var QUILLFORMS_DOMAIN = 'quillforms.app';

    /**
     * Check if the origin is from quillforms.app or any of its subdomains
     */
    function isAllowedOrigin(origin) {
        try {
            var url = new URL(origin);
            var hostname = url.hostname;

            // Check if it's exactly quillforms.app or a subdomain of it
            // e.g., john.quillforms.app, a11rqs.quillforms.app, etc.
            return hostname === QUILLFORMS_DOMAIN ||
                hostname.endsWith('.' + QUILLFORMS_DOMAIN);
        } catch (e) {
            return false;
        }
    }

    /**
     * Validate that the message is a valid QuillForms redirect message
     */
    function isValidRedirectMessage(data) {
        return (
            data &&
            typeof data === 'object' &&
            data.type === 'quillforms-redirect' &&
            typeof data.url === 'string' &&
            data.url.length > 0
        );
    }

    /**
     * Validate URL to prevent javascript: and other potentially harmful URLs
     */
    function isValidUrl(url) {
        try {
            var parsed = new URL(url, window.location.origin);
            // Only allow http and https protocols
            return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch (e) {
            return false;
        }
    }

    /**
     * Handle the redirect
     */
    function handleRedirect(url, newTab) {
        if (!isValidUrl(url)) {
            console.warn('[QuillForms Embed] Invalid redirect URL blocked:', url);
            return;
        }

        if (newTab) {
            // Open in new tab
            var win = window.open(url, '_blank');
            if (win) {
                win.focus();
            }
        } else {
            // Redirect current page
            window.location.href = url;
        }
    }

    /**
     * Message event handler
     */
    function onMessage(event) {
        // Security check: verify origin is from quillforms.app
        if (!isAllowedOrigin(event.origin)) {
            return;
        }

        var data = event.data;

        // Handle string data (in case it's JSON stringified)
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (e) {
                return;
            }
        }

        // Check if this is a QuillForms redirect message
        if (!isValidRedirectMessage(data)) {
            return;
        }

        // Perform the redirect
        handleRedirect(data.url, data.newTab === true);
    }

    /**
     * Initialize the embed script
     */
    function init() {
        // Add message listener
        window.addEventListener('message', onMessage, false);

        // Log initialization (helpful for debugging)
        if (typeof console !== 'undefined' && console.log) {
            console.log('[QuillForms Embed] Initialized - listening for messages from *.quillforms.app');
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose for debugging/verification
    window.QuillFormsEmbed = {
        /**
         * Get current configuration
         */
        getConfig: function () {
            return {
                domain: QUILLFORMS_DOMAIN,
                version: '1.0.0'
            };
        },

        /**
         * Check if an origin would be allowed
         * @param {string} origin - Origin to check
         * @returns {boolean}
         */
        checkOrigin: function (origin) {
            return isAllowedOrigin(origin);
        }
    };
})();
