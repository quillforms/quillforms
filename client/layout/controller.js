/**
 * QuillForms Dependencies
 */
import { registerAdminPage } from '@quillforms/navigation';
import { FormAdminBar, AdminNotices } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * External Dependencies
 */
import { parse } from 'qs';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import NotFoundPage from '../pages/not-found';
import Home from '../pages/home';
import Builder from '../pages/builder';
import Share from '../pages/share';
import Support from '../pages/support';
import IntegrationsPage from '../pages/integrations';
import SingleIntegrationPage from '../pages/single-integration';
export const Controller = ( { page, match, location } ) => {
	useEffect( () => {
		window.document.documentElement.scrollTop = 0;
	}, [] );

	const getQuery = ( searchString ) => {
		if ( ! searchString ) {
			return {};
		}

		const search = searchString.substring( 1 );
		return parse( search );
	};

	const { url, params } = match;
	const query = getQuery( location.search );

	return (
		<div
			className={ classnames( 'qf-page-component-wrapper', {
				'has-sidebar': ! page.template || page.template === 'default',
			} ) }
		>
			<page.component
				params={ params }
				path={ url }
				pathMatch={ page.path }
				query={ query }
			/>
			<AdminNotices />
		</div>
	);
};

registerAdminPage( 'home', {
	component: Home,
	path: '/',
} );
registerAdminPage( 'builder', {
	component: Builder,
	path: '/forms/:id/builder/',
	template: 'full-screen',
	header: ( { match } ) => {
		const { params } = match;
		return <FormAdminBar formId={ params.id } />;
	},
} );
registerAdminPage( 'share', {
	component: Share,
	path: '/forms/:id/share',
	template: 'full-screen',
	header: ( { match } ) => {
		const { params } = match;
		return <FormAdminBar formId={ params.id } />;
	},
} );

registerAdminPage( 'support', {
	component: Support,
	path: 'support',
} );
registerAdminPage( 'integrations', {
	component: IntegrationsPage,
	path: '/forms/:id/integrations',
	template: 'full-screen',
	header: ( { match } ) => {
		const { params } = match;
		return <FormAdminBar formId={ params.id } />;
	},
} );

registerAdminPage( 'single-integration', {
	component: SingleIntegrationPage,
	path: '/forms/:id/integrations/:slug',
	template: 'full-screen',
	header: ( { match } ) => {
		const { params } = match;
		return <FormAdminBar formId={ params.id } />;
	},
} );

registerAdminPage( 'not_found', {
	component: NotFoundPage,
	path: '*',
} );
