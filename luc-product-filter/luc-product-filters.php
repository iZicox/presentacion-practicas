<?php
/**
 * Plugin Name: LUC Product Filters
 * Description: Filtros de productos WooCommerce por atributos, mediante rangos y casillas.
 * Version: 1.0.0
 * Requires PHP: 7.4
 * Author: Leds Universal Components
 */

namespace LUC\ProductFilters;

defined('ABSPATH') || exit;

define('LUC_PF_PATH', plugin_dir_path(__FILE__));
define('LUC_PF_URL', plugin_dir_url(__FILE__));
define('LUC_PF_VERSION', '1.0.1');

require_once LUC_PF_PATH . 'includes/config.php';
require_once LUC_PF_PATH . 'includes/terms.php';
require_once LUC_PF_PATH . 'includes/request.php';
require_once LUC_PF_PATH . 'includes/query.php';
require_once LUC_PF_PATH . 'includes/frontend.php';

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

    add_action(
        'woocommerce_product_query',
        __NAMESPACE__ . '\\apply_product_filters',
        20
    );

    add_shortcode(
        'luc_filtros_productos',
        __NAMESPACE__ . '\\render_shortcode'
    );

    // Compatibilidad con el shortcode anterior.
    add_shortcode(
        'filtro_rango_potencia_maxima',
        __NAMESPACE__ . '\\render_shortcode'
    );
}