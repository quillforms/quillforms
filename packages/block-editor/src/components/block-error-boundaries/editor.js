/**
 * WordPress Dependencies
 */
import { Component } from '@wordpress/element';

class ErrorBoundary extends Component {
	constructor( props ) {
		super( props );
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidCatch() {
		// You can also log the error to an error reporting service
		// // // console.log(error);
		// // // console.log(errorInfo);
	}

	render() {
		const { message } = this.props;
		if ( this.state.hasError ) {
			// You can render any custom fallback UI
			if ( message ) {
				return <p>This block encounters an error!</p>;
			}
			return null;
		}

		return this.props.children;
	}
}
export default ErrorBoundary;
