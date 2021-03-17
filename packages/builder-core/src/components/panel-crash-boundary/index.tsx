/**
 * WordPress Dependencies
 */
import { Component } from '@wordpress/element';

interface Props {
	children: React.ReactNode;
	onError: ( err: any ) => void;
}

interface State {
	hasError: boolean;
}

class PanelCrashBoundary extends Component< Props, State > {
	constructor( props: Props ) {
		super( props );
		this.state = {
			hasError: false,
		} as State;
	}

	componentDidCatch( error ) {
		this.props.onError( error );

		this.setState( {
			hasError: true,
		} );
	}

	render() {
		if ( this.state.hasError ) {
			return null;
		}

		return this.props.children;
	}
}

export default PanelCrashBoundary;
