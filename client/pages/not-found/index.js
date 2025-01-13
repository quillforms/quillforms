import { css } from 'emotion';
import { __ } from "@wordpress/i18n";
const NotFoundPage = () => {
	return (
		<div
			className={css`
				background: #e05252;
				color: #fff;
				padding: 10px;
				border-radius: 5px;
				max-width: 300px;
				margin: auto;
				text-align: center;
				margin-top: 100px;
			` }
		>
			{__('Page not found', 'quillforms')}
		</div>
	);
};

export default NotFoundPage;
