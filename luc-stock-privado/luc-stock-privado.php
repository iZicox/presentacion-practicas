<?php
/**
 * Plugin Name: LUC Stock Privado
 * Description: Muestra el inventario disponible de un producto solo a usuarios con sesión iniciada y un aviso de inicio de sesión a los visitantes. Se inserta en la página de producto con el shortcode [luc_stock_privado]. El HTML comparte la misma estructura en ambos casos, con clases modificadoras para aplicar CSS personalizado (por ejemplo, desde Elementor Pro).
 * Version: 1.0.0
 * Requires PHP: 7.4
 * Author: Leds Universal Components
 */

namespace LUC\StockPrivado;

defined('ABSPATH') || exit;

define('LUC_SP_PATH', plugin_dir_path(__FILE__));
define('LUC_SP_URL', plugin_dir_url(__FILE__));
define('LUC_SP_VERSION', '1.0.0');

require_once LUC_SP_PATH . 'includes/stock.php';
require_once LUC_SP_PATH . 'includes/icons.php';
require_once LUC_SP_PATH . 'includes/frontend.php';

add_action('plugins_loaded', __NAMESPACE__ . '\\boot');

function boot()
{
    if (! class_exists('WooCommerce')) {
        return;
    }

    add_action(
        'wp_enqueue_scripts',
        __NAMESPACE__ . '\\enqueue_assets'
    );

    add_shortcode(
        'luc_stock_privado',
        __NAMESPACE__ . '\\render_shortcode'
    );
}
