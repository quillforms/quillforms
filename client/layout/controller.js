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
import ResultsPage from '../pages/results';
import IntegrationsPage from '../pages/integrations';
import Addons from '../pages/addons';
import Settings from '../pages/settings';
import License from '../pages/license';
import System from '../pages/system';
import Support from '../pages/support';

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
	requiresInitialPayload: true,
	connectedStores: [
		'quillForms/block-editor',
		'quillForms/messages-editor',
		'quillForms/notifications-editor',
		'quillForms/theme-editor',
		'quillForms/document-editor',
	],
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

registerAdminPage( 'results', {
	component: ResultsPage,
	path: '/forms/:id/results',
	template: 'full-screen',
	header: ( { match } ) => {
		const { params } = match;
		return <FormAdminBar formId={ params.id } />;
	},
} );

registerAdminPage( 'integrations', {
	component: IntegrationsPage,
	path: '/forms/:id/integrations',
	template: 'full-screen',
	header: ( { match } ) => {
		const { params } = match;
		return <FormAdminBar formId={ params.id } />;
	},
	requiresInitialPayload: true,
} );

registerAdminPage( 'addons', {
	component: Addons,
	path: 'addons',
} );

registerAdminPage( 'settings', {
	component: Settings,
	path: 'settings',
} );

registerAdminPage( 'license', {
	component: License,
	path: 'license',
} );

registerAdminPage( 'system', {
	component: System,
	path: 'system',
} );

registerAdminPage( 'support', {
	component: Support,
	path: 'support',
} );

registerAdminPage( 'not_found', {
	component: NotFoundPage,
	path: '*',
} );
