<?php

namespace LUC\StockPrivado;

defined('ABSPATH') || exit;

/**
 * Carga los estilos base del plugin.
 *
 * Se pueden desactivar con el filtro luc_stock_cargar_css.
 */
function enqueue_assets()
{
    if (! apply_filters('luc_stock_cargar_css', true)) {
        return;
    }

    wp_enqueue_style(
        'luc-stock-privado',
        LUC_SP_URL . 'assets/stock-privado.css',
        [],
        LUC_SP_VERSION
    );
}

/**
 * Renderiza el shortcode [luc_stock_privado].
 *
 * Atributos:
 * - id:             ID del producto. Por defecto, el producto actual.
 * - etiqueta:       Texto sobre el valor. Vacío para ocultarla.
 * - texto_invitado: Mensaje mostrado a los visitantes sin sesión.
 * - enlace_login:   "si" convierte el mensaje en enlace a la página de acceso.
 * - cantidad:       "si" muestra la cifra exacta; "no" solo el estado.
 * - icono:          Vacío (automático), "oculto" o HTML propio.
 */
function render_shortcode($atts = [])
{
    $atts = shortcode_atts(
        [
            'id'             => 0,
            'etiqueta'       => 'Disponibilidad',
            'texto_invitado' => 'Inicia sesión para ver stock disponible',
            'enlace_login'   => 'no',
            'cantidad'       => 'si',
            'icono'          => '',
        ],
        $atts,
        'luc_stock_privado'
    );

    $producto = producto_actual(absint($atts['id']));

    if (! $producto instanceof \WC_Product) {
        return '';
    }

    /*
     * Permite decidir quién puede ver el stock
     * (por ejemplo, limitarlo a un rol de cliente B2B).
     */
    $logueado = (bool) apply_filters(
        'luc_stock_usuario_puede_ver',
        is_user_logged_in(),
        $producto
    );

    /*
     * La cantidad solo se calcula para usuarios con permiso:
     * los visitantes nunca reciben el dato en el HTML.
     */
    $cantidad = null;

    if ($logueado && atributo_es_si($atts['cantidad'])) {
        $cantidad = cantidad_disponible($producto);
    }

    $estado = estado_stock($logueado, $producto, $cantidad);

    $clases = array_unique(
        apply_filters(
            'luc_stock_clases',
            [
                'luc-stock',
                'luc-stock--' . ($logueado ? 'logueado' : 'invitado'),
                'luc-stock--' . $estado,
            ],
            $logueado,
            $producto
        )
    );

    $etiqueta = trim(
        (string) apply_filters('luc_stock_etiqueta', $atts['etiqueta'], $producto)
    );

    $icono = icono_shortcode($atts['icono'], $logueado);

    // Variables que consume templates/stock-privado.php.
    $producto_id = $producto->get_id();
    $texto_invitado = '';
    $url_login = null;
    $unidad_texto = '';
    $texto_estado = '';

    if ($logueado) {
        if ('con-cantidad' === $estado) {
            $unidad_texto = 1 === (int) $cantidad
                ? 'unidad disponible'
                : 'unidades disponibles';
        } else {
            $texto_estado = texto_por_estado($estado, $producto);
        }
    } else {
        $texto_invitado = (string) apply_filters(
            'luc_stock_texto_invitado',
            $atts['texto_invitado'],
            $producto
        );

        if (atributo_es_si($atts['enlace_login'])) {
            $destino = get_permalink($producto_id);
            $url_login = wp_login_url($destino ? $destino : home_url('/'));
        }
    }

    ob_start();

    include LUC_SP_PATH . 'templates/stock-privado.php';

    /**
     * Permite reemplazar por completo el HTML generado.
     */
    return apply_filters(
        'luc_stock_html',
        ob_get_clean(),
        $atts,
        $producto,
        $logueado,
        $estado
    );
}

/**
 * Resuelve el atributo icono: automático, oculto o HTML propio.
 */
function icono_shortcode($icono, $logueado)
{
    $icono = trim((string) $icono);

    if ('oculto' === strtolower($icono)) {
        return '';
    }

    if ('' === $icono) {
        return icono_por_defecto($logueado);
    }

    return wp_kses_post($icono);
}

/**
 * Comprueba si un valor de atributo equivale a "sí".
 */
function atributo_es_si($valor)
{
    return in_array(
        strtolower(trim((string) $valor)),
        ['si', 'sí', 'yes', 'true', '1', 'on'],
        true
    );
}
