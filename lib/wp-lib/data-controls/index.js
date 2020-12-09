( window.wp = window.wp || {} ),
	( window.wp.dataControls = ( function( t ) {
		const n = {};
		function e( r ) {
			if ( n[ r ] ) return n[ r ].exports;
			const o = ( n[ r ] = { i: r, l: ! 1, exports: {} } );
			return (
				t[ r ].call( o.exports, o, o.exports, e ),
				( o.l = ! 0 ),
				o.exports
			);
		}
		return (
			( e.m = t ),
			( e.c = n ),
			( e.d = function( t, n, r ) {
				e.o( t, n ) ||
					Object.defineProperty( t, n, { enumerable: ! 0, get: r } );
			} ),
			( e.r = function( t ) {
				'undefined' !== typeof Symbol &&
					Symbol.toStringTag &&
					Object.defineProperty( t, Symbol.toStringTag, {
						value: 'Module',
					} ),
					Object.defineProperty( t, '__esModule', { value: ! 0 } );
			} ),
			( e.t = function( t, n ) {
				if ( ( 1 & n && ( t = e( t ) ), 8 & n ) ) return t;
				if ( 4 & n && 'object' === typeof t && t && t.__esModule )
					return t;
				const r = Object.create( null );
				if (
					( e.r( r ),
					Object.defineProperty( r, 'default', {
						enumerable: ! 0,
						value: t,
					} ),
					2 & n && 'string' !== typeof t )
				)
					for ( const o in t )
						e.d(
							r,
							o,
							function( n ) {
								return t[ n ];
							}.bind( null, o )
						);
				return r;
			} ),
			( e.n = function( t ) {
				const n =
					t && t.__esModule
						? function() {
								return t.default;
						  }
						: function() {
								return t;
						  };
				return e.d( n, 'a', n ), n;
			} ),
			( e.o = function( t, n ) {
				return Object.prototype.hasOwnProperty.call( t, n );
			} ),
			( e.p = '' ),
			e( ( e.s = 364 ) )
		);
	} )( {
		34( t, n ) {
			t.exports = window.wp.deprecated;
		},
		364( t, n, e ) {
			'use strict';
			e.r( n ),
				e.d( n, 'apiFetch', function() {
					return l;
				} ),
				e.d( n, 'select', function() {
					return s;
				} ),
				e.d( n, 'syncSelect', function() {
					return a;
				} ),
				e.d( n, 'dispatch', function() {
					return d;
				} ),
				e.d( n, '__unstableAwaitPromise', function() {
					return p;
				} ),
				e.d( n, 'controls', function() {
					return f;
				} );
			const r = e( 43 ),
				o = e.n( r ),
				i = e( 4 ),
				c = e( 34 ),
				u = e.n( c );
			function l( t ) {
				return { type: 'API_FETCH', request: t };
			}
			function s() {
				return (
					u()( '`select` control in `@wordpress/data-controls`', {
						alternative:
							'built-in `resolveSelect` control in `@wordpress/data`',
					} ),
					i.controls.resolveSelect.apply( i.controls, arguments )
				);
			}
			function a() {
				return (
					u()( '`syncSelect` control in `@wordpress/data-controls`', {
						alternative:
							'built-in `select` control in `@wordpress/data`',
					} ),
					i.controls.select.apply( i.controls, arguments )
				);
			}
			function d() {
				return (
					u()( '`dispatch` control in `@wordpress/data-controls`', {
						alternative:
							'built-in `dispatch` control in `@wordpress/data`',
					} ),
					i.controls.dispatch.apply( i.controls, arguments )
				);
			}
			var p = function( t ) {
					return { type: 'AWAIT_PROMISE', promise: t };
				},
				f = {
					AWAIT_PROMISE( t ) {
						return t.promise;
					},
					API_FETCH( t ) {
						const n = t.request;
						return o()( n );
					},
				};
		},
		4( t, n ) {
			t.exports = window.wp.data;
		},
		43( t, n ) {
			t.exports = window.wp.apiFetch;
		},
	} ) );
