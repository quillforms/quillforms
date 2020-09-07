/**
 * QuillForms Dependencies
 */
import { useFilters } from '@quillforms/builder-components';
/**
 * External dependencies
 */
import { Component, lazy, Suspense } from '@wordpress/element';
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

export const Layout = ( props ) => {
	return (
		<div className="quillforms-layout">
			<div className="quillforms-layout__main">
				<Controller { ...props } />
			</div>
		</div>
	);
};

class _PageLayout extends Component {
	render() {
		return (
			<Router history={ getHistory() }>
				<Switch>
					{ getPages().map( ( page ) => {
						return (
							<Route
								key={ page.path }
								path={ page.path }
								exact
								render={ ( props ) => (
									<Layout page={ page } { ...props } />
								) }
							/>
						);
					} ) }
				</Switch>
			</Router>
		);
	}
}

export const PageLayout = compose(
	// Use the useFilters HoC so PageLayout is re-rendered when filters are used to add new pages or reports
	useFilters( [ PAGES_FILTER ] )
)( _PageLayout );
