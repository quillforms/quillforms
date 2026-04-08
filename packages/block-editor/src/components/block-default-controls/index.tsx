/**
 * QuillForms Dependencies
 */
import {
	ToggleControl,
	BaseControl,
	ComboboxControl,
	ControlWrapper,
	ControlLabel,
	TextControl,
} from '@quillforms/admin-components';

// @ts-expect-error
import { ThemeCard, ThemeListItem } from '@quillforms/theme-editor';
import type { BlockAttributes, FormBlock } from '@quillforms/types';

/**
 * WordPress Dependencies
 */
import { FocalPointPicker, RangeControl, Tooltip } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { MediaUpload, uploadMedia } from '@wordpress/media-utils';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { css } from 'emotion';
/**
 * Internal Dependencies
 */
import BlockThemeControl from '../block-theme';
import CustomHTML from '../block-custom-html';
import BlockLayout from '../block-layout';
import BorderRadiusTemplates from '../border-radius-templates';
import AlignControl from '../block-align';

const AttachmentMediaImageIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={24}
		height={24}
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden
		className="block-editor-default-attachment__type-icon"
	>
		<path
			d="M3.87488 15.5886C4.87019 15.0909 5.83736 14.6088 6.80357 14.1257C7.04803 14.0035 7.29346 13.8822 7.53695 13.758C8.21504 13.4117 8.8941 13.4117 9.57413 13.7503C10.0873 14.0064 10.6005 14.2635 11.1137 14.5196C11.6462 14.7854 12.1458 14.7388 12.6056 14.3566C13.6029 13.5291 14.5963 12.6958 15.5955 11.8703C16.5219 11.1039 17.7073 11.1563 18.5639 11.9993C19.0208 12.4494 19.4719 12.9063 19.9259 13.3593C19.9725 13.4059 20.0219 13.4496 20.1083 13.531C20.1083 13.4166 20.1083 13.3458 20.1083 13.2759C20.1083 12.755 20.1073 12.2331 20.1093 11.7121C20.1093 11.619 20.1122 11.522 20.1403 11.4347C20.1985 11.2475 20.3974 11.1417 20.605 11.1699C20.8126 11.198 20.9649 11.361 20.9649 11.5831C20.9668 12.9868 21.0056 14.3915 20.9532 15.7923C20.8582 18.3194 18.852 20.5215 16.3405 20.9163C16.032 20.9648 15.7167 20.9939 15.4043 20.9949C13.1256 21.0017 10.8459 21.0007 8.56718 20.9978C5.88684 20.9949 3.61005 19.1197 3.09978 16.4888C3.03673 16.1629 3.00762 15.8263 3.00665 15.4945C2.99889 13.176 2.99792 10.8565 3.00374 8.53802C3.00956 5.86349 4.98854 3.5479 7.63299 3.11621C7.8823 3.07547 8.13646 3.04151 8.38869 3.04054C10.2804 3.03375 12.172 3.03569 14.0637 3.03666C14.3489 3.03666 14.5342 3.18897 14.5497 3.43052C14.5652 3.66043 14.4168 3.84862 14.1879 3.88161C14.1025 3.89422 14.0152 3.89422 13.9279 3.89422C12.1701 3.89422 10.4123 3.89616 8.65449 3.89422C7.28279 3.89422 6.10607 4.36568 5.15733 5.35905C4.28813 6.26899 3.86421 7.36809 3.86227 8.62532C3.85839 10.8769 3.8613 13.1294 3.86227 15.382C3.86227 15.4402 3.87003 15.4993 3.87682 15.5886H3.87488ZM11.979 20.1208C11.979 20.1276 11.979 20.1334 11.979 20.1402C13.0878 20.1402 14.1976 20.147 15.3064 20.1383C17.1544 20.1247 18.561 19.3244 19.5068 17.7354C20.0384 16.8419 20.151 15.8544 20.1034 14.8387C20.1005 14.7708 20.0394 14.6951 19.9861 14.6428C19.3177 13.9695 18.6483 13.2973 17.9751 12.6289C17.4192 12.0769 16.7246 12.0497 16.1251 12.5493C15.1453 13.3661 14.1685 14.1859 13.1848 14.9988C12.4291 15.6235 11.6045 15.7215 10.7227 15.2888C10.2144 15.0395 9.708 14.7854 9.20259 14.5293C8.80194 14.3265 8.39645 14.2984 7.99095 14.4992C6.69492 15.1414 5.4018 15.7904 4.10576 16.4335C4.00875 16.4811 3.98741 16.5364 4.01069 16.6373C4.42298 18.4649 6.30009 20.0588 8.17139 20.1131C9.43929 20.1499 10.7091 20.1199 11.979 20.1199V20.1208Z"
			fill="currentColor"
		/>
		<path
			d="M8.99547 10.3074C7.82458 10.3142 6.85643 9.36157 6.85061 8.19455C6.84479 6.99165 7.78674 6.03514 8.98286 6.02932C10.1596 6.0235 11.1297 6.98486 11.1345 8.16157C11.1394 9.33634 10.178 10.3006 8.99547 10.3074ZM10.2634 8.17709C10.2653 7.46214 9.69684 6.88494 8.98771 6.88494C8.29119 6.88494 7.71884 7.45632 7.71205 8.15866C7.70526 8.86488 8.28537 9.45178 8.98965 9.45081C9.68908 9.44984 10.2605 8.87846 10.2634 8.17709Z"
			fill="currentColor"
		/>
		<path
			d="M18.8357 4.27351C18.8357 5.0069 18.8366 5.69469 18.8357 6.38151C18.8357 6.66089 18.695 6.84715 18.4699 6.8811C18.1867 6.92379 17.9684 6.72007 17.9665 6.39994C17.9626 5.77908 17.9645 5.15726 17.9636 4.53641C17.9636 4.46365 17.9636 4.39089 17.9636 4.2803C17.7618 4.41224 17.5872 4.52768 17.4106 4.64118C17.1506 4.80706 16.9052 4.77311 16.7616 4.55484C16.6161 4.33269 16.6782 4.09696 16.9353 3.92428C17.3834 3.62259 17.8326 3.32089 18.2876 3.02889C18.3419 2.99397 18.4564 2.98912 18.5087 3.02307C18.9802 3.32671 19.4449 3.64005 19.9086 3.95338C20.0648 4.05912 20.1453 4.20852 20.1055 4.39962C20.0667 4.58782 19.9445 4.72072 19.7563 4.73624C19.6408 4.74594 19.5079 4.70035 19.4032 4.64312C19.2179 4.54223 19.0481 4.41321 18.8366 4.27351H18.8357Z"
			fill="currentColor"
		/>
	</svg>
);

const AttachmentMediaVideoIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={24}
		height={24}
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden
		className="block-editor-default-attachment__type-icon"
	>
		<path
			d="M15.8649 15.824C15.7897 16.3023 15.6032 16.7038 15.2657 17.0278C14.8832 17.3953 14.4277 17.5952 13.8954 17.5958C10.9236 17.598 7.95129 17.5997 4.97952 17.5958C3.93102 17.5941 3.04122 16.7589 3.01728 15.7171C2.98888 14.5021 3.00391 13.2865 3.00447 12.071C3.00447 10.9947 2.99222 9.91776 3.01895 8.84197C3.04233 7.88758 3.90096 7.04065 4.85424 7.01392C5.66108 6.99165 6.46903 7.00278 7.27586 7.00278C9.44748 7.00167 11.6191 7.00056 13.7907 7.00334C14.8047 7.00501 15.5787 7.59413 15.8153 8.53349C15.837 8.61869 15.8526 8.70555 15.8749 8.80856C16.6455 8.57692 17.4017 8.35085 18.1573 8.12311C18.6356 7.9789 19.1195 7.85027 19.5895 7.68322C20.3924 7.39757 21.0094 7.97834 20.9999 8.72003C20.9721 10.9423 20.9899 13.1652 20.9899 15.3874C20.9899 15.589 20.9938 15.7906 20.9888 15.9916C20.9693 16.7132 20.3829 17.1442 19.688 16.9421C18.4825 16.5907 17.2786 16.2332 16.0737 15.8791C16.0096 15.8602 15.9439 15.8457 15.8654 15.8257L15.8649 15.824ZM9.43077 7.6732C7.97635 7.6732 6.52192 7.67209 5.0675 7.6732C4.24507 7.67376 3.6799 8.23782 3.67934 9.06025C3.67823 11.2202 3.67823 13.3795 3.67934 15.5394C3.67934 16.3557 4.24953 16.9298 5.06917 16.9304C7.97802 16.9332 10.8869 16.9332 13.7957 16.9304C14.6181 16.9298 15.1956 16.3713 15.1989 15.5478C15.2078 13.3812 15.2078 11.2146 15.1989 9.048C15.1956 8.22056 14.6209 7.67376 13.794 7.6732C12.3396 7.67209 10.8852 7.6732 9.43077 7.6732ZM15.8899 9.51016C15.8855 9.55081 15.8793 9.57809 15.8793 9.60538C15.8793 11.3911 15.8799 13.1763 15.876 14.962C15.876 15.0817 15.9161 15.1268 16.0291 15.1597C17.2948 15.5289 18.5582 15.9047 19.8228 16.2772C20.1624 16.3775 20.3128 16.265 20.3128 15.9125C20.3128 13.5087 20.3128 11.1049 20.3128 8.7011C20.3128 8.33693 20.1619 8.22445 19.8127 8.32858C19.1279 8.53349 18.4435 8.74007 17.7592 8.9461C17.1355 9.1343 16.5119 9.32251 15.8894 9.51016H15.8899Z"
			fill="currentColor"
		/>
		<path
			d="M6.91797 14.6947V10.3218C6.91797 10.1776 6.96551 10.0623 7.0606 9.97587C7.15569 9.88942 7.26668 9.84619 7.39356 9.84619C7.43507 9.84619 7.47712 9.85169 7.51971 9.86268C7.56239 9.87357 7.60449 9.88996 7.646 9.91184L11.0858 12.1096C11.1591 12.161 11.2141 12.2195 11.2507 12.2852C11.2873 12.3509 11.3056 12.4252 11.3056 12.5082C11.3056 12.5913 11.2873 12.6656 11.2507 12.7312C11.2141 12.797 11.1591 12.8555 11.0858 12.9068L7.646 15.1046C7.60449 15.1265 7.56239 15.1429 7.51971 15.1538C7.47712 15.1648 7.43507 15.1703 7.39356 15.1703C7.26668 15.1703 7.15569 15.1271 7.0606 15.0406C6.96551 14.9541 6.91797 14.8388 6.91797 14.6947ZM7.50675 14.4807L10.6205 12.5082L7.50675 10.5358V14.4807Z"
			fill="currentColor"
		/>
	</svg>
);

const AttachmentUploadIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={40}
		height={40}
		viewBox="0 0 40 40"
		fill="none"
		aria-hidden
		className="block-editor-default-attachment__upload-icon"
	>
		<path
			d="M25.9304 13.0731C25.731 13.0731 25.3324 13.0731 25.133 12.8738L19.9503 7.49169L14.7676 12.6744C14.3689 13.0731 13.7709 13.0731 13.3722 12.6744C12.9736 12.2757 12.9736 11.6777 13.3722 11.2791L19.3523 5.299C19.751 4.90033 20.349 4.90033 20.7477 5.299L26.7277 11.2791C27.1264 11.6777 27.1264 12.2757 26.7277 12.6744C26.5284 13.0731 26.1297 13.0731 25.9304 13.0731Z"
			fill="#B2328C"
		/>
		<path
			d="M19.9508 24.0364C19.3528 24.0364 18.9541 23.6377 18.9541 23.0397V7.09287C18.9541 6.49486 19.3528 6.09619 19.9508 6.09619C20.5488 6.09619 20.9475 6.49486 20.9475 7.09287V23.0397C20.9475 23.6377 20.5488 24.0364 19.9508 24.0364Z"
			fill="#B2328C"
		/>
		<path
			d="M29.9169 35H9.98339C7.19269 35 5 32.8073 5 30.0166V26.0299C5 25.4319 5.39867 25.0332 5.99668 25.0332C6.59468 25.0332 6.99336 25.4319 6.99336 26.0299V30.0166C6.99336 31.6113 8.38871 33.0066 9.98339 33.0066H29.9169C31.5116 33.0066 32.907 31.6113 32.907 30.0166V26.0299C32.907 25.4319 33.3057 25.0332 33.9037 25.0332C34.5017 25.0332 34.9003 25.4319 34.9003 26.0299V30.0166C34.9003 32.8073 32.7076 35 29.9169 35Z"
			fill="#B2328C"
		/>
	</svg>
);

const WidthControl = ({ value, onChange }) => {
	const widthOptions = [
		{
			key: '100%',
			name: 'Full Width',
			icon: (
				<svg width="40" height="28" viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="2" y="4" width="36" height="20" rx="2" fill="currentColor" fillOpacity="0.1" />
					<rect x="4" y="6" width="32" height="16" rx="1" stroke="currentColor" strokeWidth="2" />
					<rect x="8" y="10" width="24" height="2" fill="currentColor" />
					<rect x="8" y="16" width="16" height="2" fill="currentColor" />
				</svg>
			)
		},
		{
			key: '50%',
			name: 'Half Width',
			icon: (
				<svg width="40" height="28" viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="2" y="4" width="36" height="20" rx="2" fill="currentColor" fillOpacity="0.1" />
					<rect x="4" y="6" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="2" />
					<rect x="8" y="10" width="8" height="2" fill="currentColor" />
					<rect x="8" y="16" width="6" height="2" fill="currentColor" />
				</svg>
			)
		},
		{
			key: '33%',
			name: 'One Third',
			icon: (
				<svg width="40" height="28" viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="2" y="4" width="36" height="20" rx="2" fill="currentColor" fillOpacity="0.1" />
					<rect x="4" y="6" width="11" height="16" rx="1" stroke="currentColor" strokeWidth="2" />
					<rect x="7" y="10" width="5" height="2" fill="currentColor" />
					<rect x="7" y="16" width="4" height="2" fill="currentColor" />
				</svg>
			)
		}
	];

	return (
		<div className={css`
            display: flex;
            gap: 8px;
            width: 100%;
        `}>
			{widthOptions.map((option) => (
				<button
					key={option.key}
					className={css`
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 8px;
                        padding: 12px 8px;
                        background: #fff;
                        color: ${value === option.key ? 'var(--wp-admin-theme-color)' : '#1e1e1e'};
                        border: 2px solid ${value === option.key ? 'var(--wp-admin-theme-color)' : '#e2e4e7'};
                        border-radius: 6px;
                        cursor: pointer;
                        transition: all 0.2s ease;

                        &:hover {
                            border-color: var(--wp-admin-theme-color);
                            color: var(--wp-admin-theme-color);
                        }

                        svg {
                            width: 40px;
                            height: 28px;
                        }

                        span {
                            font-size: 11px;
                            font-weight: 500;
                        }
                    `}
					onClick={() => onChange(option.key)}
				>
					{option.icon}
					<span>{option.name}</span>
				</button>
			))}
		</div>
	);
};
interface Props {
	blockName: string;
	attributes?: BlockAttributes;
	setAttributes: (x: Record<string, unknown>) => void;
	isChild?: boolean;
	parentBlock: FormBlock;
}
const DefaultControls: React.FC<Props> = ({
	blockName,
	isChild,
	attributes,
	setAttributes,
	parentBlock
}) => {
	const {
		editableSupport,
		requiredSupport,
		attachmentSupport,
		themeSupport,
		defaultValueSupport,
		numericSupport,
		placeholderSupport,
		alignSupport,
		maxUploadFileSize,
		wpAllowedMimeTypes,
	} = useSelect((select) => {
		let maxUpload: number | undefined;
		let mimeTypes: Record<string, string> | null = null;
		try {
			const blockEditor = select('core/block-editor') as {
				getSettings?: () => {
					maxUploadFileSize?: number;
					allowedMimeTypes?: Record<string, string> | null;
				};
			};
			const mediaSettings = blockEditor?.getSettings?.();
			maxUpload = mediaSettings?.maxUploadFileSize;
			mimeTypes = mediaSettings?.allowedMimeTypes ?? null;
		} catch {
			/* core/block-editor optional in some screens */
		}
		return {
			editableSupport: select('quillForms/blocks').hasBlockSupport(
				blockName,
				'editable'
			),
			requiredSupport: select('quillForms/blocks').hasBlockSupport(
				blockName,
				'required'
			),
			attachmentSupport: select('quillForms/blocks').hasBlockSupport(
				blockName,
				'attachment'
			),
			themeSupport: select('quillForms/blocks').hasBlockSupport(
				blockName,
				'theme'
			),
			defaultValueSupport: select('quillForms/blocks').hasBlockSupport(
				blockName,
				'defaultValue'
			),
			placeholderSupport: select('quillForms/blocks').hasBlockSupport(
				blockName,
				'placeholder'
			),
			numericSupport: select('quillForms/blocks').hasBlockSupport(
				blockName,
				'numeric'
			),
			alignSupport: select('quillForms/blocks').hasBlockSupport(
				blockName,
				'align'
			),
			maxUploadFileSize: maxUpload,
			wpAllowedMimeTypes: mimeTypes,
		};
	});
	let required, attachment, blockTheme, defaultValue;
	if (attributes) {
		required = attributes.required;
		attachment = attributes.attachment;
		blockTheme = attributes.themeId;
		defaultValue = attributes.defaultValue ?? '';
	}


	const widthOptions = [
		{ key: '100%', name: __('100%', 'quillforms') },
		{ key: '50%', name: __('50%', 'quillforms') },
		{ key: '33%', name: __('33%', 'quillforms') },
	]
	return (
		<div className="block-editor-block-default-controls">
			{editableSupport && requiredSupport && (
				<BaseControl>
					<ControlWrapper>
						<ControlLabel label={__('Required', 'quillforms')} />
						<ToggleControl
							checked={required}
							onChange={() =>
								setAttributes({
									required: !required,
								})
							}
						/>
					</ControlWrapper>
				</BaseControl>
			)}

			{attachmentSupport && !isChild && (
				<>
					<BaseControl>
						<div className="block-editor-default-attachment">
							<div className="block-editor-default-attachment__header">
								<div className="block-editor-default-attachment__title-wrap">
									<span className="block-editor-default-attachment__heading">
										{__('Upload an image/video', 'quillforms')}
									</span>
									<Tooltip
										text={__(
											'Add an image or an embedded YouTube video alongside this question.',
											'quillforms'
										)}
									>
										<button
											type="button"
											className="block-editor-default-attachment__info"
											aria-label={__('More information', 'quillforms')}
										>
											<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" fill="none">
												<path d="M15.1511 27.9999C14.8306 27.9518 14.5047 27.9091 14.1841 27.861C12.747 27.6527 11.4007 27.1879 10.1398 26.4719C9.9635 26.3704 9.82459 26.3544 9.62692 26.4399C8.36607 26.9848 7.04112 27.2413 5.66274 27.1985C5.36355 27.1878 5.12848 27.081 4.99492 26.8032C4.86669 26.5307 4.92012 26.2743 5.11245 26.0445C5.7215 25.318 6.15425 24.4952 6.47481 23.6083C6.52823 23.4587 6.5122 23.3519 6.41604 23.2237C5.2193 21.653 4.43395 19.8952 4.15079 17.9506C3.52037 13.5536 4.86669 9.85123 8.18977 6.89679C9.94213 5.33676 12.015 4.39113 14.3444 4.10797C18.6078 3.58974 22.2033 4.94675 25.0669 8.15229C26.6376 9.91534 27.5459 12.0043 27.8931 14.3443C27.9305 14.6115 27.9626 14.8839 28 15.1511V16.8393C27.984 16.9088 27.9626 16.9729 27.9519 17.0423C27.8931 17.459 27.8557 17.8811 27.7756 18.2925C27.2681 20.8783 26.0339 23.0634 24.0946 24.8425C22.3903 26.4132 20.3922 27.4069 18.1056 27.8129C17.6835 27.8877 17.2614 27.9412 16.8394 27.9999H15.1511ZM5.88178 26.3918C6.04206 26.3918 6.14891 26.3918 6.25576 26.3918C7.42578 26.3491 8.53704 26.0819 9.58952 25.5691C9.82459 25.4569 10.0169 25.4675 10.2467 25.6011C12.5333 26.9528 14.9909 27.4496 17.6194 27.0703C19.9114 26.7391 21.9255 25.7934 23.5977 24.196C26.4079 21.514 27.5833 18.2177 27.0597 14.3604C26.7498 12.0684 25.7775 10.0596 24.1854 8.38736C21.6156 5.68403 18.4422 4.49263 14.7237 4.88264C12.3089 5.13374 10.1932 6.10075 8.43553 7.76228C5.70013 10.3321 4.5034 13.5109 4.87738 17.256C5.07505 19.2702 5.7963 21.092 7.03578 22.6841C7.38304 23.1275 7.40441 23.4908 7.21208 23.977C6.8755 24.8211 6.46946 25.6225 5.88178 26.3972V26.3918Z" fill="#236294" />
												<path d="M15.4025 24.8209C14.0936 24.8743 13.3082 23.9875 13.1159 23.1861C13.0197 22.7854 13.0357 22.4007 13.1479 22.0107C13.6395 20.2744 14.1256 18.5327 14.6118 16.7964C14.8095 16.0965 14.5103 15.6531 13.789 15.5729C13.4631 15.5355 13.212 15.2898 13.1907 14.9585C13.1746 14.6967 13.1746 14.4296 13.1907 14.1625C13.2067 13.8793 13.4097 13.6282 13.6875 13.5748C14.3928 13.4359 15.0926 13.2703 15.8032 13.2008C17.1495 13.0619 18.1806 14.2747 17.8921 15.605C17.438 17.7313 16.9786 19.8523 16.5244 21.9787C16.4657 22.2565 16.5832 22.4114 16.8664 22.3847C17.0801 22.3633 17.2991 22.3152 17.4968 22.2404C17.9509 22.0748 18.3516 22.2404 18.5119 22.6946C18.576 22.8762 18.6401 23.0632 18.6935 23.2502C18.8004 23.6242 18.6828 23.9233 18.3463 24.1264C17.7799 24.4629 17.1549 24.6286 16.5138 24.7141C16.1451 24.7675 15.7711 24.7888 15.3972 24.8209H15.4025ZM14.0081 14.7609C15.1407 14.9585 15.7231 15.9576 15.3704 17.1276C14.8469 18.8426 14.3874 20.5736 13.9119 22.2992C13.6822 23.1327 14.2325 23.934 15.0926 23.9821C15.5574 24.0035 16.0276 23.9554 16.4924 23.8966C16.9892 23.8379 17.4647 23.7043 17.9188 23.4425C17.8654 23.2983 17.8173 23.1594 17.7746 23.0472C17.5075 23.1006 17.2617 23.1647 17.016 23.1968C16.1505 23.309 15.5628 22.6465 15.7444 21.7917C16.1985 19.676 16.6527 17.5604 17.1068 15.4394C17.2884 14.5899 16.6313 13.8954 15.7711 14.0289C15.2636 14.1091 14.7614 14.2266 14.2538 14.2907C14.0295 14.3228 13.976 14.4136 14.0027 14.6059C14.0081 14.6593 14.0134 14.7128 14.0188 14.7662L14.0081 14.7609Z" fill="#236294" />
												<path d="M16.3903 11.5929C15.2737 11.5929 14.3921 10.7007 14.3975 9.5788C14.4028 8.47288 15.2897 7.59136 16.3956 7.5967C17.5122 7.5967 18.3991 8.49425 18.3884 9.61085C18.3777 10.7168 17.4962 11.5983 16.3903 11.5929ZM17.587 9.60017C17.587 8.94303 17.0581 8.40343 16.4009 8.39809C15.7385 8.39809 15.1882 8.93769 15.1935 9.60017C15.1935 10.252 15.7438 10.7916 16.3903 10.7916C17.0421 10.7916 17.5817 10.252 17.587 9.60017Z" fill="#236294" />
											</svg>
										</button>
									</Tooltip>
								</div>
								<ToggleControl
									checked={attachment !== undefined}
									className="attachment-toggle-control"
									onChange={() => {
										if (attachment) {
											setAttributes({ attachment: undefined });
										} else {
											setAttributes({ attachment: { type: 'image', url: '' } });
										}
									}}
								/>
							</div>
							{!!attachment && (
								<div className="block-editor-default-attachment__panel">
									<div className="block-editor-default-attachment__type-row">
										<button
											type="button"
											className={
												(attachment?.type || 'image') === 'image'
													? 'block-editor-default-attachment__type-btn is-selected'
													: 'block-editor-default-attachment__type-btn'
											}
											onClick={() =>
												setAttributes({ attachment: { type: 'image', url: '' } })
											}
										>
											<AttachmentMediaImageIcon />
											<span>{__('Image', 'quillforms')}</span>
										</button>
										<button
											type="button"
											className={
												attachment?.type === 'video'
													? 'block-editor-default-attachment__type-btn is-selected'
													: 'block-editor-default-attachment__type-btn'
											}
											onClick={() =>
												setAttributes({ attachment: { type: 'video', url: '' } })
											}
										>
											<AttachmentMediaVideoIcon />
											<span>{__('Video', 'quillforms')}</span>
										</button>
									</div>
									{attachment?.type === 'video' ? (
										<div className="block-editor-default-attachment__video-field">
											<label className="block-editor-default-attachment__field-label screen-reader-text">
											{__('YouTube Video URL', 'quillforms')}
											</label>
											<TextControl
												value={attachment?.url || ''}
												onChange={(val) =>
													setAttributes({ attachment: { type: 'video', url: val } })
												}
												placeholder={__(
													'Paste YouTube video URL here',
													'quillforms'
												)}
											/>
										</div>
									) : (
										<div className="block-editor-default-attachment__image-zone">
											{attachment?.url ? (
												<div className="block-editor-default-attachment__image-preview">
													<div className="block-editor-default-attachment__image-preview-frame">
														<img src={attachment.url} alt="" />
														<button
															type="button"
															className="block-editor-default-attachment__remove-image"
															onClick={() =>
																setAttributes({
																	attachment: {
																		type: 'image',
																		url: '',
																	},
																})
															}
														>
															{__('Remove', 'quillforms')}
														</button>
													</div>
												</div>
											) : (
												<MediaUpload
													onSelect={(media) =>
														setAttributes({
															attachment: {
																type: 'image',
																url: media.url,
															},
														})
													}
													allowedTypes={['image']}
													render={({ open }) => (
														<button
															type="button"
															className="block-editor-default-attachment__dropzone"
															onClick={open}
															onDragOver={(e) => {
																e.preventDefault();
																e.stopPropagation();
															}}
															onDrop={(e) => {
																e.preventDefault();
																e.stopPropagation();
																const files = Array.from(
																	e.dataTransfer.files
																).filter((f) =>
																	f.type.startsWith('image/')
																);
																if (!files.length) {
																	return;
																}
																uploadMedia({
																	allowedTypes: ['image'],
																	filesList: files,
																	maxUploadFileSize,
																	wpAllowedMimeTypes:
																		wpAllowedMimeTypes ?? undefined,
																	onFileChange: (attachments) => {
																		const last =
																			attachments?.[
																				attachments.length - 1
																			];
																		if (last?.url) {
																			setAttributes({
																				attachment: {
																					type: 'image',
																					url: last.url,
																				},
																			});
																		}
																	},
																});
															}}
															onKeyDown={(e) => {
																if (e.key === 'Enter' || e.key === ' ') {
																	e.preventDefault();
																	open();
																}
															}}
														>
															<AttachmentUploadIcon />
															<span className="block-editor-default-attachment__dropzone-text">
																<span className="block-editor-default-attachment__dropzone-line1">
																	{__(
																		'Click to upload an image or',
																		'quillforms'
																	)}
																</span>
																<span className="block-editor-default-attachment__dropzone-line2">
																	{__('Drag & Drop', 'quillforms')}
																</span>
															</span>
														</button>
													)}
												/>
											)}
										</div>
									)}
								</div>
							)}
						</div>
					</BaseControl>
					{!!attachment && (
						<>
							<BaseControl>
								<ControlWrapper orientation="vertical">
									<ControlLabel label={__('Layout', 'quillforms')}></ControlLabel>
									<div className="block-editor-default-attachment__layout-slot">
										<BlockLayout
											layout={attributes?.layout}
											setAttributes={setAttributes}
										/>
									</div>
								</ControlWrapper>
							</BaseControl>

							{(attributes?.layout === 'split-left' ||
								attributes?.layout === 'split-right') &&
								attributes?.attachment?.url && (
									<BaseControl>
										<ControlWrapper orientation="vertical">
											<ControlLabel label={__('Focal Point Picker', 'quillforms')}></ControlLabel>
											<div
												className={css`
													max-width: 300px;
												` }
											>
												<FocalPointPicker
													url={attributes?.attachment?.url}
													value={
														attributes?.attachmentFocalPoint
													}
													onDragStart={(val) => {
														setAttributes({
															attachmentFocalPoint: val,
														});
													}}
													onDrag={(val) => {
														setAttributes({
															attachmentFocalPoint: val,
														});
													}}
													onChange={(val) => {
														setAttributes({
															attachmentFocalPoint: val,
														});
													}}
												/>
											</div>
										</ControlWrapper>
									</BaseControl>
								)}

							{(attributes?.layout === 'float-left' ||
								attributes?.layout === 'float-right' ||
								attributes?.layout === 'stack') &&
								attributes?.attachment?.url && (
									<>
										<BaseControl>
											<ControlWrapper orientation="horizontal">
												<ControlLabel label={__('Set Maximum Width for attachment', 'quillforms')} />
												<ToggleControl
													checked={
														attributes?.attachmentMaxWidth !==
														'none'
													}
													onChange={() => {
														if (
															attributes?.attachmentMaxWidth ===
															'none'
														) {
															setAttributes({
																attachmentMaxWidth:
																	'200px',
															});
														} else {
															setAttributes({
																attachmentMaxWidth:
																	'none',
															});
														}
													}}
												/>
											</ControlWrapper>
											<>
												{attributes.attachmentMaxWidth !==
													'none' && (
														<ControlWrapper orientation="vertical">
															<ControlLabel label={__('Maximum Width(px)', 'quillforms')} />
															<RangeControl
																color="#b2328c"
																trackColor="#b2328c"
																railColor="#e2e8f0"
																value={parseInt(
																	attributes?.attachmentMaxWidth?.replace(
																		'px',
																		''
																	) ?? '0'
																)}
																onChange={(value) =>
																	setAttributes({
																		attachmentMaxWidth:
																			value + 'px',
																	})
																}
																min={50}
																max={900}
															/>
														</ControlWrapper>
													)}
											</>
										</BaseControl>
										{attachment?.type !== 'video' && (
											<BaseControl>
												<ControlWrapper orientation="horizontal">
													<ControlLabel label={__('Use Fancy Border Radius', 'quillforms')} />
													<ToggleControl
														checked={
															attributes?.attachmentFancyBorderRadius
														}
														onChange={() => {
															if (
																attributes.attachmentFancyBorderRadius
															) {
																setAttributes({
																	attachmentBorderRadius:
																		'0px',
																});
															}
															setAttributes({
																attachmentFancyBorderRadius:
																	!attributes.attachmentFancyBorderRadius,
															});
														}}
													/>
												</ControlWrapper>
												{attributes.attachmentFancyBorderRadius && (
													<ControlWrapper orientation="vertical">
														<ControlLabel label={__('Choose your favorite fancy border radius', 'quillforms')} />
														<BorderRadiusTemplates
															onChange={(val) => {
																setAttributes({
																	attachmentBorderRadius:
																		val,
																});
															}}
															attachmentBorderRadius={
																attributes.attachmentBorderRadius
															}
														/>
													</ControlWrapper>
												)}
											</BaseControl>
										)}
									</>
								)}
						</>
					)}
				</>
			)}
			{alignSupport && (
				<BaseControl>
					<ControlWrapper orientation="vertical">
						<ControlLabel label={__('Align', 'quillforms')} isNew />
						<AlignControl
							value={attributes?.align ?? 'left'}
							onChange={(align) => {
								setAttributes({ align });
							}}
						/>
					</ControlWrapper>
				</BaseControl>
			)}

			{defaultValueSupport && (
				<BaseControl>
					<ControlWrapper orientation="vertical">
						<ControlLabel label={__('Default Value', 'quillforms')} />
						<div
							className={css`
								.combobox-control-rich-text-back {
									display: none;
								}
								padding-top: 10px !important;
							` }
						>
							<ComboboxControl
								value={{ type: 'text', value: defaultValue }}
								onChange={(val) => {
									setAttributes({
										defaultValue: val?.value == '0' ? '0' : val?.value ?? '',
									});
								}}
								hideChooseOption={true}
								customize={(value) => {
									let { sections, options } = value;

									sections = sections.filter((section) =>
										[
											'hidden_fields',
											'variables',
										].includes(section.key)
									);

									options = options.filter((option) => {
										if (option.type === 'field') {
											return false;
										} else if (
											[
												'variable',
												'hidden_field',
											].includes(option.type)
										) {
											return true;
										}
										return false;
									});
									if (!numericSupport) {
										sections.push({
											key: 'user',
											label: 'Logged In User',
										});
										options.push({
											type: 'user',
											value: 'username',
											label: 'User username',
											isMergeTag: true,
										});
										options.push({
											type: 'user',
											value: 'email',
											label: 'User email',
											isMergeTag: true,
										});
										options.push({
											type: 'user',
											value: 'display_name',
											label: 'User display name',
											isMergeTag: true,
										});
									}
									return { sections, options };
								}}
							/>
						</div>
					</ControlWrapper>
				</BaseControl>
			)}
			{isChild && parentBlock.attributes?.layout === 'stack' && (
				<BaseControl>
					<ControlWrapper orientation='vertical'>
						<ControlLabel label={__('Width', 'quillforms')} isNew />
						<WidthControl
							value={attributes?.width ?? '100%'}
							onChange={(width) => {
								setAttributes({ width });
							}}
						/>

					</ControlWrapper>
				</BaseControl>
			)}
			{placeholderSupport && (
				<BaseControl>
					<div className="block-editor-block-default-controls__placeholder-override">
						<ControlWrapper>
							<ControlLabel
								label={__('Override default placeholder', 'quillforms')}
							/>
							<ToggleControl
								checked={attributes?.placeholder !== false}
								onChange={() =>
									setAttributes({
										placeholder:
											attributes?.placeholder === false
												? ''
												: false,
									})
								}
							/>
						</ControlWrapper>
						{attributes?.placeholder !== false && (
							<TextControl
								value={attributes?.placeholder}
								onChange={(val) => {
									setAttributes({
										placeholder: val,
									});
								}}
							/>
						)}
					</div>
				</BaseControl>
			)}
			{!isChild && (
				<>
					<BaseControl>
						<ControlWrapper orientation="vertical">
							<ControlLabel label={__('Custom HTML', 'quillforms')} />
							<CustomHTML
								value={attributes?.customHTML}
								onChange={(val) => {
									setAttributes({ customHTML: val });
								}}
							/>
						</ControlWrapper>
					</BaseControl>
					{themeSupport && (
						<BlockThemeControl
							blockTheme={blockTheme}
							setAttributes={setAttributes}
						/>
					)}
				</>
			)}
			{(
				blockName === 'multiple-choice' ||
				blockName === 'dropdown' ||
				blockName === 'picture-choice'
			) && (
					<BaseControl>
						<ControlWrapper orientation="horizontal">
							<ControlLabel label={__('Randomize', 'quillforms')}></ControlLabel>
							<ToggleControl
								checked={attributes?.randomize ?? false}
								onChange={() => {
									setAttributes({
										randomize: !attributes?.randomize,
									});
								}}
							/>
						</ControlWrapper>
						<>
							{attributes?.randomize && (
								<div className={css`
						padding: 16px;
						line-height: 2em;
						background: #FAEADF;
						font-weight: 500;
						color: #CB5301;
						border-radius: 8px;
						border: 1px solid #CB5301;
					`}
								>
									{__('Please note that randomization doesn\'t work in the preview mode!', 'quillforms')}
								</div>
							)}
						</>
					</BaseControl>
				)
			}
		</div>
	);
};
export default DefaultControls;
