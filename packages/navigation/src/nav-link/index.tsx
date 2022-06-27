import { NavLink } from 'react-router-dom';

let forceReload = false;

type Props = React.ComponentProps< typeof NavLink >;

const CustomNavLink: React.FC< Props > = ( props ) => {
	return (
		<NavLink
			{ ...props }
			onClick={ ( e ) => {
				if ( forceReload ) {
					e.preventDefault();
					const parts = window.location.href.split( '/' );
					parts.pop();
					const url = parts.join( '/' ) + props.to;
					window.location.href = url;
				}
			} }
		/>
	);
};

const setForceReload = ( value: boolean ) => {
	forceReload = value;
};

export { CustomNavLink as NavLink, setForceReload };
