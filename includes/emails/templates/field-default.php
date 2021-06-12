<?php
/**
 * Email form field entry.
 *
 * Heavily influenced by the great AffiliateWP plugin by Pippin Williamson.
 * https://github.com/JustinSainton/AffiliateWP/blob/master/includes/emails/class-affwp-emails.php

 * This is used with the {{form:all_answers}} merge tag.
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage Emails
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #dddddd; display:block;min-width: 100%;border-collapse: collapse;width:100%;"><tbody>
	<tr><td style="color:#333333;padding-top: 20px;padding-bottom: 3px;"><strong>{field_label}</strong></td></tr>
	<tr><td style="color:#555555;padding-top: 3px;padding-bottom: 20px;">{field_value}</td></tr>
</tbody></table>
