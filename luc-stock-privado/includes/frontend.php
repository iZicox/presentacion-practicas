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
 * - id:              ID del producto. Por defecto, el producto actual.
 * - etiqueta:        Texto sobre el valor. Vacío para ocultarla.
 * - texto_invitado:  Mensaje mostrado a los visitantes sin sesión.
 * - enlace_login:    "si" muestra el enlace "Iniciar sesión".
 * - enlace_registro: "si" muestra el enlace "Registrarse".
 * - url_registro:    URL personalizada para el enlace de registro.
 * - texto_login:     Texto del enlace de inicio de sesión.
 * - texto_registro:  Texto del enlace de registro.
 * - cantidad:        "si" muestra la cifra exacta; "no" solo el estado.
 * - icono:           Vacío (automático), "oculto" o HTML propio.
 */
function render_shortcode($atts = [])
{
    $atts = shortcode_atts(
        [
            'id'              => 0,
            'etiqueta'        => 'Disponibilidad',
            'texto_invitado'  => 'Inicia sesión o regístrate para ver stock disponible',
            'enlace_login'    => 'si',
            'enlace_registro' => 'si',
            'url_registro'    => '',
            'texto_login'     => 'Iniciar sesión',
            'texto_registro'  => 'Registrarse',
            'cantidad'        => 'si',
            'icono'           => '',
        ],
        $atts,
        'luc_stock_privado'
    );

    /*
     * Flujo del shortcode:
     * 1. Resolver el producto indicado por id o el producto actual.
     * 2. Decidir si el usuario tiene permiso para ver el stock.
     * 3. Calcular la cantidad y el estado.
     * 4. Preparar los textos y los enlaces del estado invitado.
     * 5. Renderizar templates/stock-privado.php.
     */
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

    /*
     * Variables que consume templates/stock-privado.php.
     *
     * Se inicializan siempre, tanto para visitantes como para usuarios
     * con sesión, para que la plantilla nunca reciba variables sin
     * definir y pueda comprobar los enlaces con null.
     */
    $producto_id = $producto->get_id();
    $texto_invitado = '';
    $texto_login = '';
    $texto_registro = '';
    $url_login = null;
    $url_registro = null;
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
        /*
         * Mensaje principal que ve el visitante antes de los enlaces.
         */
        $texto_invitado = (string) apply_filters(
            'luc_stock_texto_invitado',
            $atts['texto_invitado'],
            $producto
        );

        /*
         * URL de vuelta después de iniciar sesión o registrarse.
         * Si el producto no tiene permalink, usamos la portada.
         */
        $destino = get_permalink($producto_id);
        $destino = $destino ? $destino : home_url('/');

        /*
         * Enlace de inicio de sesión.
         *
         * wp_login_url() recibe la URL de destino: después de introducir
         * las credenciales, WordPress devuelve al usuario al producto.
         */
        if (atributo_es_si($atts['enlace_login'])) {
            $url_login = wp_login_url($destino);

            $texto_login = (string) apply_filters(
                'luc_stock_texto_login',
                $atts['texto_login'],
                $producto
            );
        }

        /*
         * Enlace de registro.
         *
         * Se genera si el atributo enlace_registro está activo o si se
         * ha indicado una URL personalizada en url_registro. La función
         * obtener_url_registro() decide entre la página Mi cuenta de
         * WooCommerce, el registro nativo de WordPress o la URL
         * personalizada.
         */
        $url_registro_personalizada = trim((string) $atts['url_registro']);

        if (
            atributo_es_si($atts['enlace_registro'])
            || '' !== $url_registro_personalizada
        ) {
            $url_registro = obtener_url_registro(
                $destino,
                $url_registro_personalizada
            );

            /*
             * Solo preparamos el texto si hay una URL válida. Si el
             * registro está desactivado, la plantilla ocultará el enlace.
             */
            if (null !== $url_registro) {
                $texto_registro = (string) apply_filters(
                    'luc_stock_texto_registro',
                    $atts['texto_registro'],
                    $producto
                );
            }
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
 * Devuelve la URL del formulario de registro.
 *
 * Orden de prioridad:
 * 1. URL personalizada indicada en el atributo url_registro.
 * 2. Página "Mi cuenta" de WooCommerce, si el registro está activado
 *    en WooCommerce → Ajustes → Cuentas y privacidad.
 * 3. Registro nativo de WordPress, si "Cualquiera puede registrarse"
 *    está activo en Ajustes → Generales.
 * 4. null: no hay un registro disponible. En ese caso la plantilla
 *    oculta el enlace para no enviar al visitante a una página sin
 *    formulario de registro.
 *
 * @param string $destino       URL a la que volver tras el registro nativo.
 * @param string $personalizada URL indicada en el shortcode.
 * @return string|null
 */
function obtener_url_registro($destino, $personalizada = '')
{
    $personalizada = trim((string) $personalizada);

    if ('' !== $personalizada) {
        return $personalizada;
    }

    /*
     * WooCommerce muestra el formulario de registro dentro de la página
     * "Mi cuenta" cuando esta opción está activada. No existe una URL
     * de registro separada, así que enlazamos a esa página.
     */
    if ('yes' === get_option('woocommerce_enable_myaccount_registration')) {
        $cuenta = wc_get_page_permalink('myaccount');

        if ($cuenta) {
            return $cuenta;
        }
    }

    /*
     * Registro nativo de WordPress. Añadimos redirect_to para que, tras
     * crear la cuenta, el usuario vuelva al producto.
     */
    if (get_option('users_can_register')) {
        return add_query_arg('redirect_to', $destino, wp_registration_url());
    }

    return null;
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
