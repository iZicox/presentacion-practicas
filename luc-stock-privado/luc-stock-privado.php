<?php
/**
 * Plugin Name: LUC Stock Privado
 * Description: Muestra el inventario disponible de un producto solo a usuarios con sesión iniciada. A los visitantes les muestra un aviso con enlaces para iniciar sesión o registrarse. Se inserta en la página de producto con el shortcode [luc_stock_privado]. La estructura base del HTML se comparte en ambos casos, con clases modificadoras para aplicar CSS personalizado (por ejemplo, desde Elementor Pro).
 * Version: 1.1.0
 * Requires PHP: 7.4
 * Author: Leds Universal Components
 */

namespace LUC\StockPrivado;

defined('ABSPATH') || exit;

define('LUC_SP_PATH', plugin_dir_path(__FILE__));
define('LUC_SP_URL', plugin_dir_url(__FILE__));
define('LUC_SP_VERSION', '1.1.0');

/*
 * Archivos del plugin:
 * - stock.php:    consulta de producto, cantidad disponible y estados.
 * - icons.php:    iconos SVG que acompañan al mensaje.
 * - frontend.php: shortcode, enlaces de acceso/registro y estilos.
 */
require_once LUC_SP_PATH . 'includes/stock.php';
require_once LUC_SP_PATH . 'includes/icons.php';
require_once LUC_SP_PATH . 'includes/frontend.php';

add_action('plugins_loaded', __NAMESPACE__ . '\\boot');

/**
 * Arranca el plugin cuando WordPress ya ha cargado el resto de plugins.
 *
 * Se engancha a plugins_loaded para poder comprobar si WooCommerce está
 * activo antes de registrar el shortcode y los estilos. Si WooCommerce
 * no está activo, el plugin no hace nada y no genera errores.
 */
function boot()
{
    if (! class_exists('WooCommerce')) {
        return;
    }

    /*
     * Carga assets/stock-privado.css en el frontend.
     * La función enqueue_assets() comprueba el filtro luc_stock_cargar_css.
     */
    add_action(
        'wp_enqueue_scripts',
        __NAMESPACE__ . '\\enqueue_assets'
    );

    /*
     * Registra [luc_stock_privado], el shortcode que pinta el stock
     * o el aviso con los enlaces de acceso y registro.
     */
    add_shortcode(
        'luc_stock_privado',
        __NAMESPACE__ . '\\render_shortcode'
    );
}
