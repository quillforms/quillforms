/**
 * WordPress Dependencies
 */
import { Fragment, useCallback, useEffect, useState, useRef } from 'react';
import { Popover } from '@wordpress/components';

/**
 * External Dependencies
 */
import { Transforms, Text, Editor, Range, Node as SlateNode } from 'slate';
import { Slate, Editable, ReactEditor, RenderElementProps } from 'slate-react';
import { HistoryEditor } from 'slate-history';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import Element from '../element';
import HoveringToolbar from '../hovering-toolbar';
import MergeTagListItem from '../merge-tag-list-item';
import type {
	MergeTags,
	MergeTagsSections,
	MergeTag,
	allowedFormats,
} from '../../types';
import classNames from 'classnames';
import { noop } from 'lodash';

// Add these type definitions
interface CustomText {
	bold?: boolean;
	italic?: boolean;
	textColor?: string;
	text: string;
}

declare module 'slate' {
	interface CustomTypes {
		Editor: BaseEditor & ReactEditor & HistoryEditor;
		Element: CustomElement;
		Text: CustomText;
	}
}

interface Props {
	editor: ReactEditor & HistoryEditor;
	placeholder?: string;
	color?: string;
	value: SlateNode[];
	onChange: (value: SlateNode[]) => void;
	onFocus?: React.FocusEventHandler;
	onBlur?: React.FocusEventHandler;
	mergeTags?: MergeTags;
	mergeTagsSections?: MergeTagsSections;
	allowedFormats?: allowedFormats;
	className?: string;
}

const TextEditor: React.FC<Props> = (props) => {
	const {
		editor,
		placeholder,
		color,
		onChange,
		value,
		onFocus = noop,
		onBlur = noop,
		mergeTags = [],
		allowedFormats = [],
	} = props;



	const editorStyles = css`
        .richtext__editor {
            position: relative;
        }

        [data-slate-placeholder] {
            position: absolute;
            pointer-events: none;
            display: inline-block;
            color: #666;
            opacity: 0.6;
            width: 100%;
            white-space: pre-wrap;
            z-index: 0;
            user-select: none;
        }

        [contenteditable] {
            position: relative;
            z-index: 1;
            min-height: 24px;
        }
    `;

	const wrapperRef = useRef<HTMLDivElement>(null);
	const PopoverRef = useRef(null);
	const ref = useRef<HTMLDivElement>(null);
	const [target, setTarget] = useState<Range | undefined>();
	const [index, setIndex] = useState(0);
	const [search, setSearch] = useState('');
	const [currentColor, setCurrentColor] = useState('#000000');

	const $mergeTags = mergeTags.filter((c) => {
		if (search) {
			return c.label
				?.toLowerCase()
				.startsWith(search ? search.toLowerCase() : '');
		}
		return true;
	});

	const isFormatActive = (format: string) => {
		if (format === 'textColor') {
			const [match] = Editor.nodes(editor, {
				match: n => Text.isText(n) && n.textColor !== undefined,
				mode: 'all',
			});
			return !!match;
		}
		const [match] = Editor.nodes(editor, {
			match: (n) => n[format] === true,
			mode: 'all',
		});
		return !!match;
	};

	const toggleFormat = (format: string, value?: string) => {
		if (format === 'textColor') {
			Transforms.setNodes(
				editor,
				{ textColor: value },
				{ match: Text.isText, split: true }
			);
			setCurrentColor(value || '#000000');
		} else {
			const active = isFormatActive(format);
			Transforms.setNodes(
				editor,
				{ [format]: active ? null : true },
				{ match: Text.isText, split: true }
			);
		}
	};

	const renderElement = useCallback(props => {
		return <Element {...props} editor={editor} mergeTags={mergeTags} />;
	}, [mergeTags, value]);

	const Leaf = ({ attributes, children, leaf }) => {
		const style = { color: leaf.textColor || 'inherit' };

		if (leaf.bold) {
			children = <strong>{children}</strong>;
		}

		if (leaf.italic) {
			children = <em>{children}</em>;
		}

		return <span {...attributes} style={style}>{children}</span>;
	};

	// Rest of your existing code for merge tags and other functionality...

	const insertMergeTag = (mergeTag: MergeTag) => {
		Transforms.insertNodes(editor, {
			type: 'mergeTag',
			data: {
				type: mergeTag.type,
				modifier: mergeTag.modifier,
			},
			children: [{ text: '' }],
		});
		setTimeout(() => {
			Transforms.move(editor);
		}, 0);
	};

	const onKeyDown = useCallback(
		(event) => {
			if (event.key === 'Enter' && allowedFormats?.length === 0) {
				event.preventDefault();
			}
			if (target) {
				switch (event.key) {
					case 'ArrowDown':
						event.preventDefault();
						const prevIndex =
							index >= $mergeTags.length - 1 ? 0 : index + 1;
						setIndex(prevIndex);
						break;
					case 'ArrowUp':
						event.preventDefault();
						const nextIndex =
							index <= 0 ? $mergeTags.length - 1 : index - 1;
						setIndex(nextIndex);
						break;
					case 'Tab':
					case 'Enter':
						event.preventDefault();
						Transforms.select(editor, target);
						insertMergeTag($mergeTags[index]);
						setTarget(undefined);
						break;
					case 'Escape':
						event.preventDefault();
						setTarget(undefined);
						break;
				}
			}
		},
		[index, search, target]
	);

	useEffect(() => {
		function handleClickOutsidePortal(event: MouseEvent): void {
			if (
				PopoverRef.current &&
				ref.current &&
				// @ts-expect-error
				!PopoverRef.current.contains(event.target as Node) &&
				!ref.current.contains(event.target as Node)
			) {
				setTarget(undefined);
			}
		}

		document.addEventListener('mousedown', handleClickOutsidePortal);
		return () => {
			document.removeEventListener('mousedown', handleClickOutsidePortal);
		};
	}, [PopoverRef]);

	return (
		<div
			className={classNames("richtext__editor", props.className, editorStyles)}
			style={{ width: '100%' }}
			ref={wrapperRef}
		>
			<Slate
				editor={editor}
				initialValue={value}
				onChange={(val) => {
					onChange(val);
					const { selection } = editor;

					if (selection && Range.isCollapsed(selection)) {
						const [start] = Range.edges(selection);
						const wordBefore = selection;
						const before = wordBefore && Editor.before(editor, wordBefore);
						const beforeRange = before && Editor.range(editor, before, start);
						const beforeText = beforeRange && Editor.string(editor, beforeRange);
						const beforeMatch = beforeText && beforeText.endsWith('@');
						const after = Editor.after(editor, start);
						const afterRange = Editor.range(editor, start, after);
						const afterText = Editor.string(editor, afterRange);
						const afterMatch = afterText.match(/^(\s|$)/);

						if (beforeMatch && afterMatch) {
							setTarget(beforeRange);
							setSearch(beforeMatch[1]);
							setIndex(0);
						} else {
							setTarget(undefined);
						}
					}
				}}
			>
				{allowedFormats?.length > 0 && (
					<HoveringToolbar
						formattingControls={allowedFormats}
						toggleFormat={toggleFormat}
						isFormatActive={isFormatActive}
						currentColor={currentColor}
					/>
				)}
				<Editable
					style={{ color, position: 'relative' }}
					color={color}
					renderLeaf={($props) => <Leaf {...$props} />}
					renderElement={renderElement}
					placeholder={placeholder}
					onFocus={onFocus}
					onBlur={onBlur}
					onKeyDown={onKeyDown}
					onDOMBeforeInput={(event: Event) => {
						switch ((event as InputEvent).inputType) {
							case 'formatBold':
								return toggleFormat('bold');
							case 'formatItalic':
								return toggleFormat('italic');
						}
					}}
				/>
				{target && $mergeTags.length > 0 && (
					<Popover
						ref={PopoverRef}
						className={css`
                                z-index: 1111111111111111111;
                                .components-popover__content {
                                    padding: 3px;
                                    border: none;
                                    border-radius: 4px;
                                    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
                                    z-index: 111111111111111111;
                                }
                            `}
						onKeyDown={onKeyDown}
					>
						<div
							className={css`
                                    padding: 5px 25px;
                                    font-weight: bold;
                                `}
						>
							Recall Information from...
						</div>
						<div
							className="rich-text-merge-tag-list"
							ref={ref}
						>
							{$mergeTags.map((mergeTag, i) => (
								<MergeTagListItem
									key={`merge-tag-${i}`}
									mergeTag={mergeTag}
									onClick={() => {
										Transforms.select(editor, target);
										insertMergeTag(mergeTag);
										ReactEditor.focus(editor);
									}}
									onMouseEnter={() => setIndex(i)}
									isSelected={index === i}
								/>
							))}
						</div>
					</Popover>
				)}
			</Slate>
		</div>
	);
};

export default TextEditor;