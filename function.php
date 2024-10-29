<?php
/**
 * Plugin Name: Ajax Comment With Sweet Alert
 * Plugin URI: http://hanhtrinhtuoitre.com/
 * Description: HanhTrinhTuoiTre.Com - Ajax comment with sweet alert; Plugin work well with themes: Twenty Fourteen, Twenty Ten, Twenty Fifteen, Twenty Twelve, Twenty Eleven, Twenty Thirteen,
 * Version: 1.0.2
 * Author: Pham Khien
 * Author URI: http://hanhtrinhtuoitre.com/
 * License: GPLv2 or later
 */

if (!defined('AJAX_COMMENT_PLUGIN_URL'))
    define('AJAX_COMMENT_PLUGIN_URL', plugin_dir_url(__FILE__));

if (!defined('AJAX_COMMENT_PLUGIN_IMG_URL'))
    define('AJAX_COMMENT_PLUGIN_IMG_URL', AJAX_COMMENT_PLUGIN_URL . 'img/');

/**
 * Init plugin
 */
add_action('init', 'hanhtrinhtuoitre_ajax_comment_init');
function hanhtrinhtuoitre_ajax_comment_init()
{
    // Init CSS
    wp_enqueue_style('ajax-comment-css-sweet-alert', plugins_url('/css/sweet-alert.css', __FILE__));
    wp_enqueue_style('ajax-comment-css-custom', plugins_url('/css/custom.css', __FILE__));

    // Init JS
    wp_enqueue_script('ajax-comment-js-sweet-alert', plugins_url('/js/sweet-alert.min.js', __FILE__), array('jquery'), null, TRUE);
    wp_enqueue_script('ajax-comment-js-main', plugins_url('/js/main.js', __FILE__), array('jquery'), null, TRUE);
}

/**
 * Add new param "anchor" for feature scroll
 */
add_filter('comment_post_redirect', 'redirect_after_comment', 'comment');
function redirect_after_comment($location)
{
    $pos = strpos($location, "#");
    if ($pos) {
        $url      = substr($location, 0, $pos - 1);
        $anchor   = substr($location, $pos + 1);
        $location = $url . "?anchor=$anchor" . "#$anchor";
    }

    return $location;
}

/**
 * Declare js variable ajaxCommentImgUrl for url folder images of plugin
 */
add_action('wp_head', 'ajax_comment_head');
function ajax_comment_head()
{ ?>
    <script type="text/javascript">
        var ajaxCommentImgUrl = "<?php print AJAX_COMMENT_PLUGIN_IMG_URL; ?>";
    </script>
    <?php
}

