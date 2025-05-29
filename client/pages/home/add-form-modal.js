/**
 * WordPress Dependencies.
 */
import { Modal } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies.
 */
import { css } from 'emotion';
import classnames from 'classnames';
import AddFormTitle from './add-form-title';
import { Icon } from '@wordpress/components';
import ScratchIcon from './scratch-icon';
import TemplateIcon from './template-icon';
import ChooseTemplate from './choose-template';
import GenerateAIForm from './generate-ai-form';
import AIIcon from './ai-icon';

const AddFormModal = ({ closeModal }) => {
	const [formTitleScreen, setFormTitleScreen] = useState(false);
	const [formTemplateScreen, setFormTemplateScreen] = useState(false);
	const [aiFormScreen, setAiFormScreen] = useState(false);

	return (
		<Modal
			className={classnames(
				'quillforms-home__add-form-modal',
				css`
					width: 100% !important;
					height: 100% !important;
					max-height: 100%;
					max-width: 100%;
					margin-right: 0;
					margin-left: 0;
					margin-top: 0;
					margin-bottom: 0;
					border-radius: 0;

					.components-modal__content {
						display: flex;
						justify-content: center;
						padding: 20px 0 0;
						margin-top: 60px;
						background: #fafafa;
						&:before {
							display: none;
						}
						.components-modal__header {
							margin: 0 0 45px;
							.components-modal__header-heading {
								font-size: 1rem;
								/* font-weight: 600; */
								font-family: 'Roboto', sans-serif;
								font-weight: 300;
								font-size: 20px;
							}

							div {
								justify-content: center;
							}
						}
						> div:last-child {
							width: 100%;

							h2 {
								font-size: 20px
							}
							input {
								width: 100%;
								padding: 10px;
								background: transparent;
								outline: none !important;
								border-bottom: 1px solid #e3e3e3 !important;
								border: none;
								font-size: 18px !important;
							}
						}
					}
					.quillforms-home__add-form-modal-footer button {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 49%;
						padding: 20px 10px;
						font-size: 18px;
					}
				`

			)}
			title={__('Create new form', 'quillforms')}
			onRequestClose={closeModal}
			shouldCloseOnClickOutside={false}

		>
			{formTitleScreen ? (
				<AddFormTitle closeModal={closeModal} />
				// ) : aiFormScreen ? (
				// 	<GenerateAIForm closeModal={closeModal} /> // New component we'll create
				// ) 
			) : (
				<>
					{formTemplateScreen ? <ChooseTemplate /> : (
						<div class="create-form-cards">
							<div className="create-from-scratch-card" onClick={() => { setFormTitleScreen(true) }}>
								<ScratchIcon />
								{__('Start from scratch', 'quillforms')}
							</div>
							<div className='choose-template-card' onClick={() => {
								setFormTemplateScreen(true)
							}}>
								<TemplateIcon />
								{__('Choose a template', 'quillforms')}
							</div>
							{/* Add AI option */}
							{/* <div className='ai-form-card' onClick={() => {
								setAiFormScreen(true)
							}}>
								<AIIcon />
								{__('Generate with AI', 'quillforms')}
							</div> */}
						</div>
					)}
				</>
			)}
		</Modal>
	);
};

export default AddFormModal;
