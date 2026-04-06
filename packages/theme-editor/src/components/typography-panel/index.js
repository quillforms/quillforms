/**
 * WordPress Dependencies
 */
import { PanelBody, TextControl as WPTextControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import {
	IconDesktop,
	IconFontSize,
	IconLineHeight,
	IconMobile,
} from './icons';

function parsePx(px) {
	const n = parseInt(String(px).replace(/px/gi, ''), 10);
	return Number.isFinite(n) ? n : 0;
}

function toPx(n) {
	const v = Math.round(Number(n));
	if (!Number.isFinite(v)) {
		return '16px';
	}
	const clamped = Math.min(120, Math.max(8, v));
	return `${clamped}px`;
}

function ViewportToggle({ value, onChange }) {
	return (
		<div
			className="theme-editor-typography__viewport-toggle"
			role="group"
			aria-label={__('Breakpoint', 'quillforms')}
		>
			<button
				type="button"
				className={
					'theme-editor-typography__viewport-btn' +
					(value === 'lg' ? ' is-active' : '')
				}
				aria-pressed={value === 'lg'}
				onClick={() => onChange('lg')}
				aria-label={__('Desktop', 'quillforms')}
			>
				<IconDesktop />
			</button>
			<button
				type="button"
				className={
					'theme-editor-typography__viewport-btn' +
					(value === 'sm' ? ' is-active' : '')
				}
				aria-pressed={value === 'sm'}
				onClick={() => onChange('sm')}
				aria-label={__('Mobile', 'quillforms')}
			>
				<IconMobile />
			</button>
		</div>
	);
}

function IconNumberField({ icon, value, onChange, ariaLabel }) {
	const Icon = icon === 'lineHeight' ? IconLineHeight : IconFontSize;
	return (
		<div className="theme-editor-typography__icon-field">
			<span className="theme-editor-typography__icon-field-icon" aria-hidden="true">
				<Icon />
			</span>
			<WPTextControl
				className="theme-editor-typography__icon-field-input"
				type="number"
				value={String(value)}
				onChange={(v) => onChange(toPx(v))}
				label={ariaLabel}
				hideLabelFromVision
			/>
		</div>
	);
}

function TypographySection({
	title,
	showViewport,
	viewport,
	setViewport,
	children,
}) {
	return (
		<div className="theme-editor-typography__section">
			<div className="theme-editor-typography__section-head">
				<span className="theme-editor-typography__section-title">{title}</span>
				{showViewport ? (
					<ViewportToggle value={viewport} onChange={setViewport} />
				) : (
					<span className="theme-editor-typography__section-head-spacer" />
				)}
			</div>
			{children}
		</div>
	);
}

const TypographyPanel = ({ properties, setCurrentThemeProperties }) => {
	const {
		fontSize,
		typographyPreset,
		fontLineHeight,
		questionsLabelFontSize,
		questionsLabelLineHeight,
		questionsDescriptionFontSize,
		questionsDescriptionLineHeight,
		textInputAnswers,
		buttonsFontSize,
	} = properties;

	const [viewports, setViewports] = useState({
		base: 'lg',
		questionsLabel: 'lg',
		questionsDescription: 'lg',
		textInputAnswers: 'lg',
		buttonsText: 'lg',
	});

	const vp = (key) => {
		const v = viewports[key];
		return {
			viewport: v,
			setViewport: (next) =>
				setViewports((prev) => ({ ...prev, [key]: next })),
			bk: v === 'lg' ? 'lg' : 'sm',
		};
	};

	const baseVp = vp('base');
	const questionsLabelVp = vp('questionsLabel');
	const questionsDescriptionVp = vp('questionsDescription');
	const textInputAnswersVp = vp('textInputAnswers');
	const buttonsTextVp = vp('buttonsText');

	const md = {
		fontSize: {
			lg: '20px',
			sm: '16px',
		},
		fontLineHeight: {
			lg: '28px',
			sm: '24px',
		},
		typographyPreset: 'md',
		questionsLabelFontSize: {
			lg: '24px',
			sm: '20px',
		},
		questionsLabelLineHeight: {
			lg: '32px',
			sm: '28px',
		},
		questionsDescriptionFontSize: {
			lg: '20px',
			sm: '16px',
		},
		questionsDescriptionLineHeight: {
			lg: '28px',
			sm: '24px',
		},
		textInputAnswers: {
			lg: '30px',
			sm: '24px',
		},
		buttonsFontSize: {
			lg: '20px',
			sm: '16px',
		},
		buttonsPadding: {
			top: {
				lg: '9px',
				sm: '9px',
			},
			bottom: {
				lg: '9px',
				sm: '9px',
			},
			left: {
				lg: '23px',
				sm: '23px',
			},
			right: {
				lg: '20px',
				sm: '20px',
			},
		},
	};
	const lg = {
		fontSize: {
			lg: '20px',
			sm: '20px',
		},
		fontLineHeight: {
			lg: '28px',
			sm: '28px',
		},
		typographyPreset: 'lg',
		questionsLabelFontSize: {
			lg: '36px',
			sm: '30px',
		},
		questionsLabelLineHeight: {
			lg: '44px',
			sm: '38px',
		},
		questionsDescriptionFontSize: {
			lg: '20px',
			sm: '16px',
		},
		questionsDescriptionLineHeight: {
			lg: '28px',
			sm: '24px',
		},
		textInputAnswers: {
			lg: '30px',
			sm: '24px',
		},
		buttonsFontSize: {
			lg: '20px',
			sm: '20px',
		},
		buttonsPadding: {
			top: {
				lg: '9px',
				sm: '9px',
			},
			bottom: {
				lg: '9px',
				sm: '9px',
			},
			left: {
				lg: '23px',
				sm: '23px',
			},
			right: {
				lg: '20px',
				sm: '20px',
			},
		},
	};
	const sm = {
		fontSize: {
			lg: '16px',
			sm: '16px',
		},
		fontLineHeight: {
			lg: '24px',
			sm: '24px',
		},
		typographyPreset: 'sm',
		questionsLabelFontSize: {
			lg: '16px',
			sm: '16px',
		},
		questionsLabelLineHeight: {
			lg: '24px',
			sm: '24px',
		},
		questionsDescriptionFontSize: {
			lg: '14px',
			sm: '14px',
		},
		questionsDescriptionLineHeight: {
			lg: '20px',
			sm: '20px',
		},
		answersMargin: {
			top: {
				lg: '24px',
				sm: '24px',
			},
			bottom: {
				lg: '16px',
				sm: '16px',
			},
			right: {
				lg: '0px',
				sm: '0px',
			},
			left: {
				lg: '0px',
				sm: '0px',
			},
		},
		textInputAnswers: {
			lg: '20px',
			sm: '20px',
		},
		buttonsFontSize: {
			lg: '16px',
			sm: '16px',
		},
		buttonsPadding: {
			top: {
				lg: '10px',
				sm: '10px',
			},
			bottom: {
				lg: '10px',
				sm: '10px',
			},
			left: {
				lg: '23px',
				sm: '23px',
			},
			right: {
				lg: '20px',
				sm: '20px',
			},
		},
	};

	return (
		<PanelBody
			className="theme-editor-typography-panel"
			title={__('Typography & Spacing', 'quillforms')}
			initialOpen={false}
		>
			<div className="theme-editor-typography__block">
				<label className="theme-editor-typography__label">
					{__('Select a preset for Typography', 'quillforms')}
				</label>
				<div
					className="theme-editor-typography__presets"
					role="group"
					aria-label={__('Typography preset', 'quillforms')}
				>
					<button
						type="button"
						className={
							'theme-editor-typography__preset-btn' +
							(typographyPreset === 'lg' ? ' is-active' : '')
						}
						aria-pressed={typographyPreset === 'lg'}
						onClick={() => setCurrentThemeProperties({ ...lg })}
					>
						LG
					</button>
					<button
						type="button"
						className={
							'theme-editor-typography__preset-btn' +
							(typographyPreset === 'md' ? ' is-active' : '')
						}
						aria-pressed={typographyPreset === 'md'}
						onClick={() => setCurrentThemeProperties({ ...md })}
					>
						MD
					</button>
					<button
						type="button"
						className={
							'theme-editor-typography__preset-btn' +
							(typographyPreset === 'sm' ? ' is-active' : '')
						}
						aria-pressed={typographyPreset === 'sm'}
						onClick={() => setCurrentThemeProperties({ ...sm })}
					>
						SM
					</button>
				</div>
			</div>

			<div className="theme-editor-typography__divider" role="separator" />

			<TypographySection
				title={__('Base', 'quillforms')}
				showViewport
				viewport={baseVp.viewport}
				setViewport={baseVp.setViewport}
			>
				<div className="theme-editor-typography__dual">
					<IconNumberField
						icon="fontSize"
						value={parsePx(fontSize[baseVp.bk])}
						ariaLabel={__('Base font size', 'quillforms')}
						onChange={(px) =>
							setCurrentThemeProperties({
								fontSize: { ...fontSize, [baseVp.bk]: px },
							})
						}
					/>
					<IconNumberField
						icon="lineHeight"
						value={parsePx(fontLineHeight[baseVp.bk])}
						ariaLabel={__('Base line height', 'quillforms')}
						onChange={(px) =>
							setCurrentThemeProperties({
								fontLineHeight: { ...fontLineHeight, [baseVp.bk]: px },
							})
						}
					/>
				</div>
			</TypographySection>

			<div className="theme-editor-typography__divider" role="separator" />

			<TypographySection
				title={__('Questions Label', 'quillforms')}
				showViewport
				viewport={questionsLabelVp.viewport}
				setViewport={questionsLabelVp.setViewport}
			>
				<div className="theme-editor-typography__dual">
					<IconNumberField
						icon="fontSize"
						value={parsePx(questionsLabelFontSize[questionsLabelVp.bk])}
						ariaLabel={__('Questions label font size', 'quillforms')}
						onChange={(px) =>
							setCurrentThemeProperties({
								questionsLabelFontSize: {
									...questionsLabelFontSize,
									[questionsLabelVp.bk]: px,
								},
							})
						}
					/>
					<IconNumberField
						icon="lineHeight"
						value={parsePx(questionsLabelLineHeight[questionsLabelVp.bk])}
						ariaLabel={__('Questions label line height', 'quillforms')}
						onChange={(px) =>
							setCurrentThemeProperties({
								questionsLabelLineHeight: {
									...questionsLabelLineHeight,
									[questionsLabelVp.bk]: px,
								},
							})
						}
					/>
				</div>
			</TypographySection>

			<div className="theme-editor-typography__divider" role="separator" />

			<TypographySection
				title={__('Questions Description', 'quillforms')}
				showViewport
				viewport={questionsDescriptionVp.viewport}
				setViewport={questionsDescriptionVp.setViewport}
			>
				<div className="theme-editor-typography__dual">
					<IconNumberField
						icon="fontSize"
						value={parsePx(
							questionsDescriptionFontSize[questionsDescriptionVp.bk]
						)}
						ariaLabel={__('Questions description font size', 'quillforms')}
						onChange={(px) =>
							setCurrentThemeProperties({
								questionsDescriptionFontSize: {
									...questionsDescriptionFontSize,
									[questionsDescriptionVp.bk]: px,
								},
							})
						}
					/>
					<IconNumberField
						icon="lineHeight"
						value={parsePx(
							questionsDescriptionLineHeight[questionsDescriptionVp.bk]
						)}
						ariaLabel={__('Questions description line height', 'quillforms')}
						onChange={(px) =>
							setCurrentThemeProperties({
								questionsDescriptionLineHeight: {
									...questionsDescriptionLineHeight,
									[questionsDescriptionVp.bk]: px,
								},
							})
						}
					/>
				</div>
			</TypographySection>

			<div className="theme-editor-typography__divider" role="separator" />

			<TypographySection
				title={__('Text input answers', 'quillforms')}
				showViewport
				viewport={textInputAnswersVp.viewport}
				setViewport={textInputAnswersVp.setViewport}
			>
				<IconNumberField
					icon="fontSize"
					value={parsePx(textInputAnswers[textInputAnswersVp.bk])}
					ariaLabel={__('Text input answers font size', 'quillforms')}
					onChange={(px) =>
						setCurrentThemeProperties({
							textInputAnswers: {
								...textInputAnswers,
								[textInputAnswersVp.bk]: px,
							},
						})
					}
				/>
			</TypographySection>

			<div className="theme-editor-typography__divider" role="separator" />

			<TypographySection
				title={__('Buttons Text', 'quillforms')}
				showViewport
				viewport={buttonsTextVp.viewport}
				setViewport={buttonsTextVp.setViewport}
			>
				<IconNumberField
					icon="fontSize"
					value={parsePx(buttonsFontSize[buttonsTextVp.bk])}
					ariaLabel={__('Buttons font size', 'quillforms')}
					onChange={(px) =>
						setCurrentThemeProperties({
							buttonsFontSize: {
								...buttonsFontSize,
								[buttonsTextVp.bk]: px,
							},
						})
					}
				/>
			</TypographySection>
		</PanelBody>
	);
};

export default TypographyPanel;
