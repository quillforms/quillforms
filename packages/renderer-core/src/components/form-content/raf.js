/* =================================== */
/* ANIMATION POLYFILLS
     /* =================================== */

/* request animation frame */
const raf = ( () => {
	return (
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		function( callback ) {
			return window.setTimeout( callback, 1000 / 60 );
		}
	);
} )();

export default raf;
