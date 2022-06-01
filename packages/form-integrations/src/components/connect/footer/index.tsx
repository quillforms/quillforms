/**
 * QuillForms Dependencies.
 */
import { Button } from '@quillforms/admin-components';

/**
 * External Dependencies.
 */
import { css } from 'emotion';
interface Props {
	save: {
		label: string;
		onClick: () => void;
		disabled: boolean;
	};
	close: {
		label: string;
		onClick: () => void;
	};
}

const Footer: React.FC< Props > = ( { save, close } ) => {
	return (
		<div className="integration-connect-footer">
			<div className="integration-connect-footer__wrapper">
				<Button
					isDanger
					className="integration-connect-footer__cancel"
					onClick={ close.onClick }
				>
					{ close.label }
				</Button>
				<Button
					className="integration-connect-footer__save"
					isPrimary
					onClick={ save.onClick }
					disabled={ save.disabled }
				>
					{ save.label }
				</Button>
			</div>
		</div>
	);
};

export default Footer;
