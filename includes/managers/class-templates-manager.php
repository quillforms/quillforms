<?php
/**
 * Templates API: Templates_Manager class.
 *
 * @package QuillForms
 * @since   1.0.0
 */

namespace QuillForms\Managers;
use Exception;


use QuillForms\Abstracts\Form_Template;

/**
 * Core class used for registering templates and managing them.
 *
 * @since 1.0.0
 */
final class Templates_Manager {

    /**
	 * Registered templates
	 *
	 * @var Form_Template[]
	 */
	private $registered = array();


    /**
	 * Class instance.
	 *
	 * @var self instance
	 */
	private static $instance = null;

	/**
	 * Get class instance.
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
	 * Register template
	 *
	 * @param Addon $template Addon instance.
	 * @throws Exception Exception when slug exists.
	 * @return void
	 */
	public function register_template( $template ) {
		if ( ! $template instanceof Form_Template ) {
			throw new Exception(
				sprintf( '%s object is not instance of %s', get_class( $template ), Form_Template::class ),
				self::NOT_ADDON_INSTANCE
			);
		}
		// empty slug.
		if ( empty( $template->name ) ) {
			throw new Exception(
				sprintf( '%s template slug is empty', get_class( $template ) ),
				self::EMPTY_SLUG
			);
		}
	
		
		// already used slug.
		if ( isset( $this->registered[ $template->name ] ) ) {
			throw new Exception(
				sprintf( '%s template slug is already used for %s', $template->name, get_class( $this->registered[ $template->name ] ) ),
				self::ALREADY_USED_SLUG
			);
		}

		$this->registered[ $template->name ] = $template;
	}

	/**
	 * Get all registered
	 *
	 * @return Form_Template[] associative array of `$tempalte->name => $template` pairs
	 */
	public function get_all_registered() {
		return $this->registered;
	}


	/**
	 * Get registered template by namespace
	 *
	 * @param string $namespace Main namespace of template.
	 * @return Template|null
	 */
	public function get_registered_by_name( $name ) {
		foreach ( $this->registered as $template ) {
			if ( $template->get_name() === $name ) {
				return $template;
			}
		}
		return null;
	}


}