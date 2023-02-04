<?php
/**
 * Class: Store
 *
 * @since 1.6.0
 * @package QuillForms
 */

namespace QuillForms\Site;

use Automatic_Upgrader_Skin;
use Plugin_Upgrader;
use Throwable;

/**
 * Store Class
 *
 * @since 1.6.0
 */
class Store {

	/**
	 * Addons
	 *
	 * @var array
	 */
	private $addons;

	/**
	 * Class instance
	 *
	 * @var self instance
	 */
	private static $instance = null;

	/**
	 * Get class instance
	 *
	 * @return self
	 */
	public static function instance() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor
	 *
	 * @since 1.6.0
	 */
	private function __construct() {
		$this->define_addons();

		add_action( 'wp_ajax_quillforms_addon_install', array( $this, 'ajax_install' ) );
		add_action( 'wp_ajax_quillforms_addon_activate', array( $this, 'ajax_activate' ) );
		add_action( 'wp_ajax_quillforms_addon_ensure_activation', array( $this, 'ajax_ensure_activation' ) );
	}

	/**
	 * Get all addons
	 *
	 * @param boolean $include_plugin_file Whether to include plugin_file & full_plugin_file or not.
	 * @return array
	 */
	public function get_all_addons( $include_plugin_file = false ) {
		if ( $include_plugin_file ) {
			$exclude = array();
		} else {
			$exclude = array( 'plugin_file', 'full_plugin_file' );
		}
		return array_map(
			function( $addon ) use ( $exclude ) {
				return array_filter(
					$addon,
					function( $addon_property ) use ( $exclude ) {
						return ! in_array( $addon_property, $exclude, true );
					},
					ARRAY_FILTER_USE_KEY
				);
			},
			$this->addons
		);
	}

	/**
	 * Get addon
	 *
	 * @since 1.6.0
	 *
	 * @param string $slug Addon slug.
	 * @return array|null
	 */
	public function get_addon( $slug ) {
		return $this->addons[ $slug ] ?? null;
	}

	/**
	 * Install addon
	 *
	 * @param string $addon_slug Addon slug.
	 * @return array
	 */
	public function install( $addon_slug ) {
		// check addon.
		if ( ! isset( $this->addons[ $addon_slug ] ) ) {
			return array(
				'success' => false,
				'message' => esc_html__( 'Cannot find addon', 'quillforms' ),
			);
		}

		// check if already installed.
		if ( $this->addons[ $addon_slug ]['is_installed'] ) {
			return array(
				'success' => false,
				'message' => esc_html__( 'Addon is already installed', 'quillforms' ),
			);
		}

		// check current license.
		$license = get_option( 'quillforms_license' );
		if ( ! $license ) {
			return array(
				'success' => false,
				'message' => esc_html__( 'No license found', 'quillforms' ),
			);
		}
		if ( ! License::instance()->is_plan_accessible( $license['plan'], $this->addons[ $addon_slug ]['plan'] ) ) {
			return array(
				'success' => false,
				'message' => esc_html__( 'Please upgrade your plan to install this addon', 'quillforms' ),
			);
		}

		// get plugin data from the api.
		$plugin_data = Site::instance()->api_request(
			array(
				'edd_action' => 'get_version',
				'license'    => $license['key'],
				'item_id'    => "{$addon_slug}_addon",
				'versions'   => Site::instance()->get_api_versions_param(),
			)
		);

		// check download link.
		$download_link = $plugin_data['data']['download_link'] ?? null;
		if ( empty( $download_link ) ) {
			quillforms_get_logger()->debug(
				esc_html__( 'Cannot get addon info', 'quillforms' ),
				array(
					'code'       => 'cannot_get_addon_info',
					'addon_slug' => $addon_slug,
					'response'   => $plugin_data,
				)
			);
			return array(
				'success' => false,
				'message' => esc_html__( 'Cannot get addon info, please check your license', 'quillforms' ),
			);
		}

		// check version.
		if ( empty( $plugin_data['data']['new_version'] ) ) {
			return array(
				'success' => false,
				'message' => esc_html__( 'Please check addon requirements at quillforms.com.', 'quillforms' ),
			);
		}

		// init plugin upgrader.
		require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
		$installer_skin = new Automatic_Upgrader_Skin();
		$installer      = new Plugin_Upgrader( $installer_skin );

		// check file system permissions.
		$filesystem_access = $installer_skin->request_filesystem_credentials();
		if ( ! $filesystem_access ) {
			return array(
				'success' => false,
				'message' => esc_html__( 'Cannot install addon automatically, please download it and install it manually', 'quillforms' ),
			);
		}

		// install the addon plugin.
		$installer->install( $download_link );

		// check wp_error.
		if ( is_wp_error( $installer_skin->result ) ) {
			quillforms_get_logger()->error(
				esc_html__( 'Cannot install addon plugin', 'quillforms' ),
				array(
					'code'       => 'cannot_install_addon_plugin',
					'addon_slug' => $addon_slug,
					'error'      => array(
						'code'    => $installer_skin->result->get_error_code(),
						'message' => $installer_skin->result->get_error_message(),
						'data'    => $installer_skin->result->get_error_data(),
					),
				)
			);
			return array(
				'success' => false,
				'message' => esc_html__( 'Cannot install addon plugin, check log for details', 'quillforms' ),
			);
		}

		// check failed installation.
		if ( ! $installer_skin->result || ! $installer->plugin_info() ) {
			quillforms_get_logger()->error(
				esc_html__( 'Cannot install addon plugin', 'quillforms' ),
				array(
					'code'             => 'cannot_install_addon_plugin',
					'addon_slug'       => $addon_slug,
					'upgrade_messages' => $installer_skin->get_upgrade_messages(),
				)
			);
			return array(
				'success' => false,
				'message' => esc_html__( 'Cannot install addon plugin, check log for details', 'quillforms' ),
			);
		}

		// check the installed plugin.
		if ( $installer->plugin_info() !== $this->addons[ $addon_slug ]['plugin_file'] ) {
			if ( ! function_exists( 'delete_plugins' ) ) {
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
			}
			$removed = delete_plugins( array( $installer->plugin_info() ) );
			quillforms_get_logger()->critical(
				esc_html__( 'Invalid addon installation detected', 'quillforms' ),
				array(
					'code'                  => 'invalid_addon_installation',
					'addon_slug'            => $addon_slug,
					'plugin_file'           => $this->addons[ $addon_slug ]['plugin_file'],
					'installer_plugin_info' => $installer->plugin_info(),
					'removed'               => $removed,
					'upgrade_messages'      => $installer_skin->get_upgrade_messages(),
				)
			);
			return array(
				'success' => false,
				'message' => esc_html__( 'Cannot install addon plugin, check log for details', 'quillforms' ),
			);
		}

		// log successful installation.
		quillforms_get_logger()->info(
			esc_html__( 'Addon plugin installed successfully', 'quillforms' ),
			array(
				'code'             => 'addon_installed_successfully',
				'addon_slug'       => $addon_slug,
				'upgrade_messages' => $installer_skin->get_upgrade_messages(),
			)
		);
		return array(
			'success' => true,
			'message' => esc_html__( 'Addon plugin installed successfully', 'quillforms' ),
		);
	}

	/**
	 * Activate addon
	 *
	 * @param string $addon_slug Addon slug.
	 * @param string $redirect Redirect url. see activate_plugin().
	 * @return array
	 */
	public function activate( $addon_slug, $redirect = '' ) {
		// check addon.
		if ( ! isset( $this->addons[ $addon_slug ] ) ) {
			return array(
				'success' => false,
				'message' => esc_html__( 'Cannot find addon', 'quillforms' ),
			);
		}

		// check if not installed.
		if ( ! $this->addons[ $addon_slug ]['is_installed'] ) {
			return array(
				'success' => false,
				'message' => esc_html__( "Addon isn't installed", 'quillforms' ),
			);
		}

		// check if already active.
		if ( $this->addons[ $addon_slug ]['is_active'] ) {
			return array(
				'success' => false,
				'message' => esc_html__( 'Addon is already active', 'quillforms' ),
			);
		}

		$plugin_file = $this->addons[ $addon_slug ]['plugin_file'];

		if ( ! function_exists( 'activate_plugin' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		// try to activate.
		try {
			$result = activate_plugin( $plugin_file, $redirect );
			if ( is_wp_error( $result ) ) {
				quillforms_get_logger()->error(
					esc_html__( 'Unexpected output on activating the addon plugin', 'quillforms' ),
					array(
						'code'  => 'addon_activation_unexpected_output',
						'error' => array(
							'code'    => $result->get_error_code(),
							'message' => $result->get_error_message(),
							'data'    => $result->get_error_data(),
						),
					)
				);
			}
		} catch ( Throwable $e ) {
			quillforms_get_logger()->error(
				esc_html__( 'Fatal error on activating the addon plugin', 'quillforms' ),
				array(
					'code'      => 'addon_activation_fatal_error',
					'exception' => array(
						'code'    => $e->getCode(),
						'message' => $e->getMessage(),
						'trace'   => $e->getTraceAsString(),
					),
				)
			);
		}

		return array(
			'success' => is_plugin_active( $plugin_file ),
			'error'   => is_wp_error( $result ) ? $result : ( $e ?? null ),
		);
	}

	/**
	 * Ajax handler for installing addon
	 *
	 * @return void
	 */
	public function ajax_install() {
		$this->check_authorization();

		// posted addon slug.
		$addon_slug = trim( $_POST['addon'] ?? '' );
		if ( empty( $addon_slug ) ) {
			wp_send_json_error( esc_html__( 'Addon slug is required', 'quillforms' ), 400 );
			exit;
		}

		$result = $this->install( $addon_slug );
		if ( $result['success'] ) {
			wp_send_json_success( esc_html__( 'Addon plugin installed successfully', 'quillforms' ), 200 );
		} else {
			wp_send_json_error( $result['message'] ?? esc_html__( 'Cannot install the addon plugin, please check the log for details', 'quillforms' ), 422 );
		}
		exit;
	}

	/**
	 * Ajax handler for activating addon
	 *
	 * @return void
	 */
	public function ajax_activate() {
		$this->check_authorization();

		// posted addon slug.
		$addon_slug = trim( $_POST['addon'] ?? '' );
		if ( empty( $addon_slug ) ) {
			wp_send_json_error( esc_html__( 'Addon slug is required', 'quillforms' ), 400 );
			exit;
		}

		$redirect_url = add_query_arg(
			array(
				'action' => 'quillforms_addon_ensure_activation',
				'addon'  => $addon_slug,
			),
			admin_url( 'admin-ajax.php' )
		);

		$result = $this->activate( $addon_slug, $redirect_url );
		if ( $result['success'] ) {
			wp_redirect( add_query_arg( array( 'success' => true ), $redirect_url ) );
		} else {
			wp_send_json_error( $result['message'] ?? esc_html__( 'Cannot activate the addon plugin, please check the log for details', 'quillforms' ), 500 );
		}
		exit;
	}

	/**
	 * Ajax handler for ensuring addon activation
	 * This action shouldn't be called directly. it is used on redirection at activate action.
	 *
	 * @since 1.7.1
	 *
	 * @return void
	 */
	public function ajax_ensure_activation() {
		if ( empty( $_GET['success'] ) ) {
			wp_send_json_error( esc_html__( 'Fatal error occurred on activating the addon plugin', 'quillforms' ), 500 );
			exit;
		}

		$plugin_file = $this->addons[ $_GET['addon'] ]['plugin_file'];
		if ( is_plugin_active( $plugin_file ) ) {
			wp_send_json_success( esc_html__( 'Addon plugin activated successfully', 'quillforms' ), 200 );
		} else {
			wp_send_json_error( esc_html__( 'Cannot activate the addon plugin, please check the log for details', 'quillforms' ), 500 );
		}
		exit;
	}

	/**
	 * Initialize addons
	 *
	 * @return void
	 */
	private function define_addons() {
		$addons = array(
			'entries'                   => array(
				'name'           => esc_html__( 'Entries', 'quillforms' ),
				'description'    => esc_html__( 'Entries addon makes it easy for you to view all your leads in one place to streamline your workflow. With it, you can store, view, manage and export your form submissions.', 'quillforms' ),
				'plugin_file'    => 'quillforms-entries/quillforms-entries.php',
				'min_version'    => '1.2.0',
				'plan'           => 'basic',
				'is_integration' => false,
				'assets'         => array(
					'icon'   => QUILLFORMS_PLUGIN_URL . 'assets/addons/entries/icon.svg',
					'banner' => QUILLFORMS_PLUGIN_URL . 'assets/addons/entries/banner.png',
				),
			),
			'logic'                     => array(
				'name'           => esc_html__( 'Logic', 'quillforms' ),
				'description'    => esc_html__( 'Jump logic and calculator. With jump logic, respondents can jump to different questions based on their answers. With calculator, you can add advanced calculations to your form.', 'quillforms' ),
				'plugin_file'    => 'quillforms-logic/quillforms-logic.php',
				'min_version'    => '1.5.0',
				'plan'           => 'basic',
				'is_integration' => false,
				'assets'         => array(
					'icon'   => QUILLFORMS_PLUGIN_URL . 'assets/addons/logic/icon.svg',
					'banner' => QUILLFORMS_PLUGIN_URL . 'assets/addons/logic/banner.png',
				),
			),
			'hiddenfields'              => array(
				'name'           => esc_html__( 'Hidden Fields', 'quillforms' ),
				'description'    => esc_html__( 'Hidden fields are custom url parameters you can set up in your form to access the query string in the url and also it can track the UTM parameters that are useful for your campaigns tracking.', 'quillforms' ),
				'plugin_file'    => 'quillforms-hiddenfields/quillforms-hiddenfields.php',
				'plan'           => 'basic',
				'is_integration' => false,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/hiddenfields/icon.svg',
				),
			),
			'formlocker'                => array(
				'name'           => esc_html__( 'Form Locker', 'quillforms' ),
				'description'    => esc_html__( 'Form Locker enables you to lock your forms with password, restrict access to logged in users or specific user roles, form accessability between start date and end date and restriction on the submission with the same email, phone, user id or with entries limit', 'quillforms' ),
				'plugin_file'    => 'quillforms-formlocker/quillforms-formlocker.php',
				'plan'           => 'plus',
				'is_integration' => false,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/formlocker/icon.svg',
				),
			),
			'ratingblock'               => array(
				'name'           => esc_html__( 'Rating Block', 'quillforms' ),
				'description'    => esc_html__( 'Add rating question type to your form. You can use stars, hearts, thumbs, thunderbolts, trophies, circles, ...etc in this rating question', 'quillforms' ),
				'plugin_file'    => 'quillforms-ratingblock/quillforms-ratingblock.php',
				'plan'           => 'basic',
				'is_integration' => false,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/ratingblock/icon.svg',
				),
			),
			'recaptcha'                 => array(
				'name'           => esc_html__( 'reCAPTCHA', 'quillforms' ),
				'description'    => esc_html__( 'Google reCAPTCHA protects your website from fraud and abuse.', 'quillforms' ),
				'plugin_file'    => 'quillforms-recaptcha/quillforms-recaptcha.php',
				'plan'           => 'basic',
				'is_integration' => false,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/recaptcha/icon.svg',
				),
			),
			'calendlyblock'             => array(
				'name'           => esc_html__( 'Calendly Block', 'quillforms' ),
				'description'    => esc_html__( 'Calendly Block allows your customers to schedule appointments with calendly.', 'quillforms' ),
				'plugin_file'    => 'quillforms-calendlyblock/quillforms-calendlyblock.php',
				'plan'           => 'basic',
				'is_integration' => false,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/calendlyblock/icon.svg',
				),
			),
			'fileblock'                 => array(
				'name'           => esc_html__( 'File Block', 'quillforms' ),
				'description'    => esc_html__( 'Enable users to upload files with different extensions. You can also allow people to upload multiple files and control the allowed extensions.', 'quillforms' ),
				'plugin_file'    => 'quillforms-fileblock/quillforms-fileblock.php',
				'plan'           => 'basic',
				'is_integration' => false,
				'assets'         => array(
					'icon'   => QUILLFORMS_PLUGIN_URL . 'assets/addons/fileblock/icon.svg',
					'banner' => QUILLFORMS_PLUGIN_URL . 'assets/addons/fileblock/banner.png',
				),
			),
			'phoneblock'                => array(
				'name'           => esc_html__( 'Phone Block', 'quillforms' ),
				'description'    => esc_html__( 'Add phone question type to your form with international format.', 'quillforms' ),
				'plugin_file'    => 'quillforms-phoneblock/quillforms-phoneblock.php',
				'plan'           => 'basic',
				'is_integration' => false,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/phoneblock/icon.svg',
				),
			),
			'opinionscaleblock'         => array(
				'name'           => esc_html__( 'Opinion Scale Block', 'quillforms' ),
				'description'    => esc_html__( 'An Opinion Scale lets people select an opinion on the scale you provide them. Easy to understand and quick to use, it is a nice way to collect opinions.', 'quillforms' ),
				'plugin_file'    => 'quillforms-opinionscaleblock/quillforms-opinionscaleblock.php',
				'plan'           => 'basic',
				'is_integration' => false,
				'assets'         => array(
					'icon'   => QUILLFORMS_PLUGIN_URL . 'assets/addons/opinionscaleblock/icon.svg',
					'banner' => QUILLFORMS_PLUGIN_URL . 'assets/addons/opinionscaleblock/banner.png',
				),
			),
			'picturechoiceblock'        => array(
				'name'           => esc_html__( 'Picture Choice Block', 'quillforms' ),
				'description'    => esc_html__( 'Make your survey more interesting with the use of suitable images to select as answers. It is a type of multiple choice question type, only with images instead of text.', 'quillforms' ),
				'plugin_file'    => 'quillforms-picturechoiceblock/quillforms-picturechoiceblock.php',
				'plan'           => 'basic',
				'is_integration' => false,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/picturechoiceblock/icon.svg',
				),
			),
			// 'qrscannerblock'            => array(
			// 'name'           => esc_html__( 'QR Scanner Block', 'quillforms' ),
			// 'description'    => esc_html__( 'Allows your users to scan QR codes on your forms.', 'quillforms' ),
			// 'plugin_file'    => 'quillforms-qrscannerblock/quillforms-qrscannerblock.php',
			// 'plan'           => 'plus',
			// 'is_integration' => false,
			// 'assets'         => array(
			// 'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/qrscannerblock/icon.svg',
			// ),
			// ),
			'signatureblock'            => array(
				'name'           => esc_html__( 'Signature Block', 'quillforms' ),
				'description'    => esc_html__( 'Collect signature directly from your users on your forms.', 'quillforms' ),
				'plugin_file'    => 'quillforms-signatureblock/quillforms-signatureblock.php',
				'plan'           => 'plus',
				'is_integration' => false,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/signatureblock/icon.svg',
				),
			),

			'customthankyouscreenblock' => array(
				'name'           => esc_html__( 'Custom Thank You Screen', 'quillforms' ),
				'description'    => esc_html__( 'Custom thank you screen with advanced features like attachment and buttons to reload the form or redirect to external link. Works great with jump logic.', 'quillforms' ),
				'plugin_file'    => 'quillforms-customthankyouscreenblock/quillforms-customthankyouscreenblock.php',
				'plan'           => 'basic',
				'is_integration' => false,
				'assets'         => array(
					'icon'   => QUILLFORMS_PLUGIN_URL . 'assets/addons/customthankyouscreenblock/icon.svg',
					'banner' => QUILLFORMS_PLUGIN_URL . 'assets/addons/customthankyouscreenblock/banner.png',
				),
			),
			'stripe'                    => array(
				'name'               => esc_html__( 'Stripe', 'quillforms' ),
				'description'        => esc_html__( 'Accept payments through stripe gateway.', 'quillforms' ),
				'plugin_file'        => 'quillforms-stripe/quillforms-stripe.php',
				'plan'               => 'plus',
				'is_payment_gateway' => true,
				'assets'             => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/stripe/icon.png',
				),
			),
			'paypal'                    => array(
				'name'               => esc_html__( 'PayPal', 'quillforms' ),
				'description'        => esc_html__( 'Accept payments through paypal gateway.', 'quillforms' ),
				'plugin_file'        => 'quillforms-paypal/quillforms-paypal.php',
				'plan'               => 'plus',
				'is_payment_gateway' => true,
				'assets'             => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/paypal/icon.png',
				),
			),
			'googleanalytics'           => array(
				'name'           => esc_html__( 'Google Analytics', 'quillforms' ),
				'description'    => esc_html__( 'Track your users activity and behavior by google analytics.', 'quillforms' ),
				'plugin_file'    => 'quillforms-googleanalytics/quillforms-googleanalytics.php',
				'plan'           => 'basic',
				'is_integration' => false,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/googleanalytics/icon.svg',
				),
			),
			'facebookpixel'             => array(
				'name'           => esc_html__( 'Facebook Pixel', 'quillforms' ),
				'description'    => esc_html__( 'Track your users activity and behavior by facebook pixel.', 'quillforms' ),
				'plugin_file'    => 'quillforms-facebookpixel/quillforms-facebookpixel.php',
				'plan'           => 'basic',
				'is_integration' => false,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/facebookpixel/icon.svg',
				),
			),
			'activecampaign'            => array(
				'name'           => esc_html__( 'ActiveCampaign', 'quillforms' ),
				'description'    => esc_html__( 'Send new contacts to your ActiveCampaign account.', 'quillforms' ),
				'plugin_file'    => 'quillforms-activecampaign/quillforms-activecampaign.php',
				'min_version'    => '1.1.0',
				'plan'           => 'basic',
				'is_integration' => true,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/activecampaign/icon.svg',
				),
			),
			'aweber'                    => array(
				'name'           => esc_html__( 'AWeber', 'quillforms' ),
				'description'    => esc_html__( 'Send new contacts to your AWeber account.', 'quillforms' ),
				'plugin_file'    => 'quillforms-aweber/quillforms-aweber.php',
				'plan'           => 'basic',
				'is_integration' => true,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/aweber/icon.svg',
				),
			),
			'constantcontact'           => array(
				'name'           => esc_html__( 'Constant Contact', 'quillforms' ),
				'description'    => esc_html__( 'Send new contacts to your Constant Contact lists.', 'quillforms' ),
				'plugin_file'    => 'quillforms-constantcontact/quillforms-constantcontact.php',
				'min_version'    => '1.1.0',
				'plan'           => 'basic',
				'is_integration' => true,
				'assets'         => array(
					'icon'   => QUILLFORMS_PLUGIN_URL . 'assets/addons/constantcontact/icon.svg',
					'banner' => QUILLFORMS_PLUGIN_URL . 'assets/addons/constantcontact/banner.png',
				),
			),
			'mailchimp'                 => array(
				'name'           => esc_html__( 'MailChimp', 'quillforms' ),
				'description'    => esc_html__( 'Send new contacts to your MailChimp lists.', 'quillforms' ),
				'plugin_file'    => 'quillforms-mailchimp/quillforms-mailchimp.php',
				'min_version'    => '1.1.0',
				'plan'           => 'basic',
				'is_integration' => true,
				'assets'         => array(
					'icon'   => QUILLFORMS_PLUGIN_URL . 'assets/addons/mailchimp/icon.svg',
					'banner' => QUILLFORMS_PLUGIN_URL . 'assets/addons/mailchimp/banner.png',
				),
			),
			'mailerlite'                => array(
				'name'           => esc_html__( 'MailerLite', 'quillforms' ),
				'description'    => esc_html__( 'Send new contacts to your MailerLite account.', 'quillforms' ),
				'plugin_file'    => 'quillforms-mailerlite/quillforms-mailerlite.php',
				'plan'           => 'basic',
				'is_integration' => true,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/mailerlite/icon.png',
				),
			),
			'mailpoet'                  => array(
				'name'           => esc_html__( 'MailPoet', 'quillforms' ),
				'description'    => esc_html__( 'Send new contacts to your MailPoet lists.', 'quillforms' ),
				'plugin_file'    => 'quillforms-mailpoet/quillforms-mailpoet.php',
				'plan'           => 'basic',
				'is_integration' => true,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/mailpoet/icon.png',
				),
			),
			'mondaycom'                 => array(
				'name'           => esc_html__( 'monday.com', 'quillforms' ),
				'description'    => esc_html__( 'Send new items to your monday.com boards.', 'quillforms' ),
				'plugin_file'    => 'quillforms-mondaycom/quillforms-mondaycom.php',
				'plan'           => 'basic',
				'is_integration' => true,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/mondaycom/icon.png',
				),
			),
			'notion'                    => array(
				'name'           => esc_html__( 'Notion', 'quillforms' ),
				'description'    => esc_html__( 'Send new entry data to your Notion databases.', 'quillforms' ),
				'plugin_file'    => 'quillforms-notion/quillforms-notion.php',
				'plan'           => 'basic',
				'is_integration' => true,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/notion/icon.png',
				),
			),
			'pipedrive'                 => array(
				'name'           => esc_html__( 'Pipedrive', 'quillforms' ),
				'description'    => esc_html__( 'Create Pipedrive leads on form submission.', 'quillforms' ),
				'plugin_file'    => 'quillforms-pipedrive/quillforms-pipedrive.php',
				'plan'           => 'basic',
				'is_integration' => true,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/pipedrive/icon.svg',
				),
			),
			'getresponse'               => array(
				'name'           => esc_html__( 'GetResponse', 'quillforms' ),
				'description'    => esc_html__( 'Send new contacts to your GetResponse lists.', 'quillforms' ),
				'plugin_file'    => 'quillforms-getresponse/quillforms-getresponse.php',
				'min_version'    => '1.1.0',
				'plan'           => 'basic',
				'is_integration' => true,
				'assets'         => array(
					'icon'   => QUILLFORMS_PLUGIN_URL . 'assets/addons/getresponse/icon.svg',
					'banner' => QUILLFORMS_PLUGIN_URL . 'assets/addons/getresponse/banner.png',
				),
			),
			'googlesheets'              => array(
				'name'           => esc_html__( 'Google Sheets', 'quillforms' ),
				'description'    => esc_html__( 'Send your submission to Google Sheets. Syncs automatically when a new form is submitted!', 'quillforms' ),
				'plugin_file'    => 'quillforms-googlesheets/quillforms-googlesheets.php',
				'min_version'    => '1.2.0',
				'plan'           => 'basic',
				'is_integration' => true,
				'assets'         => array(
					'icon'   => QUILLFORMS_PLUGIN_URL . 'assets/addons/googlesheets/icon.svg',
					'banner' => QUILLFORMS_PLUGIN_URL . 'assets/addons/googlesheets/banner.png',
				),
			),
			'hubspot'                   => array(
				'name'           => esc_html__( 'HubSpot', 'quillforms' ),
				'description'    => esc_html__( 'Send new contacts to your HubSpot account.', 'quillforms' ),
				'plugin_file'    => 'quillforms-hubspot/quillforms-hubspot.php',
				'min_version'    => '1.1.0',
				'plan'           => 'basic',
				'is_integration' => true,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/hubspot/icon.svg',
				),
			),
			'klaviyo'                   => array(
				'name'           => esc_html__( 'Klaviyo', 'quillforms' ),
				'description'    => esc_html__( 'Send new profiles to your Klaviyo account.', 'quillforms' ),
				'plugin_file'    => 'quillforms-klaviyo/quillforms-klaviyo.php',
				'plan'           => 'basic',
				'is_integration' => true,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/klaviyo/icon.svg',
				),
			),
			'salesforce'                => array(
				'name'           => esc_html__( 'Salesforce', 'quillforms' ),
				'description'    => esc_html__( 'Send new accounts, contacts, leads, cases or any other object to your Salesforce account.', 'quillforms' ),
				'plugin_file'    => 'quillforms-salesforce/quillforms-salesforce.php',
				'min_version'    => '1.1.0',
				'plan'           => 'plus',
				'is_integration' => true,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/salesforce/icon.svg',
				),
			),
			'sendinblue'                => array(
				'name'           => esc_html__( 'Sendinblue', 'quillforms' ),
				'description'    => esc_html__( 'Send new contacts to your Sendinblue account.', 'quillforms' ),
				'plugin_file'    => 'quillforms-sendinblue/quillforms-sendinblue.php',
				'plan'           => 'basic',
				'is_integration' => true,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/sendinblue/icon.png',
				),
			),
			'slack'                     => array(
				'name'           => esc_html__( 'Slack', 'quillforms' ),
				'description'    => esc_html__( 'Send new entries to your Slack workspaces.', 'quillforms' ),
				'plugin_file'    => 'quillforms-slack/quillforms-slack.php',
				'plan'           => 'basic',
				'is_integration' => true,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/slack/icon.png',
				),
			),
			'webhooks'                  => array(
				'name'           => esc_html__( 'Webhooks', 'quillforms' ),
				'description'    => esc_html__( 'Send new entries data to any external service or application.', 'quillforms' ),
				'plugin_file'    => 'quillforms-webhooks/quillforms-webhooks.php',
				'plan'           => 'plus',
				'is_integration' => true,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/webhooks/icon.svg',
				),
			),
			'make'                      => array(
				'name'           => esc_html__( 'Make', 'quillforms' ),
				'description'    => esc_html__( 'Send your submission to Make (formerly integromat) scenarios.', 'quillforms' ),
				'plugin_file'    => 'quillforms-make/quillforms-make.php',
				'plan'           => 'plus',
				'is_integration' => true,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/make/icon.png',
				),
			),
			'zapier'                    => array(
				'name'           => esc_html__( 'Zapier', 'quillforms' ),
				'description'    => esc_html__( 'Send your submission to Zapier configured zaps.', 'quillforms' ),
				'plugin_file'    => 'quillforms-zapier/quillforms-zapier.php',
				'min_version'    => '1.2.1',
				'plan'           => 'plus',
				'is_integration' => true,
				'assets'         => array(
					'icon'   => QUILLFORMS_PLUGIN_URL . 'assets/addons/zapier/icon.svg',
					'banner' => QUILLFORMS_PLUGIN_URL . 'assets/addons/zapier/banner.png',
				),
			),
			'wpuserregistration'        => array(
				'name'           => esc_html__( 'WordPress User Registeration', 'quillforms' ),
				'description'    => esc_html__( 'Register new WordPress users on form submission.', 'quillforms' ),
				'plugin_file'    => 'quillforms-wpuserregistration/quillforms-wpuserregistration.php',
				'plan'           => 'plus',
				'is_integration' => true,
				'assets'         => array(
					'icon' => QUILLFORMS_PLUGIN_URL . 'assets/addons/wpuserregistration/icon.svg',
				),
			),
		);

		if ( ! function_exists( 'is_plugin_active' ) || ! function_exists( 'get_plugin_data' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
		}

		// base dir of plugins (with trailing slash) instead of WP_PLUGIN_DIR.
		$plugins_dir = trailingslashit( dirname( dirname( QUILLFORMS_PLUGIN_FILE ) ) );

		foreach ( $addons as $slug => $addon ) {
			$full_plugin_file = $plugins_dir . $addon['plugin_file'];
			$plugin_exists    = file_exists( $full_plugin_file );
			$plugin_data      = $plugin_exists ? get_plugin_data( $full_plugin_file ) : array();

			$addons[ $slug ]['full_plugin_file'] = $full_plugin_file;
			$addons[ $slug ]['is_installed']     = $plugin_exists;
			$addons[ $slug ]['is_active']        = is_plugin_active( $addon['plugin_file'] );
			$addons[ $slug ]['version']          = $plugin_data['Version'] ?? null;
		}

		$this->addons = $addons;
	}

	/**
	 * Check ajax request authorization.
	 * Sends error response and exit if not authorized.
	 *
	 * @return void
	 */
	private function check_authorization() {
		// check for valid nonce field.
		if ( ! check_ajax_referer( 'quillforms_site_store', '_nonce', false ) ) {
			wp_send_json_error( esc_html__( 'Invalid nonce', 'quillforms' ), 403 );
			exit;
		}

		// check for user capability.
		if ( ! current_user_can( 'manage_quillforms' ) ) {
			wp_send_json_error( esc_html__( 'Forbidden', 'quillforms' ), 403 );
			exit;
		}
	}

}
