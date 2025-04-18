/**
 * Quill Forms Dependencies
 */
import { Logo } from '@quillforms/admin-components';
import ConfigApi from '@quillforms/config';

/**
 * Internal Dependencies
 */
import './style.scss';
import { __ } from '@wordpress/i18n';

const Support = () => {
	const isWPEnv = ConfigApi.isWPEnv();

	return (
		<div className="quillforms-support-page">
			<h1 className="quillforms-support-page__heading">Support</h1>
			<p>
				{__('Need help? We are here for you. You can reach us via the following ways:', 'quillforms')}
			</p>

			<div className="quillforms-support-page__via">
				<div className="quillforms-support-page__via-provider quillforms-support-page__via-website">
					<a href="https://quillforms.com/forms/support-form/" target="_blank">
						<div className="quillforms-support-page__website-icon">
							<Logo />
						</div>
						<div className="quillforms-support-page__website-title">
							{__('Website', 'quillforms')}
						</div>
					</a>

				</div>
				<div className="quillforms-support-page__via-provider quillforms-support-page__via-facebook">
					<a
						href="https://www.facebook.com/groups/quillforms"
						target="_blank"
					>
						<div className="quillforms-support-page__facebook-icon">
							{ /* The icon copied from Fontawesome icons */}
							<svg fill="currentColor" height="32" width="32" viewBox="0 0 1024 1792"><path d="M959 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z"></path></svg>
						</div>
						<div className="quillforms-support-page__facebook-title">
							{__('Facebook Group', 'quillforms')}
						</div>
					</a>
				</div>
				<div className="quillforms-support-page__via-provider quillforms-support-page__via-github">
					<a
						href="https://www.github.com/quillforms/quillforms"
						target="_blank"
					>
						<div className="quillforms-support-page__github-icon">
							{ /* The icon copied from ion icons */}
							<svg viewBox="0 0 512 512">
								<path d="M256 32C132.3 32 32 134.9 32 261.7c0 101.5 64.2 187.5 153.2 217.9a17.56 17.56 0 003.8.4c8.3 0 11.5-6.1 11.5-11.4 0-5.5-.2-19.9-.3-39.1a102.4 102.4 0 01-22.6 2.7c-43.1 0-52.9-33.5-52.9-33.5-10.2-26.5-24.9-33.6-24.9-33.6-19.5-13.7-.1-14.1 1.4-14.1h.1c22.5 2 34.3 23.8 34.3 23.8 11.2 19.6 26.2 25.1 39.6 25.1a63 63 0 0025.6-6c2-14.8 7.8-24.9 14.2-30.7-49.7-5.8-102-25.5-102-113.5 0-25.1 8.7-45.6 23-61.6-2.3-5.8-10-29.2 2.2-60.8a18.64 18.64 0 015-.5c8.1 0 26.4 3.1 56.6 24.1a208.21 208.21 0 01112.2 0c30.2-21 48.5-24.1 56.6-24.1a18.64 18.64 0 015 .5c12.2 31.6 4.5 55 2.2 60.8 14.3 16.1 23 36.6 23 61.6 0 88.2-52.4 107.6-102.3 113.3 8 7.1 15.2 21.1 15.2 42.5 0 30.7-.3 55.5-.3 63 0 5.4 3.1 11.5 11.4 11.5a19.35 19.35 0 004-.4C415.9 449.2 480 363.1 480 261.7 480 134.9 379.7 32 256 32z"></path>
							</svg>
						</div>
						<div className="quillforms-support-page__github-title">
							{__('Github', 'quillforms')}
						</div>
					</a>
				</div>
				<div className="quillforms-support-page__via-provider quillforms-support-page__via-discord">
					<a

						href="https://discord.gg/a5PDrzu8dE"
						target="_blank"
					>
						<div className="quillforms-support-page__discord-icon">
							{ /* The icon copied from Fontawesome icons */}
							<svg fill="currentColor" height="32" width="32" viewBox="0 0 448 512"><path d="M224 0C100.3 0 0 102.2 0 226.7c0 50.5 20.6 96.2 53.8 133.7-3.3 8.7-5 17.9-5 27.3 0 26.5 21.5 48 48 48 8.7 0 16.6-2.3 23.7-6.2 13.3 11.3 29.9 20.2 48.5 26.3-7.3 13.3-11.5 28.6-11.5 44.7 0 53 43.1 96 96 96 53 0 96-43 96-96 0-16.1-4.2-31.4-11.5-44.7 18.6-6.1 35.2-15 48.5-26.3 7.1 3.9 15 6.2 23.7 6.2 26.5 0 48-21.5 48-48 0-9.4-1.7-18.6-5-27.3 33.2-37.5 53.8-83.2 53.8-133.7C448 102.2 347.7 0 224 0zm-96 352c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm96-96c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm96 96c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48
							 48z"></path></svg>
						</div>
						<div className="quillforms-support-page__discord-title">
							{__('Discord', 'quillforms')}
						</div>
					</a>
				</div>
				{isWPEnv && (
					<div className="quillforms-support-page__via-provider quillforms-support-page__via-wordpress">
						<a
							href="https://wordpress.org/support/plugin/quillforms/"
							target="_blank"
						>
							<div className="quillforms-support-page__wordpress-icon">
								{ /* The icon copied from ion icons */}
								<svg viewBox="0 0 512 512">
									<path d="M259 271.3L226.2 367h-.1l-25.4 73.1c1.8.5 3.5.9 5.3 1.4h.3a192.51 192.51 0 0049.5 6.5 157 157 0 0024.9-1.8 184.3 184.3 0 0032.5-7.1c2.6-.8 5.2-1.7 7.8-2.6-2.8-6-8.8-19.3-9.1-19.9zM80.8 180.5C70.8 203.1 64 230.9 64 256c0 6.3.3 12.6.9 18.8 6.9 71.2 52.9 131 116.1 157.9 2.6 1.1 5.3 2.2 8 3.2L96 180.6c-8-.3-9.5.2-15.2-.1z"></path>
									<path d="M430.2 175.4a188 188 0 00-15.1-26.6c-1.6-2.4-3.4-4.8-5.1-7.2A193 193 0 00325.1 77a189.2 189.2 0 00-69.2-13 191.51 191.51 0 00-149.4 71.7A196 196 0 0089 161.3c14.2.1 31.8.1 33.8.1 18.1 0 46-2.2 46-2.2 9.4-.6 10.4 13.1 1.1 14.2 0 0-9.4 1.1-19.8 1.6L213 362l37.8-113.3-26.8-73.6c-9.4-.5-18.1-1.6-18.1-1.6-9.4-.5-8.2-14.8 1-14.2 0 0 28.5 2.2 45.5 2.2 18.1 0 46-2.2 46-2.2 9.3-.6 10.5 13.1 1.1 14.2 0 0-9.3 1.1-19.7 1.6l62.3 185.6 17.3-57.6c8.7-22.4 13.1-40.9 13.1-55.7 0-21.3-7.7-36.1-14.3-47.6-8.7-14.3-16.9-26.3-16.9-40.4 0-15.9 12-30.7 29-30.7h2.2c26.2-.7 34.8 25.3 35.9 43v.6c.4 7.2.1 12.5.1 18.8 0 17.4-3.3 37.1-13.1 61.8l-39 112.8-22.3 65.7c1.8-.8 3.5-1.6 5.3-2.5 56.7-27.4 98-82 106.7-146.7a172.07 172.07 0 001.9-26 191.11 191.11 0 00-17.8-80.8z"></path>
									<path d="M256 48a208.06 208.06 0 0181 399.66A208.06 208.06 0 01175 64.34 206.7 206.7 0 01256 48m0-16C132.29 32 32 132.29 32 256s100.29 224 224 224 224-100.29 224-224S379.71 32 256 32z"></path>
								</svg>
							</div>
							<div className="quillforms-support-page__wordpress-title">
								{__('WordPress', 'quillforms')}
							</div>
						</a>
					</div>
				)}
			</div>
		</div>
	);
};

export default Support;
