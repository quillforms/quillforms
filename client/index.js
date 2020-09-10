import { render } from '@wordpress/element';
import { PageLayout } from './layout';
import './style.scss';

const appRoot = document.getElementById( 'qf-admin-root' );
render( <PageLayout />, appRoot );
