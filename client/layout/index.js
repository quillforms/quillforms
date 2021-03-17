/**
 * WordPress Dependencies
 */
import { SlotFillProvider } from '@wordpress/components';
import { compose } from '@wordpress/compose';

/**
 * External dependencies
 */
import { Router, Route, Switch } from 'react-router-dom';
import { getHistory } from '@woocommerce/navigation';

/**
 * Internal dependencies
 */
import { Controller, getPages, PAGES_FILTER } from './controller';
import AdminFullScreen from '../admin-full-screen';

export const Layout = ( props ) => {
	return (
		<SlotFillProvider>
			<div className="quillforms-layout">
				<div className="quillforms-layout__main">
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
					const { includeInFullScreenToolbar } = page;

					return (
						<Route
							key={ page.path }
							path={ page.path }
							exact
							render={ ( props ) => (
								<>
									{ includeInFullScreenToolbar ? (
										<AdminFullScreen { ...props }>
											<Layout
												page={ page }
												{ ...props }
											/>
										</AdminFullScreen>
									) : (
										<Layout page={ page } { ...props } />
									) }
								</>
							) }
						/>
					);
				} ) }
			</Switch>
		</Router>
	);
};

export default _PageLayout;
