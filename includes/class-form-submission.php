<?php
/**
 * Form Submission: class Form_Submission
 *
 * @since 1.0.0
 *
 * @package QuillForms
 */

namespace QuillForms;

use QuillForms\Addon\Payment_Gateway\Payment_Gateway;
use QuillForms\Emails\Emails;
use QuillForms\Managers\Addons_Manager;
use QuillForms\Managers\Blocks_Manager;

/**
 * Form Sumbission class is responsible for handling form submission and response with success or error messages.
 *
 * @since 1.0.0
 */
class Form_Submission
{

    /**
     * Form data
     *
     * @since 1.0.0
     *
     * @var array
     */
    public $form_data;

    /**
     * Submission Entry
     *
     * @since 1.10.0
     *
     * @var Entry
     */
    public $entry;

    /**
     * Submission id
     * Defined if handling a pending submission
     *
     * @since next.version
     *
     * @var integer
     */
    public $submission_id;

    /**
     * Step
     * Defined if handling a pending submission
     *
     * @since next.version
     *
     * @var string
     */
    public $step;

    /**
     * Form errors
     *
     * @since 1.0.0
     *
     * @var array
     */
    public $errors = array();

    /**
     * Class instance
     *
     * @since 1.0.0
     *
     * @var self instance
     */
    private static $instance = null;

    /**
     * Get class instance
     *
     * @since 1.0.0
     *
     * @return self
     */
    public static function instance()
    {
        if (! self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     *
     * @since 1.0.0
     */
    private function __construct()
    {
        add_action('wp_ajax_quillforms_form_submit', array( $this, 'submit' ));
        add_action('wp_ajax_nopriv_quillforms_form_submit', array( $this, 'submit' ));
    }

    /**
     * Ajax submit.
     *
     * @since 1.0.0
     */
    public function submit()
    {
        $this->process_submission();
        $this->respond();
    }

    /**
     * Process submission
     *
     * @since 1.0.0
     */
    public function process_submission()
    {
        $unsanitized_entry = json_decode(stripslashes($_POST['formData']), true);
        // Check if form id is valid.
        if (! isset($unsanitized_entry) || ! isset($unsanitized_entry['formId']) ) {
            $this->errors['form'] = 'Form Id missing!';
            return;
        }

        // Check if answers is array.
        if (! isset($unsanitized_entry['answers']) || ! is_array($unsanitized_entry['answers']) ) {
            $this->errors['form'] = "Answers aren't sent or invalid";
            return;
        }

        $form_id = sanitize_text_field($unsanitized_entry['formId']);

        // Check if post type is quill_forms and its status is publish.
        if ('quill_forms' !== get_post_type($form_id) || 'publish' !== get_post_status($form_id) ) {
            $this->errors['form'] = 'Invalid form id!';
            return;
        }

        // init errors check.
        $this->errors = apply_filters('quillforms_submission_init_errors', $this->errors, $unsanitized_entry);
        if ($this->errors ) {
            return;
        }

        $this->form_data = Core::get_form_data($form_id);

        // initialize entry object.
        $this->entry               = new Entry();
        $this->entry->form_id      = $form_id;
        $this->entry->date_created = gmdate('Y-m-d H:i:s');
        $this->entry->date_updated = gmdate('Y-m-d H:i:s');

        // add some basic entry meta.
        // user id.
        $this->entry->set_meta_value('user_id', get_current_user_id());
        // user ip & its hash.
        if (! Settings::get('disable_collecting_user_ip', false) ) {
            $this->entry->set_meta_value('user_ip', quillforms_get_client_ip());
        }
        $this->entry->set_meta_value('user_ip_hash', quillforms_get_client_ip_hash());
        // user agent.
        if (! Settings::get('disable_collecting_user_agent', false) ) {
            $this->entry->set_meta_value('user_agent', $_SERVER['HTTP_USER_AGENT'] ?? '');
        }

        // add sanitized fields.
        foreach ( Core::get_blocks_recursively($this->form_data['blocks']) as $block ) {
            $block_type = Blocks_Manager::instance()->create($block);
            if (! $block_type || ! $block_type->supported_features['editable'] ) {
                continue;
            }

            $field_answer = $unsanitized_entry['answers'][ $block['id'] ]['value'] ?? null;
            if (null !== $field_answer ) {
                $sanitize_value = $block_type->sanitize_field($field_answer, $this->form_data);
                $this->entry->set_record_value('field', $block['id'], $sanitize_value);
            }
        }

        // filter for entry object init.
     /** @var Entry */ // phpcs:ignore
        $this->entry = apply_filters('quillforms_entry_init', $this->entry, $this->form_data, $unsanitized_entry);

        // blocks walk path.
        $walkpath = array_map(
            function ( $block ) {
                return $block['id'];
            },
            $this->form_data['blocks']
        );

        // filter walkpath with entry.
     /** @var Entry "$this->entry" */ // phpcs:ignore
        list($walkpath, $this->entry) = apply_filters('quillforms_entry_walkpath', array( $walkpath, $this->entry ), $this->form_data);

        // Set walkpath meta.
        $this->entry->set_meta_value('walkpath', $walkpath);

        // pre-validation errors check.
        $this->errors = apply_filters('quillforms_entry_pre_validation_errors', $this->errors, $this->entry, $this->form_data);
        if ($this->errors ) {
            return;
        }

        // Validate all fields at the walkpath.
        foreach ( $walkpath as $block_id ) {
            $block      = quillforms_arrays_find($this->form_data['blocks'], 'id', $block_id);
            $this->validate_field_answer($block);
        }

        // stop if there are validation errors.
        if ($this->errors ) {
            return;
        }

        // post-validation errors check.
        $this->errors = apply_filters('quillforms_entry_post_validation_errors', $this->errors, $this->entry, $this->form_data);
        if ($this->errors ) {
            return;
        }

        // Format the editable non-empty fields.
        foreach ( $walkpath as $block_id ) {
            $block      = quillforms_arrays_find($this->form_data['blocks'], 'id', $block_id);
            $this->format_field_value($block);
        }

        // check payments.
        $payments = $this->get_payments_meta();
        if ($payments ) {
            $this->entry->set_meta_value('payments', $payments);

            $this->submission_id = $this->save_pending_submission('payment');
            if (! $this->submission_id ) {
                wp_send_json_error(array( 'message' => 'Cannot save the pending submission' ), 500);
                exit;
            }

            wp_send_json_success($this->get_pending_submission_renderer_data(), 200);
            exit;
        }

        $this->process_entry();
    }

    /**
     * Validate field answers
     *
     * @since 2.0.0
     */
    public function validate_field_answer($block)
    {
        $block_type = Blocks_Manager::instance()->create($block);
        if(!$block_type ) {
            return;
        }
        if($block_type->supported_features['innerBlocks']) {
            if(isset($block['innerBlocks']) && !empty($block['innerBlocks'])) {
                foreach($block['innerBlocks'] as $child_block) {
                    $this->validate_field_answer($child_block);
                }
            }
        }
        if (! $block_type->supported_features['editable']) {
            return;
        }

        $validation_message = null;
        $field_answer       = $this->entry->get_record_value('field', $block['id']);
        $block_type->validate_field($field_answer, $this->form_data);
        if (! $block_type->is_valid && ! empty($block_type->validation_err) ) {
            $validation_message = $block_type->validation_err;
        }
        $validation_message = apply_filters('quillforms_entry_field_validation', $validation_message, $block, $block_type, $field_answer, $this->entry, $this->form_data);
        if ($validation_message ) {
            if (! $this->errors['fields'] ) {
                $this->errors['fields'] = array();
            }
            $this->errors['fields'][ $block['id'] ] = $validation_message;
        }
    }

    /**
     * Format Field Value
     *
     * @since 2.0.0
     */
    public function format_field_value($block)
    {

        $block_type = Blocks_Manager::instance()->create($block);
        if(!$block_type ) {
            return;
        }
        if($block_type->supported_features['innerBlocks']) {
            if(isset($block['innerBlocks']) && !empty($block['innerBlocks'])) {
                foreach($block['innerBlocks'] as $child_block) {
                    $this->format_field_value($child_block);
                }
            }
        }
        if (! $block_type->supported_features['editable']) {
            return;
        }

        $field_answer = $this->entry->get_record_value('field', $block['id']);
        if (null !== $field_answer ) {
            $formatted_value = $block_type->format_field($field_answer, $this->form_data);
            $this->entry->set_record_value('field', $block['id'], $formatted_value);
        }
    }
    /**
     * Restore pending submission
     *
     * @since next.version
     *
     * @param  integer $submission_id Submission id.
     * @return boolean
     */
    public function restore_pending_submission( $submission_id )
    {
        $pending_submission = $this->get_pending_submission($submission_id);
        if (! $pending_submission ) {
            return false;
        }

        $this->submission_id = $pending_submission['ID'];
        $this->step          = $pending_submission['step'];
        $this->form_data     = $pending_submission['form_data'];
        $this->entry         = $pending_submission['entry'];

        return true;
    }

    /**
     * Continue pending submission
     *
     * @since next.version
     *
     * @return void
     */
    public function continue_pending_submission()
    {
        switch ( $this->step ) {
        case 'payment':
            $this->process_entry();
            $this->delete_pending_submission($this->submission_id);
            break;
        }
    }

    /**
     * Process the entry after validation
     *
     * @return void
     */
    public function process_entry()
    {
        if ($this->submission_id ) {
            $this->entry->set_meta_value('submission_id', $this->submission_id);
        }

        // this can set ID of the entry.
        $this->entry = apply_filters('quillforms_entry_save', $this->entry, $this->form_data);

        // do entry saved action.
        if ($this->entry->ID ) {
            do_action('quillforms_entry_saved', $this->entry, $this->form_data);
        }

        // process email notifications.
        $this->entry_email();

        // finally do entry processed action.
        do_action('quillforms_entry_processed', $this->entry, $this->form_data);
    }

    /**
     * Get payments meta
     *
     * @since next.version
     *
     * @return array|null
     */
    public function get_payments_meta()
    {
        if (! ( $this->form_data['payments']['enabled'] ?? null ) ) {
            return null;
        }

        $model_id = $this->get_payment_model_id();
        if (! $model_id ) {
            return null;
        }
        $model = $this->form_data['payments']['models'][ $model_id ];

        $products = $this->get_products();
        if (! $products['items'] || ! $products['total'] ) {
            return null;
        }

        return array(
        'model_id'  => $model_id,
        'recurring' => $model['recurring'],
        'currency'  => $this->form_data['payments']['currency'],
        'products'  => $products,
        'labels'    => $this->form_data['payments']['labels'],
        );
    }

    /**
     * Get payment model id
     *
     * @since next.version
     *
     * @return string|null
     */
    public function get_payment_model_id()
    {
        foreach ( ( $this->form_data['payments']['models'] ?? array() ) as $id => $model ) {
            if ($model['conditions'] ) {
                if (Logic_Conditions::instance()->is_conditions_met($model['conditions'], $this->entry, $this->form_data) ) {
                    return $id;
                }
            } else {
                return $id;
            }
        }
        return null;
    }

    /**
     * Get products data
     *
     * @since next.version
     *
     * @return array|null
     */
    public function get_products()
    {
        $items = array();
        foreach ( ( $this->form_data['products'] ?? array() ) as $product ) {
            switch ( $product['source']['type'] ) {
            case 'field':
                $block_id = $product['source']['value'];
                if (! in_array($block_id, $this->entry->get_meta_value('walkpath'), true) ) {
                        break;
                }
                $block = quillforms_arrays_find(Core::get_blocks_recursively($this->form_data['blocks']), 'id', $block_id);
                if (! $block ) {
                      break;
                }
                $block_type = Blocks_Manager::instance()->create($block);
                if (! $block_type ) {
                    break;
                }

                if ($block_type->supported_features['numeric'] ) {
                    $items[] = array(
                    'name'     => $product['name'],
                    'price'    => (float) $block_type->get_numeric_value($this->entry->get_record_value('field', $block_id)),
                    'quantity' => 1,
                    );
                } elseif ($block_type->supported_features['choices'] ) {
                    $choices  = $block_type->get_choices();
                    $selected = $this->entry->get_record_value('field', $block_id) ?? array();
                    $selected = (array) $selected;
                    if ($choices && $selected ) {
                        foreach ( $choices as $choice ) {
                            if (in_array($choice['value'], $selected, true) ) {
                                 $value = $product['choices'][ $choice['value'] ]['price'] ?? null;
                                if (is_numeric($value) ) {
                                    $items[] = array(
                                    'name'     => $choice['label'],
                                    'price'    => (float) $value,
                                    'quantity' => 1,
                                    );
                                }
                            }
                        }
                    }
                }
                break;

            case 'variable':
                $items[] = array(
                'name'     => $product['name'],
                'price'    => (float) $this->entry->get_record_value('variable', $product['source']['value']),
                'quantity' => 1,
                );
                break;

            case 'other':
                if ($product['source']['value'] === 'defined' ) {
                    $items[] = array(
                    'name'     => $product['name'],
                    'price'    => (float) $product['price'],
                    'quantity' => 1,
                    );
                }
                break;
            }
        }

        $total = array_reduce(
            $items,
            function ( $carry, $item ) {
                return $carry + ( $item['price'] * $item['quantity'] );
            },
            0
        );

        return compact('items', 'total');
    }

    /**
     * Get pending submission renderer data
     *
     * @since next.version
     *
     * @return array
     */
    public function get_pending_submission_renderer_data()
    {
        return array(
        'status'             => 'pending_payment',
        'submission_id'      => $this->submission_id,
        'payments'           => $this->get_payments_renderer_data(),
        'thankyou_screen_id' => $this->get_thankyou_screen_id(),
        );
    }

    /**
     * Get payments renderer data
     *
     * @since next.version
     *
     * @return array
     */
    private function get_payments_renderer_data()
    {
        $payments = $this->entry->get_meta_value('payments');

        // add currency symbol.
        $payments['currency']['symbol'] = Payments::instance()->get_currency_symbol($payments['currency']['code']);

        // add methods.
        $payments['methods'] = $this->get_available_methods();

        return $payments;
    }

    /**
     * Get available (active and configured) methods
     *
     * @since next.version
     *
     * @return array
     */
    private function get_available_methods()
    {
        $methods = $this->form_data['payments']['methods'];

        foreach ( array_keys($methods) as $key ) {
            list($gateway, $method) = explode(':', $key);

         /** @var Payment_Gateway */ // phpcs:ignore
            $gateway_addon = Addons_Manager::instance()->get_registered($gateway);

            if (! $gateway_addon || ! $gateway_addon->is_configured($method) ) {
                unset($methods[ $key ]);
            }
        }

        return $methods;
    }

    /**
     * Get thank you screen id
     *
     * @since next.version
     *
     * @return string
     */
    public function get_thankyou_screen_id()
    {
        $walkpath = $this->entry->get_meta_value('walkpath');

        $last_block_id = $walkpath[ count($walkpath) - 1 ];
        $last_block    = quillforms_arrays_find($this->form_data['blocks'], 'id', $last_block_id);

        if ('thankyou-screen' === $last_block['name'] ) {
            return $last_block['id'];
        } else {
            return 'default_thankyou_screen';
        }
    }

    /**
     * Save pending submission
     *
     * @since next.version
     *
     * @param  string $step Step.
     * @return id
     */
    private function save_pending_submission( $step )
    {
        global $wpdb;

        $insert = $wpdb->insert(
            "{$wpdb->prefix}quillforms_pending_submissions",
            array(
            'form_id'      => $this->entry->form_id,
            'step'         => $step,
            'entry'        => maybe_serialize($this->entry),
            'form_data'    => maybe_serialize($this->form_data),
            'date_created' => gmdate('Y-m-d H:i:s'),
            )
        );

        if (! $insert ) {
            return false;
        }

        return $wpdb->insert_id;
    }

    /**
     * Get pending submission
     *
     * @since next.version
     *
     * @param  integer $id Submission id.
     * @return array
     */
    private function get_pending_submission( $id )
    {
        global $wpdb;

        $result = $wpdb->get_row(
            $wpdb->prepare(
                "
					SELECT *
					FROM {$wpdb->prefix}quillforms_pending_submissions
					WHERE ID = %d
				",
                $id
            ),
            ARRAY_A
        );

        if (! $result ) {
            return null;
        }

        if (isset($result['entry']) ) {
            $result['entry'] = maybe_unserialize($result['entry']);
        }
        if (isset($result['form_data']) ) {
            $result['form_data'] = maybe_unserialize($result['form_data']);
        }

        return $result;
    }

    /**
     * Delete pending submission
     *
     * @since next.version
     *
     * @param  integer $id Submission id.
     * @return boolean
     */
    private function delete_pending_submission( $id )
    {
        global $wpdb;

        return (bool) $wpdb->delete(
            "{$wpdb->prefix}quillforms_pending_submissions",
            array( 'ID' => $id ),
            array( '%d' )
        );
    }

    /**
     * Process emails based on entry and form data.
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function entry_email()
    {
        quillforms_get_logger()->debug(
            'Start processing notifications',
            array(
            'form_data' => $this->form_data,
            'entry'     => $this->entry,
            )
        );

        foreach ( $this->form_data['notifications'] as $notification ) {

            $notification_id         = $notification['id'];
            $notification_properties = $notification['properties'];

            $process_email = apply_filters('quillforms_entry_email_process', true, $this->entry, $this->form_data, $notification_id);

            // if process email = false or notifcation isn't active, continue.
            if (! $process_email
                || ! $notification_properties['active']
                || ( ! empty($notification_properties['conditions']) && ! Logic_Conditions::instance()->is_conditions_met($notification_properties['conditions'], $this->entry, $this->form_data) )
            ) {
                continue;
            }

            $email = array();

            // Setup email properties.
            /* translators: %s - form name. */
            $email['subject'] = ! empty($notification_properties['subject']) ? $notification_properties['subject'] : sprintf(esc_html__('New %s Entry', 'quillforms'), $this->form_data['title']);
            $email['address'] = $notification_properties['recipients'];
            if ('field' === $notification_properties['toType'] ) {
                $email['address'] = array_map(
                    function ( $address ) {
                        return Merge_Tags::instance()->process_text($address, $this->entry, $this->form_data);
                    },
                    $email['address']
                );
            }

            $email['address'] = array_map('sanitize_email', $email['address']);
            $email['address'] = array_filter(
                $email['address'],
                function ( $email ) {
                    return ! ! $email;
                }
            );

            if (empty($email['address']) ) {
                   continue;
            }
            $email['sender_address'] = get_option('admin_email');
            $email['sender_name']    = get_bloginfo('name');
            $email['replyto']        = ! empty($notification['properties']['replyTo']) ? $notification['properties']['replyTo'] : false;
            $email['message']        = ! empty($notification_properties['message']) ? $notification_properties['message'] : '{{form:all_answers}}';
            $email                   = apply_filters('quillforms_entry_email_atts', $email, $this->entry, $this->form_data, $notification_id);

            quillforms_get_logger()->debug('Initial email data', compact('email'));

            // Create new email.
            $emails                  = new Emails();
            $emails->form_data       = $this->form_data;
            $emails->entry           = $this->entry;
            $emails->notification_id = $notification_id;
            $emails->from_name       = $email['sender_name'];
            $emails->from_address    = $email['sender_address'];
            $emails->reply_to        = $email['replyto'];

            // Maybe include CC.
            if (! empty($notification['carboncopy']) && Settings::get('email-carbon-copy') ) {
                $emails->cc = $notification['carboncopy'];
            }

            $emails = apply_filters('quillforms_entry_email_before_send', $emails);

            quillforms_get_logger()->debug('Emails object', compact('emails'));

            // Go.
            foreach ( $email['address'] as $address ) {
                $emails->send(trim($address), $email['subject'], $email['message']);
            }
        }
    }

    /**
     * Respond with error or success.
     *
     * @since 1.0.0
     */
    protected function respond()
    {
        // Restore form instance ID.
        if (! empty($this->errors) ) {
            wp_send_json_error($this->errors, 200);
        } else {
            wp_send_json_success(array( 'status' => 'completed' ), 200);
        }
    }

}
