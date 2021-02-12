<?php
/*
Plugin Name: Easy Content Analysis
Description: This is the plugin that provides an easy way to analyze your own content for WordPress.
Version: 1.0
Author: PRESSMAN
Author URI: https://www.pressman.ne.jp/
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
*/


class ECAAddSidebar {

    private static $instance;

    private function __construct() {

        add_action( 'init', array( $this, 'sidebar_plugin_register' ) );
        add_action( 'enqueue_block_editor_assets', array( $this, 'sidebar_plugin_enqueue' ) );
    }

    public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

    public function sidebar_plugin_register() {

        $asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.asset.php');

        wp_register_script(
            'easy-content-analysis', # unique name required
            plugins_url( 'build/index.js', __FILE__ ),
            $asset_file['dependencies'],
            $asset_file['version']
        );

        wp_register_style(
            'easy-content-analysis-style',
            plugins_url( 'build/index.css', __FILE__ )
        );
    }

    public function sidebar_plugin_enqueue() {

        wp_enqueue_script( 'easy-content-analysis' );
        wp_enqueue_style( 'easy-content-analysis-style' );
    }
};

ECAAddSidebar::get_instance();


class ECASettings {

    private static $instance;

    private function __construct() {

        add_action( 'admin_menu', array( $this, 'add_settings') );
    }

    public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

    public function add_settings() {

        add_options_page(
            'Easy_Content_Analysis',
            'settings for Easy Content Analysis',
            'administrator',
            'easy-content-analysis',
            array( $this, 'display_page' )
        );

        add_action( 'admin_init', array( $this, 'register_settings') );
    }

    private $group = 'text_analysis_options_group';

    public function register_settings() {

        register_setting( $this->group, 'eca_api_key');

        add_settings_section(
            'api-section',
            '',
            null,
            'easy-content-analysis',
        );

        add_settings_field(
            'api-key',
            'API Key',
            array($this, 'field_view'),
            'easy-content-analysis',
            'api-section',
        );
    }

    public function display_page() {

        ?>
        <div class="wrap">
            <h1>Easy Content Analysis</h1>
            <p>In order to activate the plugin, you need to get your own API key from Rakuten Rapid API.
            <br/>If you do not have API's key yet, create your account 
            <a href='https://english.api.rakuten.net/auth?referral=/developer' target="_blank">here</a>.</p>
            <form method="post" action="options.php">
                <?php
                settings_fields( $this->group );
                do_settings_sections( 'easy-content-analysis' );
                ?>
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }

    public function field_view() {
        ?>
        <input type="text" name="eca_api_key" value="<?php echo esc_attr( get_option('eca_api_key') ); ?>" />
        <?php
    }
};

ECASettings::get_instance();


class ECACreateAPI {

    private static $instance;

    private function __construct() {

        add_action( 'rest_api_init', array( $this, 'register_endpoint' ) );
    }

    public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

    public function register_endpoint() {

        register_rest_route( 'text-analysis/v0', '/api-key', array(
            'method' => 'GET',
            'callback' => array( $this, 'get_api_key' ),
            'permission_callback' => function () {
                return is_user_logged_in();
            },
        ) );
    }

    public function get_api_key($data) {

        $api_key = get_option( 'eca_api_key' );

        if ( empty($api_key) ) {
            return null;
        }
        return $api_key;
        
    }
};

ECACreateAPI::get_instance();
