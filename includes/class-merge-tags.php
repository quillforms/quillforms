<?php
/**
 * Merge Tags: class Merge_Tags
 *
 * @since   1.0.0
 * @package QuillForms
 */

namespace QuillForms;
use QuillForms\Managers\Blocks_Manager;

/**
 * This class is to handle merge tags.
 * Merge tags should have the same structure with type and modifier {{type:modifer}}
 * One example is {{field:field_id}}, here the type of merge tag is "field" and the modifier is its id.
 * The class should parse the merge tags to merge tag values according to their type and their modifier.
 *
 * @since 1.0.0
 */
class Merge_Tags
{

    /**
     * Types
     *
     * @since 1.8.9
     *
     * @var array type => args
     */
    private $types = array();

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
        $this->register('property', array( 'process' => array( $this, 'process_property_merge_tag' ) ));
        $this->register('user', array( 'process' => array( $this, 'process_user_merge_tag' ) ));
        $this->register('website', array( 'process' => array( $this, 'process_website_merge_tag' ) ));
        $this->register('quiz', array( 'process' => array( $this, 'process_quiz_merge_tag' ) ));
    }

    /**
     * Register merge tag type
     *
     * @since 1.8.9
     *
     * @param string $type Merge tag type.
     * @param array  $args {
     *                     Merge tag type args.
     * @type  callable $process Process callback accepts $merge_tag_modifier, $entry, $form_data and $context.
     * }
     */
    public function register( $type, $args )
    {
        if (! isset($this->types[ $type ]) && is_callable($args['process']) ) {
            $this->types[ $type ] = $args;
        }
    }

    /**
     * Get registered types
     *
     * @since 1.8.9
     *
     * @return array
     */
    public function get_registered_types()
    {
        return array_keys($this->types);
    }

    /**
     * Process tag or text
     * If tag is unknown, it will be processed as text
     *
     * @since 1.13.0
     *
     * @param  array  $data      Array contains 'type' and 'value'. type can be text or any registered merge tag.
     * @param  Entry  $entry     Entry.
     * @param  array  $form_data Form data.
     * @param  string $context   Context.
     * @return string|null
     */
    public function process( $data, $entry, $form_data, $context = 'html' )
    {
        if (! $data ) {
            return null;
        }
        $type  = $data['type'] ?? null;
        $value = $data['value'] ?? '';
        if (in_array($type, $this->get_registered_types(), true) ) {
            return $this->process_tag($type, $value, $entry, $form_data, $context);
        } else {
            return $this->process_text($value, $entry, $form_data, $context);
        }
    }

    /**
     * Process merge tags on text.
     * It is very important to mention that merge tags in this plugin are a bit different.
     * They have a consistent structure {{a:b}} where "a" is the merge tag type and "b" is the merge tag modifier.
     * It worth mentioning that no other structure will be working like for example: {a:b} or {{a=b}}, those won't work.
     *
     * @since 1.8.9
     *
     * @param string $text          The string on which merge tags will be processed.
     * @param array  $entry         The entry data.
     * @param array  $form_data     The form data and settings.
     * @param string $context       The context.
	 * @param array  $ignored_tags  List of tags to be ignored.
     *
     * @return string The string after processing merge tags.
     */
    public function process_text( $text, $entry, $form_data, $context = 'html', $ignored_tags=[] )
    {
        return preg_replace_callback(
            '/{{([a-zA-Z0-9-_]+):([a-zA-Z0-9-_]+)}}/',
            function ( $matches ) use ( $entry, $form_data, $context, $ignored_tags ) {
                return $this->process_tag($matches[1], $matches[2], $entry, $form_data, $context, $ignored_tags) ?? $matches[0];
            },
            $text
        );
    }

    /**
     * Process tag.
     *
     * @since 1.8.9
     *
     * @param  string $type      The merge tag type.
     * @param  string $modifier  The merge tag modifier.
     * @param  array  $entry     The entry data.
     * @param  array  $form_data The form data and settings.
     * @param  string $context   The context.
	 * @param array  $ignored_tags  List of tags to be ignored.
	 *
     * @return string|null
     */
    public function process_tag( $type, $modifier, $entry, $form_data, $context, $ignored_tags = [] )
    {
        if (isset($this->types[ $type ]) )  {
			if (! in_array($type, $ignored_tags, true) ) {
            	$value = $this->types[ $type ]['process']($modifier, $entry, $form_data, $context);
			}
			else {
				$value= '{{'. $type. ':'. $modifier. '}}';
			}
			return apply_filters("quillforms_process_{$type}_merge_tag", $value, $modifier, $entry, $form_data, $context);
        } else {
            return null;
        }
    }

    /**
     * Process property merge tag.
     * Property merge tag is when we have {{property:any}} in the string.
     * So, now the merge tag type is "property" and the modifier is "any".
     * We need to do some processing on this merge tag and replace it with the appropriate string.
     *
     * @since 1.8.9
     *
     * @param string $modifier  The merge tag modifier.
     * @param Entry  $entry     The entry object.
     * @param array  $form_data The form data and settings.
     * @param string $context   The context.
     *
     * @return string The string after processing merge tags.
     */
	public function process_property_merge_tag( $modifier, $entry, $form_data, $context ) { // phpcs:ignore
        switch ( $modifier ) {
        case 'id':
            return $entry->ID ?? '';
        case 'form_id':
            return $entry->form_id;
        case 'date_created':
            return $entry->date_created;
        case 'date_updated':
            return $entry->date_updated;
        case 'user_id':
            return $entry->get_meta_value('user_id') ?? '';
        case 'user_ip':
            return $entry->get_meta_value('user_ip') ?? '';
        case 'user_agent':
            return $entry->get_meta_value('user_agent') ?? '';
        }
        return '';
    }

    /**
     * Process website merge tag.
     * Website merge tag is when we have {{website:any}} in the string.
     * So, now the merge tag type is "website" and the modifier is "any".
     * We need to do some processing on this merge tag and replace it with the appropriate string.
     *
     * @since 1.8.9
     *
     * @param string $modifier  The merge tag modifier.
     * @param Entry  $entry     The entry object.
     * @param array  $form_data The form data and settings.
     * @param string $context   The context.
     *
     * @return string The string after processing merge tags.
     */
	public function process_website_merge_tag( $modifier, $entry, $form_data, $context ) { // phpcs:ignore
        switch ( $modifier ) {
        case 'admin_ajax_url':
            return admin_url('admin-ajax.php');
        case 'rest_api_url':
            return rest_url();
        }
        return '';
    }


	/**
     * Process user merge tag.
     * User merge tag is when we have {{user:any}} in the string.
     * So, now the merge tag type is "user" and the modifier is "any".
     * We need to do some processing on this merge tag and replace it with the appropriate string.
     *
     * @since 1.8.9
     *
     * @param string $modifier  The merge tag modifier.
     * @param Entry  $entry     The entry object.
     * @param array  $form_data The form data and settings.
     * @param string $context   The context.
     *
     * @return string The string after processing merge tags.
     */
	public function process_user_merge_tag( $modifier, $entry, $form_data, $context ) { // phpcs:ignore
        $user = wp_get_current_user();
		switch ( $modifier ) {
        case 'display_name':
            return $user->display_name;
        case 'email':
            return $user->user_email;
		case 'username':
			return $user->user_login;

        }
        return '';
    }


    /**
     * Process quiz merge tag.
     * Website merge tag is when we have {{quiz:any}} in the string.
     * So, now the merge tag type is "quiz" and the modifier is "any".
     * We need to do some processing on this merge tag and replace it with the appropriate string.
     *
     * @since 1.8.9
     *
     * @param string $modifier  The merge tag modifier.
     * @param Entry  $entry     The entry object.
     * @param array  $form_data The form data and settings.
     * @param string $context   The context.
     *
     * @return string The string after processing merge tags.
     */
	public function process_quiz_merge_tag( $modifier, $entry, $form_data, $context ) { // phpcs:ignore
        $correctIncorrectQuiz  =  get_post_meta($form_data['id'], 'quiz', true) ?? false;
        if (!$correctIncorrectQuiz || !is_array($correctIncorrectQuiz) || empty($correctIncorrectQuiz) || !$correctIncorrectQuiz['enabled']) {
            return '';
        }

        $messages= $form_data['messages'];

        quillforms_get_logger()->info('quiz', array('quiz' => $correctIncorrectQuiz));
        $blocks = $form_data['blocks'];
        $correct_count  = 0;
        $incorrect_count = 0;
        $correct_incorrect_summary = array();
        foreach ( $blocks as $block_data ) {
            $field_id = $block_data['id'];

            $block_type = Blocks_Manager::instance()->create( $block_data );
            if($block_type && $block_type->supported_features['correctAnswers'] &&  $correctIncorrectQuiz['enabled']) {
                $field_value = $entry->get_record_value( 'field', $field_id );
                quillforms_get_logger()->info( 'field_value', $field_value );
                // this is how we check in js
                // const isCorrect = $val.every((answer) => correctIncorrectQuiz?.questions?.[id]?.correctAnswers?.includes(answer));
                $new_block = $block_data;
                if($field_value && is_array($field_value)) {
                    $is_correct = quillforms_array_every(  $field_value, function( $answer ) use ( $correctIncorrectQuiz, $field_id ) {
                        if(isset($correctIncorrectQuiz['questions'][$field_id]) && isset($correctIncorrectQuiz['questions'][$field_id]['correctAnswers']) ) {
                            return in_array( $answer, $correctIncorrectQuiz['questions'][ $field_id ]['correctAnswers'], true );
                        }
                        return false;
                    } );
                } else {
                    $is_correct = false;
                }
                $new_block['isCorrect'] = $is_correct;
                $new_block['value'] = $field_value;
                $new_block['block_type'] = $block_type;
                if(isset($correctIncorrectQuiz['questions'][ $field_id ]['explanation']) && !empty( $correctIncorrectQuiz['questions'][$field_id]['explanation'])) {
                    $new_block['explanation'] = $correctIncorrectQuiz['questions'][ $field_id ]['explanation'];
                }
                

                
                if ($is_correct) {
                    $correct_count ++;
                } else {
                    $incorrect_count ++;
                }

                $correct_incorrect_summary[] = $new_block;
            }
        }
        switch ( $modifier ) {
        case 'correct_answers_count':
            return $correct_count;
        case 'incorrect_answers_count':
            return $incorrect_count;

        case 'summary':
            quillforms_get_logger()->info('summary', array('summary' => $correct_incorrect_summary) );
            $res = '';
            foreach($correct_incorrect_summary as $index => $field) {
                $res .= '<p>' . $index + 1  . '- ' . $field['attributes']['label'] . '</p>';
                if($field['value'] && !empty($field['value'])) {
                    $readable_value= $field['block_type']->get_readable_value( $field['value'], $form_data, $context );
                }
                else {
                    $readable_value = '';
                }
                $background_color = $answers[$field_id]['isCorrect'] ? '#5bc68a' : '#d93148';
                $res .= '<p>' .   $messages["label.yourAnswer"] .': ' . $readable_value . '</p>';
                $res .= '<p style="color: #fff;background-color:' . $background_color .  ';padding: 5px 8px; display: inline-block;">'. $field['correct'] ? $messages['label.correct'] : $messages['label.incorrect'] . '</p>';
                if($field['explanation']) {
                    $res .= '<p style="">' . $messages['label.answersExplanation'] . '</p> <p style="">' . $field['explanation'] . '</p>';
                }
                // return '<p>' . $field['attributes']['label']  . '<p
                // <p style="">'. $field['correct'] ? 'Correct' : 'Incorrect' . '</p>' . 
                // $field['explanation'] ? '<p style="">Answer Explanation</p>             
                // <p style="">' . $field['explanation'] . '</p>' : '';
            }

            return $res;
        }
        return '';
    }

}
