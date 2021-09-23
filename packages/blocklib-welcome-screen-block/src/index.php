<?php
/**
 * Block Library: class Welcome_Screen_Block_Type
 *
 * @package QuillForms
 * @subpackage BlockLibrary
 * @since 1.0.0
 */

namespace QuillForms\Blocks;

use QuillForms\Abstracts\Block_Type;
use QuillForms\Managers\Blocks_Manager;

defined( 'ABSPATH' ) || exit;

/**
 * Welcome screen block
 *
 * @class Welcome_Screen_Block_Type
 *
 * @since 1.0.0
 */
class Welcome_Screen_Block_Type extends Block_Type {

	/**
	 * Metadata json file.
	 *
	 * @var string
	 *
	 * @access private
	 */
	private $metadata;


	/**
	 * Get block name.
	 * It must be a unique name.
	 *
	 * @since 1.0.0
	 *
	 * @return string The block name
	 */
	public function get_name() : string {
		return $this->get_metadata()['name'];
	}

	/**
	 * Get block supported features.
	 *
	 * @since 1.0.0
	 *
	 * @return array The block supported features
	 */
	public function get_block_supported_features() : iterable {
		return $this->get_metadata()['supports'];
	}

	/**
	 * Get block admin assets
	 *
	 * @since 1.0.0
	 *
	 * @return array The block admin assets
	 */
	public function get_block_admin_assets() : iterable {
		return array(
			'style'  => 'quillforms-blocklib-welcome-screen-block-admin-style',
			'script' => 'quillforms-blocklib-welcome-screen-block-admin-script',
		);
	}

	/**
	 * Get block renderer assets
	 *
	 * @since 1.0.0
	 *
	 * @return array The block renderer assets
	 */
	public function get_block_renderer_assets() : iterable {
		return array(
			'style'  => 'quillforms-blocklib-welcome-screen-block-renderer-style',
			'script' => 'quillforms-blocklib-welcome-screen-block-renderer-script',
		);
	}

	/**
	 * Get block custom attributes.
	 *
	 * @since 1.0.0
	 *
	 * @return array The block custom attributes
	 */
	public function get_custom_attributes() : iterable {
		return $this->get_metadata()['attributes'];
	}

	/**
	 * Get meta data
	 * This file is just for having some shared properties between front end and back end.
	 * Just as the block type.
	 *
	 * @access private
	 *
	 * @return array|null metadata from block . json file
	 */
	private function get_metadata() {
		if ( ! $this->metadata ) {
			$this->metadata = json_decode(
				file_get_contents(
					$this->get_dir() . 'block.json'
				),
				true
			);
		}
		return $this->metadata;
	}

	/**
	 * Get block directory
	 *
	 * @since 1.0.0
	 *
	 * @access private
	 *
	 * @return string The directory path
	 */
	private function get_dir() : string {
		return trailingslashit( dirname( __FILE__ ) );
	}

}

Blocks_Manager::instance()->register( new Welcome_Screen_Block_Type() );
