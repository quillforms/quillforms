import { render } from '@wordpress/element';
import '@wordpress/core-data';
import '@wordpress/notices';
import '@quillforms/blocks';
import '@quillforms/rich-text';
import '@quillforms/form-integrations';
import '@quillforms/payment-gateways';
import '@quillforms/code-editor';
import "@quillforms/quiz-editor";
import PageLayout from './layout';
import './partial-submission-point'
import './style.scss';
import './pro-panels';
import { doAction } from '@wordpress/hooks';

console.log('React initialization starting');

// Define the initialization function
const initializeApp = () => {
    try {
        const appRoot = document.getElementById('qf-admin-root');
        console.log('Looking for app root element');

        // Early return if element not found
        if (!appRoot) {
            console.error('qf-admin-root element not found');
            return;
        }

        console.log('Found app root, rendering application');

        // Render the application
        render(<PageLayout />, appRoot);

        console.log('React app rendered successfully');

        // Fire WordPress action
        doAction('QuillForms.Admin.PluginsLoaded');

        console.log('QuillForms.Admin.PluginsLoaded action fired');

    } catch (error) {
        console.error('Error during app initialization:', error);

        // Try to show error message in the UI
        const appRoot = document.getElementById('qf-admin-root');
        if (appRoot) {
            appRoot.innerHTML = `
                <div style="color: red; padding: 20px; margin: 20px; border: 1px solid red;">
                    <h3>Error Initializing Application</h3>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }
};

// Handle the initialization timing
if (document.readyState === 'loading') {
    console.log('Document still loading, waiting for DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOMContentLoaded fired');
        initializeApp();
    });
} else {
    console.log('Document already loaded, initializing immediately');
    initializeApp();
}

// Add global error handler
window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});