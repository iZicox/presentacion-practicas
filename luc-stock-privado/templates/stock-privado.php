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
 * $cantidad, $unidad_texto, $texto_estado, $texto_invitado, $url_login.
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

                    <span class="luc-stock__mensaje">

                        <?php if (null !== $url_login) : ?>
                            <a
                                class="luc-stock__enlace"
                                href="<?php echo esc_url($url_login); ?>"
                            >
                                <?php echo esc_html($texto_invitado); ?>
                            </a>
                        <?php else : ?>
                            <?php echo esc_html($texto_invitado); ?>
                        <?php endif; ?>

                    </span>

                <?php elseif ('con-cantidad' === $estado) : ?>

                    <span class="luc-stock__cantidad">
                        <?php echo esc_html(number_format_i18n($cantidad)); ?>
                    </span>

                    <span class="luc-stock__unidad">
                        <?php echo esc_html($unidad_texto); ?>
                    </span>

                <?php else : ?>

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
