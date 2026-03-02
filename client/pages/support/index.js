/**
 * Quill Forms Dependencies
 */
import { Logo } from '@quillforms/admin-components';
import ConfigApi from '@quillforms/config';
import facebookIcon from '../../../assets/images/facebook.png';
import discordIcon from '../../../assets/images/discord.png';
import wordpress from '../../../assets/images/wordpress.png';
import quillformsLogo from '../../../assets/images/logos.png';

/**
 * Internal Dependencies
 */
import './style.scss';
import { __ } from '@wordpress/i18n';

const Support = () => {
	const isWPEnv = ConfigApi.isWPEnv();

	return (
		<div className="quillforms-support-page">
			<h1 className="quillforms-support-page__heading !text-2xl !text-[#001D4F] !font-bold">Support</h1>
			<div className=' bg-[#F7F8FA] min-h-[80vh] overflow-hidden rounded-[20px] border border-border-color py-6 px-5'>
				<h2 className=' text-4xl lg:text-[54px] font-semibold !text-[#001D4F] mb-4'>{__("We're here to", 'quillforms')} <span className='text-[#7962D7] font-extrabold'>{__("help, anytime", 'quillforms')}</span></h2>
				<p className='text-2xl lg:text-lg font-medium text-[#777] '>
					{__('Our support team is always ready to help you troubleshoot, answer questions, and guide you toward solutions.', 'quillforms')}
				</p>

				<div className="quillforms-support-page__via grid grid-cols-1 lg:grid-cols-3 gap-4">
					<div className="p-6 flex-col gap-2 items-center justify-center rounded-2xl bg-white border-t-4 border-[#7962D7] !shadow-[0_4px_40px_0_rgba(87,3,3,0.06)]">
						<a href="https://quillforms.com/forms/support-form/" target="_blank" className="flex flex-col gap-2 items-center justify-center">
							<div className="w-12 h-12 flex items-center justify-center mx-auto">
								<img src={quillformsLogo} alt="QuillForms" width={48} height={48} />
							</div>
							<div className="text-lg font-semibold leading-7 text-[#334155]">
								{__('QuillForms Website', 'quillforms')}
							</div>
						</a>
						<p className='text-base text-[#777] leading-[26px] text-center'>{__('Explore our official site for guides, FAQs, and step‑by‑step tutorials to help you build forms with confidence.', 'quillforms')}</p>
					</div>
					<div className="p-8 flex-col gap-2 items-center justify-center rounded-2xl bg-white border-t-4 border-[#7962D7] !shadow-[0_4px_40px_0_rgba(87,3,3,0.06)]">
						<a
							href="https://www.facebook.com/groups/quillforms"
							target="_blank"
							className="flex flex-col gap-2 items-center justify-center"
						>
							<div className="quillforms-support-page__facebook-icon">
								<img src={facebookIcon} alt="Facebook" width={48} height={48} />
							</div>
							<div className="text-lg font-semibold leading-7 text-[#334155]">
								{__('Facebook Group', 'quillforms')}
							</div>
						</a>
						<p className='text-base text-[#777] leading-[26px] text-center'>{__('Join our friendly community on Facebook, share your ideas, and get tips from other creators.', 'quillforms')}</p>
					</div>
					<div className="p-8 flex-col gap-2 items-center justify-center rounded-2xl bg-white border-t-4 border-[#7962D7] !shadow-[0_4px_40px_0_rgba(87,3,3,0.06)]">
						<a
							href="https://www.github.com/quillforms/quillforms"
							target="_blank"
							className="flex flex-col gap-2 items-center justify-center"
						>
							<div className="w-12 h-12 flex items-center justify-center mx-auto">
								{ /* The icon copied from ion icons */}
								<svg viewBox="0 0 512 512">
									<path d="M256 32C132.3 32 32 134.9 32 261.7c0 101.5 64.2 187.5 153.2 217.9a17.56 17.56 0 003.8.4c8.3 0 11.5-6.1 11.5-11.4 0-5.5-.2-19.9-.3-39.1a102.4 102.4 0 01-22.6 2.7c-43.1 0-52.9-33.5-52.9-33.5-10.2-26.5-24.9-33.6-24.9-33.6-19.5-13.7-.1-14.1 1.4-14.1h.1c22.5 2 34.3 23.8 34.3 23.8 11.2 19.6 26.2 25.1 39.6 25.1a63 63 0 0025.6-6c2-14.8 7.8-24.9 14.2-30.7-49.7-5.8-102-25.5-102-113.5 0-25.1 8.7-45.6 23-61.6-2.3-5.8-10-29.2 2.2-60.8a18.64 18.64 0 015-.5c8.1 0 26.4 3.1 56.6 24.1a208.21 208.21 0 01112.2 0c30.2-21 48.5-24.1 56.6-24.1a18.64 18.64 0 015 .5c12.2 31.6 4.5 55 2.2 60.8 14.3 16.1 23 36.6 23 61.6 0 88.2-52.4 107.6-102.3 113.3 8 7.1 15.2 21.1 15.2 42.5 0 30.7-.3 55.5-.3 63 0 5.4 3.1 11.5 11.4 11.5a19.35 19.35 0 004-.4C415.9 449.2 480 363.1 480 261.7 480 134.9 379.7 32 256 32z"></path>
								</svg>
							</div>
							<div className="text-lg font-semibold leading-7 text-[#334155]">
								{__('Github', 'quillforms')}
							</div>
						</a>
						<p className='text-base text-[#777] leading-[26px] text-center'>{__('Report issues, suggest improvements, or dive into the open‑source code if you’re a developer.', 'quillforms')}</p>
					</div>
					<div className="p-8 flex-col gap-2 items-center justify-center rounded-2xl bg-white border-t-4 border-[#7962D7] !shadow-[0_4px_40px_0_rgba(87,3,3,0.06)]">
						<a

							href="https://discord.gg/a5PDrzu8dE"
							target="_blank"
							className="flex flex-col gap-2 items-center justify-center"
						>
							<div className="w-12 h-12 flex items-center justify-center mx-auto">
								<img src={discordIcon} alt="Discord" width={48} height={48} />
							</div>
							<div className="text-lg font-semibold leading-7 text-[#334155]">
								{__('Discord', 'quillforms')}
							</div>
						</a>
						<p className='text-base text-[#777] leading-[26px] text-center'>{__('Chat with us in real time, ask quick questions, or connect with fellow users.', 'quillforms')}</p>
					</div>
					{isWPEnv && (
						<div className="p-8 flex-col gap-2 items-center justify-center rounded-2xl bg-white border-t-4 border-[#7962D7] !shadow-[0_4px_40px_0_rgba(87,3,3,0.06)]">
							<a
								href="https://wordpress.org/support/plugin/quillforms/"
								target="_blank"
								className="flex flex-col gap-2 items-center justify-center"
							>
								<div className="w-12 h-12 flex items-center justify-center mx-auto">
									<img src={wordpress} alt="Discord" width={48} height={48} />
								</div>
								<div className="text-lg font-semibold leading-7 text-[#334155]">
									{__('WordPress', 'quillforms')}
								</div>
							</a>
							<p className='text-base text-[#777] leading-[26px] text-center'>{__('Visit our WordPress page for plugin updates, reviews, and support tailored to WordPress users.', 'quillforms')}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Support;
