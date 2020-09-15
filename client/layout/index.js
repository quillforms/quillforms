/**
 * QuillForms Dependencies
 */
import { useFilters } from '@quillforms/builder-components';
/**
 * External dependencies
 */
import { Component, Fragment, lazy, Suspense } from '@wordpress/element';
import { Router, Route, Switch } from 'react-router-dom';
import { compose } from '@wordpress/compose';

/**
 * WooCommerce dependencies
 */
import { getHistory } from '@woocommerce/navigation';

/**
 * Internal dependencies
 */
import { Controller, getPages, PAGES_FILTER } from './controller';
import AdminFullScreen from '../admin-full-screen';

export const Layout = ( props ) => {
	return (
		<div className="quillforms-layout">
			<div className="quillforms-layout__main">
				<Controller { ...props } />
			</div>
		</div>
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

export const PageLayout = compose(
	// Use the useFilters HoC so PageLayout is re-rendered when filters are used to add new pages or reports
	useFilters( [ PAGES_FILTER ] )
)( _PageLayout );
