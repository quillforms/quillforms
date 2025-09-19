/**
 * WordPress Dependencies
 */
import { TextControl, Dropdown, MenuGroup, MenuItem } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useRef } from "@wordpress/element";
import { Icon, plusCircle } from '@wordpress/icons';
import BlockIconBox from '../block-icon-box';
import getPlainExcerpt from "../rich-text/get-plain-excerpt";
import { __ } from "@wordpress/i18n";

interface Props {
	type?: string;
	value?: string;
	autoComplete?: string;
	onChange: (val: string) => void;
	placeholder?: string;
	className?: string;
	withMergeTags?: boolean;
}

const CustomTextControl: React.FC<Props> = (props) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const { blocks, blockTypes } = useSelect((select) => {
		return {
			blocks: select('quillForms/block-editor').getEditableFields(),
			blockTypes: select('quillForms/blocks').getBlockTypes(),
		};
	}, []);

	// Set default autoComplete if not provided
	const componentProps = {
		...props,
		autoComplete: props.autoComplete ?? 'off',
	};

	const insertText = (textToInsert: string) => {
		const input = inputRef.current;
		if (!input) return;

		const cursorPos = input.selectionStart ?? 0;
		const currentText = props.value ?? '';

		// Insert text at cursor position
		const newText = currentText.slice(0, cursorPos) + textToInsert + currentText.slice(cursorPos);

		// Update the value using the onChange prop
		props.onChange(newText);

		// Move cursor after inserted text
		setTimeout(() => {
			input.focus();
			const newCursorPos = cursorPos + textToInsert.length;
			input.setSelectionRange(newCursorPos, newCursorPos);
		}, 0);
	};

	return (
		<div className={'admin-components-text-control'}>
			<TextControl
				{...componentProps}
				ref={inputRef}
			/>
			{props.withMergeTags && (
				<div className="admin-components-text-control-merge-tags">
					<Dropdown
						className="form-card__dropdown"
						position="bottom left"
						renderToggle={({ isOpen, onToggle }) => (
							<span className="admin-components-text-control__merge-tags">
								<Icon
									icon={plusCircle}
									onClick={onToggle}
									aria-expanded={isOpen}
								/>
							</span>
						)}
						renderContent={({ onClose }) => (
							<MenuGroup>
								{blocks?.map((block) => (
									<MenuItem
										key={block.id}
										onClick={() => {
											insertText(`{{field:${block.id}}}`);
											onClose();
										}}
									>
										<BlockIconBox
											icon={blockTypes?.[block.name]?.icon}
											color={blockTypes?.[block.name]?.color}
										/>

										<span
											className="block-label"
											dangerouslySetInnerHTML={{
												__html: getPlainExcerpt(block?.attributes?.label),
											}}
										/>
									</MenuItem>
								))}
							</MenuGroup>
						)}
					/>
				</div>
			)}
		</div>
	);
};

export default CustomTextControl;