/**
 * QuillForms Dependencies.
 */
import { Button } from '@quillforms/admin-components';
import { __ } from '@wordpress/i18n';

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

const Footer: React.FC<Props> = ({ save, close }) => {
	return (
		<div className="integration-connect-footer">
			<div className="integration-connect-footer__wrapper">
				<Button
					isDanger
					className="integration-connect-footer__cancel"
					onClick={close.onClick}
				>
					{__(close.label, 'quillforms')}
				</Button>
				<Button
					className="integration-connect-footer__save"
					isPrimary
					onClick={save.onClick}
					disabled={save.disabled}
				>
					{__(save.label, 'quillforms')}
				</Button>
			</div>
		</div>
	);
};

export default Footer;
