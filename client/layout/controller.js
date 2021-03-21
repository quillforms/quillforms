import { Suspense, lazy, useEffect } from '@wordpress/element';
import { parse } from 'qs';
import NotFoundPage from '../pages/not-found';

// Modify webpack pubilcPath at runtime based on location of WordPress Plugin.
// eslint-disable-next-line no-undef,camelcase
__webpack_public_path__ = qfAdmin.assetsBuildUrl;

const Home = lazy( () =>
	import( /* webpackChunkName: "home" */ '../pages/home' )
);

const Builder = lazy( () =>
	import( /* webpackChunkName: "builder" */ '../pages/builder' )
);

const Share = lazy( () =>
	import( /* webpackChunkName: "integrations" */ '../pages/share' )
);

const Entries = lazy( () =>
	import( /* webpackChunkName: "entries" */ '../pages/entries' )
);

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
		slug: 'home',
	} );

	// Form Builder
	pages.push( {
		container: Builder,
		path: '/forms/:id/builder/',
	} );

	// Form Integrations
	pages.push( {
		container: Share,
		path: '/forms/:id/share',
	} );

	pages.push( {
		container: Entries,
		path: '/forms/:id/entries',
	} );
	pages.push( {
		container: NotFoundPage,
		path: '*',
	} );

	return pages;
};
