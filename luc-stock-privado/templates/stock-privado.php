<?php

namespace LUC\StockPrivado;

defined('ABSPATH') || exit;

/*
 * Plantilla del shortcode [luc_stock_privado].
 *
 * La estructura es la misma para visitantes y usuarios con sesión:
 * solo cambian las clases del contenedor y el contenido de
 * .luc-stock__valor.
 *
 * Variables recibidas desde render_shortcode():
 * $clases, $producto_id, $estado, $icono, $etiqueta, $logueado,
 * $cantidad, $unidad_texto, $texto_estado, $texto_invitado,
 * $texto_login, $texto_registro, $url_login, $url_registro.
 */
?>

<div
    class="<?php echo esc_attr(implode(' ', $clases)); ?>"
    data-luc-stock
    data-producto="<?php echo esc_attr($producto_id); ?>"
    data-estado="<?php echo esc_attr($estado); ?>"
>
    <div class="luc-stock__contenido">

        <?php if ('' !== $icono) : ?>
            <span
                class="luc-stock__icono"
                aria-hidden="true"
            >
                <?php echo $icono; // SVG propio o HTML saneado antes de llegar aquí. ?>
            </span>
        <?php endif; ?>

        <div class="luc-stock__texto">

            <?php if ('' !== $etiqueta) : ?>
                <span class="luc-stock__etiqueta">
                    <?php echo esc_html($etiqueta); ?>
                </span>
            <?php endif; ?>

            <span class="luc-stock__valor">

                <?php if (! $logueado) : ?>

                    <?php
                    /*
                     * Estado invitado: mensaje y, debajo, los enlaces de
                     * acceso y registro. Cada enlace es un <a> independiente
                     * para que el navegador los detecte y sean clicables.
                     */
                    ?>

                    <span class="luc-stock__mensaje">
                        <?php echo esc_html($texto_invitado); ?>
                    </span>

                    <?php if (null !== $url_login || null !== $url_registro) : ?>
                        <span class="luc-stock__acciones">

                            <?php if (null !== $url_login) : ?>
                                <a
                                    class="luc-stock__enlace luc-stock__enlace--login"
                                    href="<?php echo esc_url($url_login); ?>"
                                >
                                    <?php echo esc_html($texto_login); ?>
                                </a>
                            <?php endif; ?>

                            <?php
                            /*
                             * El punto separador solo se muestra cuando
                             * existen los dos enlaces.
                             */
                            ?>
                            <?php if (null !== $url_login && null !== $url_registro) : ?>
                                <span
                                    class="luc-stock__separador"
                                    aria-hidden="true"
                                >·</span>
                            <?php endif; ?>

                            <?php if (null !== $url_registro) : ?>
                                <a
                                    class="luc-stock__enlace luc-stock__enlace--registro"
                                    href="<?php echo esc_url($url_registro); ?>"
                                >
                                    <?php echo esc_html($texto_registro); ?>
                                </a>
                            <?php endif; ?>

                        </span>
                    <?php endif; ?>

                <?php elseif ('con-cantidad' === $estado) : ?>

                    <?php
                    /*
                     * Usuario con sesión y stock numérico: mostramos la
                     * cifra exacta y su unidad ("unidad/unidades disponibles").
                     */
                    ?>

                    <span class="luc-stock__cantidad">
                        <?php echo esc_html(number_format_i18n($cantidad)); ?>
                    </span>

                    <span class="luc-stock__unidad">
                        <?php echo esc_html($unidad_texto); ?>
                    </span>

                <?php else : ?>

                    <?php
                    /*
                     * Usuario con sesión sin cifra numérica: mostramos el
                     * estado textual (Disponible, bajo pedido o Agotado).
                     */
                    ?>

                    <span
                        class="luc-stock__estado luc-stock__estado--<?php echo esc_attr($estado); ?>"
                    >
                        <?php echo esc_html($texto_estado); ?>
                    </span>

                <?php endif; ?>

            </span>

        </div>

    </div>
</div>
