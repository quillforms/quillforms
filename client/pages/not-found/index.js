import { css } from 'emotion';
const NotFoundPage = () => {
	return (
		<div
			className={ css`
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
			Page Not found!
		</div>
	);
};

export default NotFoundPage;
