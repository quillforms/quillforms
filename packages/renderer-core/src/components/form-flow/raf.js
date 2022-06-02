/* =================================== */
/* ANIMATION POLYFILLS
     /* =================================== */

/* request animation frame */
const raf = ( () => {
	return (
		window.requestAnimationFrame ||
		// @ts-expect-error
		window.webkitRequestAnimationFrame ||
		// @ts-expect-error
		window.mozRequestAnimationFrame ||
		// @ts-expect-error
		window.msRequestAnimationFrame ||
		// @ts-expect-error
		window.oRequestAnimationFrame ||
		function ( callback ) {
			return window.setTimeout( callback, 1000 / 60 );
		}
	);
} )();

export default raf;
