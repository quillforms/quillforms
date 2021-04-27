/**
 * QuillForms Dependencies
 */
import {
	getAdminPages,
	Router,
	Route,
	Switch,
	getHistory,
} from '@quillforms/navigation';

/**
 * WordPress Dependencies
 */
import { SlotFillProvider } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { Controller } from './controller';
import Sidebar from '../components/sidebar';
import Header from '../components/header';

export const Layout = ( props ) => {
	return (
		<SlotFillProvider>
			<div className="quillforms-layout">
				{ ! props.page.header ? (
					<Header />
				) : (
					<props.page.header { ...props } />
				) }

				<div className="quillforms-layout__main">
					{ ( ! props.page.template ||
						props.page.template === 'default' ) && <Sidebar /> }
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
				{ Object.values( getAdminPages() ).map( ( page ) => {
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
