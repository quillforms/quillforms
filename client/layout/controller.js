import { Suspense, lazy, useEffect } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { last } from 'lodash';
import { parse, stringify } from 'qs';

// Modify webpack pubilcPath at runtime based on location of WordPress Plugin.
// eslint-disable-next-line no-undef,camelcase
__webpack_public_path__ = qfAdmin.assetsBuildUrl;

const Home = lazy( () =>
	import( /* webpackChunkName: "home" */ '../pages/home' )
);

const Builder = lazy( () =>
	import( /* webpackChunkName: "builder" */ '../pages/builder' )
);

const Integrations = lazy( () =>
	import( /* webpackChunkName: "integrations" */ '../pages/integrations' )
);

const Entries = lazy( () =>
	import( /* webpackChunkName: "entries" */ '../pages/entries' )
);

/**
 * WooCommerce dependencies
 */

import { getPersistedQuery, getHistory } from '@woocommerce/navigation';

export const PAGES_FILTER = 'quillforms_admin_pages_list';

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

	window.qfWpNavMenuUrlUpdate( query );
	window.qfWpNavMenuClassChange( page, url );

	return (
		<Suspense fallback={ <div /> }>
			<page.container
				params={ params }
				path={ url }
				pathMatch={ page.path }
				query={ query }
			/>
		</Suspense>
	);
};
export const getPages = () => {
	const pages = [];

	// Home page
	pages.push( {
		container: Home,
		path: '/',
		wpOpenMenu: 'toplevel_page_quillforms',
	} );

	// Form Builder
	pages.push( {
		container: Builder,
		path: '/forms/:id/builder/',
		wpOpenMenu: 'toplevel_page_quillforms',
		includeInFullScreenToolbar: true,
	} );

	// Form Integrations
	pages.push( {
		container: Integrations,
		path: '/forms/:id/integrations',
		wpOpenMenu: 'toplevel_page_quillforms',
		includeInFullScreenToolbar: true,
	} );

	pages.push( {
		container: Entries,
		path: '/forms/:id/entries',
		wpOpenMenu: 'toplevel_page_quillforms',
		includeInFullScreenToolbar: true,
	} );
	return applyFilters( PAGES_FILTER, pages );
};

// Update's wc-admin links in wp-admin menu
window.qfWpNavMenuUrlUpdate = function( query ) {
	const nextQuery = getPersistedQuery( query );

	Array.from(
		document.querySelectorAll( '#adminmenu a' )
	).forEach( ( item ) => updateLinkHref( item, nextQuery ) );
};

/**
 * Update an anchor's link in sidebar to include persisted queries. Leave excluded screens
 * as is.
 *
 * @param {HTMLElement} item - Sidebar anchor link.
 * @param {Object} nextQuery - A query object to be added to updated hrefs.
 */
export function updateLinkHref( item, nextQuery ) {
	const isQFAdmin = /admin.php\?page=quillforms/.test( item.href );

	if ( isQFAdmin ) {
		const search = last( item.href.split( '?' ) );
		const query = parse( search );

		const href =
			'admin.php?' + stringify( Object.assign( query, nextQuery ) );

		// Replace the href so you can see the url on hover.
		item.href = href;

		item.onclick = ( e ) => {
			e.preventDefault();
			getHistory().push( href );
		};
	}
}

// When the route changes, we need to update wp-admin's menu with the correct section & current link
window.qfWpNavMenuClassChange = function( page, url ) {
	Array.from( document.getElementsByClassName( 'current' ) ).forEach(
		function( item ) {
			item.classList.remove( 'current' );
		}
	);

	const submenu = Array.from(
		document.querySelectorAll( '.wp-has-current-submenu' )
	);
	submenu.forEach( function( element ) {
		element.classList.remove( 'wp-has-current-submenu' );
		element.classList.remove( 'wp-menu-open' );
		element.classList.remove( 'selected' );
		element.classList.add( 'wp-not-current-submenu' );
		element.classList.add( 'menu-top' );
	} );

	const pageUrl =
		url === '/'
			? 'admin.php?page=quillforms'
			: 'admin.php?page=quillforms&path=' + encodeURIComponent( url );
	const currentItemsSelector =
		url === '/'
			? `li > a[href$="${ pageUrl }"], li > a[href*="${ pageUrl }?"]`
			: `li > a[href*="${ pageUrl }"]`;
	const currentItems = document.querySelectorAll( currentItemsSelector );

	Array.from( currentItems ).forEach( function( item ) {
		item.parentElement.classList.add( 'current' );
	} );

	if ( page.wpOpenMenu ) {
		const currentMenu = document.querySelector( '#' + page.wpOpenMenu );
		if ( currentMenu ) {
			currentMenu.classList.remove( 'wp-not-current-submenu' );
			currentMenu.classList.add( 'wp-has-current-submenu' );
			currentMenu.classList.add( 'wp-menu-open' );
			currentMenu.classList.add( 'current' );
		}
	}

	const wpWrap = document.querySelector( '#wpwrap' );
	wpWrap.classList.remove( 'wp-responsive-open' );
};
