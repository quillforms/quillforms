<?php
class QF_Form_Submission {

	public $_form_data = array();

	public $_form_id = '';

	public $_errors = array();

	public $entry_id = '';

	public function __construct() {

		add_action( 'wp_ajax_quillforms_form_submit', array( $this, 'submit' ) );
		add_action( 'wp_ajax_nopriv_quillforms_form_submit', array( $this, 'submit' ) );
	}


	public function submit() {
		$this->process_submission();
		$this->respond();
	}

	/**
	 * Saves entry to database.
	 *
	 * @since 1.0.0
	 *
	 * @param array $fields    List of form fields.
	 * @param array $entry     User submitted data.
	 * @param int   $form_id   Form ID.
	 * @param array $form_data Prepared form settings.
	 *
	 * @return int
	 */
	public function entry_save( $fields, $entry, $form_id, $form_data = array() ) {

		do_action( 'quillforms_process_entry_save', $fields, $entry, $form_id, $form_data );

		return $this->entry_id;
	}

	public function process_submission() {
		$this->_form_data = json_decode( stripslashes( $_POST['formData'] ), true );
		$nonce_name       = 'quillforms_forms_display_nonce';
		if ( ! check_ajax_referer( $nonce_name, '_nonce', $die = false ) ) {
			$this->_errors['form'] = 'Invalid nonce field!';
			return;
		}

		if ( ! isset( $this->_form_data ) || ! isset( $this->_form_data['formId'] ) ) {
			$this->_errors['form'] = 'Form Id missing!';
			return;
		}

		$this->_form_id = $this->_form_data['formId'];

		if ( 'quill_forms' !== get_post_type( $this->_form_id )
			|| 'publish' !== get_post_status( $this->_form_id ) ) {
			$this->_errors['form'] = 'Invalid form id!';
			return;
		}

		$blocks   = QF_Core::get_blocks( $this->_form_id );
		$messages = QF_Core::get_messages( $this->_form_id );
		$fields   = array_filter(
			$blocks,
			function( $block ) {
				return 'welcome-screen' !== $block['type'] && 'thankyou-screen' !== $block['type'];
			}
		);
		$answers  = $this->_form_data['answers'];

		$walk_path = apply_filters( 'quillforms_submission_walk_path', $fields, $this->_form_id, $answers );

		if ( ! empty( $walk_path ) ) {
			foreach ( $walk_path as $field ) {
				$block_type = QF_Blocks_Factory::get_instance()->create( $field );
				if ( ! $block_type ) {
					if ( ! $this->_errors['fields'] ) {
						$this->_errors['fields'] = array();
					}
					$this->_errors['fields'][ $field['id'] ] = 'This block type isn\'t known!';
				}

				if ( $block_type->supported_features['editable'] ) {

					$field_answer = null;
					if ( ! empty( $this->_form_data['answers'] ) && isset( $this->_form_data['answers'][ $field['id'] ] ) ) {
						$field_answer = $this->_form_data['answers'][ $field['id'] ];
					}
					$block_type->validate_field( $field_answer, $messages );

					if ( ! $block_type->is_valid && ! empty( $block_type->validation_err ) ) {
						if ( ! $this->_errors['fields'] ) {
							$this->_errors['fields'] = array();
						}
						$this->_errors['fields'][ $field['id'] ] = $block_type->validation_err;

					}
				}
			}
		}

		if ( empty( $this->_errors ) || empty( $this->_errors['fields'] ) ) {

		}
	}

	public function process() {

	}

	public function validate_field() {

	}

	protected function sanitize_field() {

	}

	/*
	* Overwrite method for parent class.
	*/
	protected function respond( $data = array() ) {
		// Restore form instance ID.
		if ( ! empty( $this->_errors ) ) {
			wp_send_json_error( $this->_errors, 400 );
		} else {
			wp_send_json_success( 'Updated successfully!', 200 );
		}
	}

}

new QF_Form_Submission();
