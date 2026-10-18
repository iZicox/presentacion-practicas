<?php

namespace LUC\StockPrivado;

defined('ABSPATH') || exit;

/**
 * Devuelve el producto del contexto actual o el indicado por ID.
 *
 * Orden de búsqueda:
 * 1. ID explícito pasado al shortcode.
 * 2. Objeto global $product de WooCommerce.
 * 3. Producto del loop o de la consulta actual.
 */
function producto_actual($id = 0)
{
    if ($id > 0) {
        $producto = wc_get_product($id);

        return $producto instanceof \WC_Product ? $producto : null;
    }

    global $product;

    if ($product instanceof \WC_Product) {
        return $product;
    }

    $post_id = get_the_ID();

    if ($post_id) {
        $producto = wc_get_product($post_id);

        if ($producto instanceof \WC_Product) {
            return $producto;
        }
    }

    $objeto = get_queried_object();

    if ($objeto instanceof \WP_Post && 'product' === $objeto->post_type) {
        $producto = wc_get_product($objeto->ID);

        if ($producto instanceof \WC_Product) {
            return $producto;
        }
    }

    return null;
}

/**
 * Cantidad disponible del producto o null si no gestiona stock.
 *
 * En productos variables se suman las cantidades de las variaciones
 * que gestionan stock.
 *
 * El filtro luc_stock_cantidad permite sustituir la fuente del dato
 * (por ejemplo, por el stock de un ERP).
 */
function cantidad_disponible(\WC_Product $producto)
{
    $cantidad = null;

    if ($producto->is_type('variable')) {
        $total = 0;
        $gestiona = false;

        foreach ($producto->get_children() as $variacion_id) {
            $variacion = wc_get_product($variacion_id);

            if (! $variacion instanceof \WC_Product) {
                continue;
            }

            $stock = $variacion->get_stock_quantity();

            if ($variacion->managing_stock() && null !== $stock) {
                $total += (int) $stock;
                $gestiona = true;
            }
        }

        if ($gestiona) {
            $cantidad = $total;
        }
    } else {
        $stock = $producto->get_stock_quantity();

        if ($producto->managing_stock() && null !== $stock) {
            $cantidad = (int) $stock;
        }
    }

    return apply_filters('luc_stock_cantidad', $cantidad, $producto);
}

/**
 * Estado que define las clases CSS y el texto mostrado.
 *
 * Valores: invitado | con-cantidad | disponible | bajo-pedido | agotado.
 */
function estado_stock($logueado, \WC_Product $producto, $cantidad = null)
{
    if (! $logueado) {
        return 'invitado';
    }

    if (! $producto->is_in_stock()) {
        return 'agotado';
    }

    if (null !== $cantidad && (int) $cantidad > 0) {
        return 'con-cantidad';
    }

    if ('onbackorder' === $producto->get_stock_status()) {
        return 'bajo-pedido';
    }

    return 'disponible';
}

/**
 * Texto mostrado cuando el producto no tiene cantidad numérica.
 */
function texto_por_estado($estado, \WC_Product $producto)
{
    $textos = [
        'disponible'  => 'Disponible',
        'bajo-pedido' => 'Disponible bajo pedido',
        'agotado'     => 'Agotado',
    ];

    $texto = $textos[$estado] ?? $textos['agotado'];

    return apply_filters('luc_stock_texto_estado', $texto, $estado, $producto);
}
