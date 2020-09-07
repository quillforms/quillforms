import { render } from '@wordpress/element';
import { PageLayout } from './layout';

const appRoot = document.getElementById( 'qf-admin-root' );
render( <PageLayout />, appRoot );
