/**
 * WordPress Dependencies
 */
import { SlotFillProvider } from '@wordpress/components';

/**
 * External dependencies
 */
import { Router, Route, Switch } from 'react-router-dom';
import { getHistory } from '@woocommerce/navigation';

/**
 * Internal dependencies
 */
import { Controller, getPages } from './controller';
import Sidebar from './sidebar';
import Header from './header';
import NotFoundPage from '../pages/not-found';

export const Layout = ( props ) => {
	return (
		<SlotFillProvider>
			<div className="quillforms-layout">
				<Header />
				<div className="quillforms-layout__main">
					<Sidebar />
					<Controller { ...props } />
				</div>
			</div>
		</SlotFillProvider>
	);
};

const _PageLayout = () => {
	return (
		<Router history={ getHistory() }>
			<Switch>
				{ getPages().map( ( page ) => {
					return (
						<Route
							key={ page.path }
							path={ page.path }
							exact={ true }
							render={ ( props ) => (
								<Layout page={ page } { ...props } />
							) }
						/>
					);
				} ) }
			</Switch>
		</Router>
	);
};

export default _PageLayout;
