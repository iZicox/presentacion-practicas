/**
 * Filtro de rango doble para el atributo global pa_potencia-maxima.
 *
 * Shortcode:
 * [filtro_rango_potencia_maxima]
 *
 * URL generada:
 * ?potencia_maxima_min=20&potencia_maxima_max=60
 */


/**
 * 1. Cargar jQuery UI Slider y sus estilos.
 */
function fr_potencia_maxima_slider_assets()
{
    if (is_shop() || is_product_taxonomy() || is_product_category()) {

        wp_enqueue_script('jquery-ui-slider');

        wp_enqueue_style(
            'fr-potencia-maxima-slider-jquery-ui',
            'https://code.jquery.com/ui/1.13.3/themes/smoothness/jquery-ui.css',
            array(),
            '1.13.3'
        );
    }
}

add_action(
    'wp_enqueue_scripts',
    'fr_potencia_maxima_slider_assets'
);


/**
 * 2. Mostrar el slider doble.
 */
function fr_potencia_maxima_range_filter_shortcode()
{
    $taxonomy = 'pa_potencia-maxima';

    /*
     * Obtiene los términos numéricos disponibles del atributo.
     */
    $terms = get_terms(
        array(
            'taxonomy'   => $taxonomy,
            'hide_empty' => true,
        )
    );

    if (is_wp_error($terms) || empty($terms)) {
        return '<p>No hay valores disponibles para Potencia máxima.</p>';
    }

    $numeric_values = array();

    foreach ($terms as $term) {
        if (is_numeric($term->name)) {
            $numeric_values[] = (float) $term->name;
        }
    }

    if (empty($numeric_values)) {
        return '<p>El atributo Potencia máxima no contiene valores numéricos.</p>';
    }

    sort($numeric_values, SORT_NUMERIC);

    $range_min = min($numeric_values);
    $range_max = max($numeric_values);

    $current_min = isset($_GET['potencia_maxima_min'])
        ? (float) wc_clean(wp_unslash($_GET['potencia_maxima_min']))
        : $range_min;

    $current_max = isset($_GET['potencia_maxima_max'])
        ? (float) wc_clean(wp_unslash($_GET['potencia_maxima_max']))
        : $range_max;

    $current_min = max($range_min, min($current_min, $range_max));
    $current_max = max($range_min, min($current_max, $range_max));

    if ($current_min > $current_max) {
        $temporary   = $current_min;
        $current_min = $current_max;
        $current_max = $temporary;
    }

    $shop_url = wc_get_page_permalink('shop');

    ob_start();
    ?>

    <form
        class="fr-potencia-maxima-range-form"
        method="get"
        action="<?php echo esc_url($shop_url); ?>">

        <div class="fr-potencia-maxima-range-filter">

            <label for="fr-potencia-maxima-slider">
                Potencia máxima:
                <span id="fr-potencia-maxima-min-label">
                    <?php echo esc_html($current_min); ?>
                </span>
                -
                <span id="fr-potencia-maxima-max-label">
                    <?php echo esc_html($current_max); ?>
                </span>
            </label>

            <div
                id="fr-potencia-maxima-slider"
                data-min="<?php echo esc_attr($range_min); ?>"
                data-max="<?php echo esc_attr($range_max); ?>"
                data-current-min="<?php echo esc_attr($current_min); ?>"
                data-current-max="<?php echo esc_attr($current_max); ?>">
            </div>

            <input
                type="hidden"
                id="fr-potencia-maxima-min"
                name="potencia_maxima_min"
                value="<?php echo esc_attr($current_min); ?>">

            <input
                type="hidden"
                id="fr-potencia-maxima-max"
                name="potencia_maxima_max"
                value="<?php echo esc_attr($current_max); ?>">

            <button type="submit">
                Filtrar
            </button>

            <a href="<?php echo esc_url($shop_url); ?>">
                Limpiar
            </a>

        </div>

        <?php
        /*
         * Conserva otros parámetros de la URL,
         * excepto los del propio filtro y la paginación.
         */
        foreach ($_GET as $key => $value) {

            if (
                in_array(
                    $key,
                    array(
                        'potencia_maxima_min',
                        'potencia_maxima_max',
                        'paged',
                    ),
                    true
                )
            ) {
                continue;
            }

            if (is_array($value)) {
                foreach ($value as $sub_key => $sub_value) {
                    printf(
                        '<input type="hidden" name="%1$s[%2$s]" value="%3$s">',
                        esc_attr($key),
                        esc_attr($sub_key),
                        esc_attr(wp_unslash($sub_value))
                    );
                }
            } else {
                printf(
                    '<input type="hidden" name="%1$s" value="%2$s">',
                    esc_attr($key),
                    esc_attr(wp_unslash($value))
                );
            }
        }
        ?>

    </form>

    <script>
        jQuery(function($) {

            const slider = $('#fr-potencia-maxima-slider');

            if (!slider.length) {
                return;
            }

            const rangeMin = parseFloat(slider.data('min'));
            const rangeMax = parseFloat(slider.data('max'));
            const currentMin = parseFloat(slider.data('current-min'));
            const currentMax = parseFloat(slider.data('current-max'));

            slider.slider({
                range: true,
                min: rangeMin,
                max: rangeMax,
                step: 1,
                values: [currentMin, currentMax],

                slide: function(event, ui) {
                    $('#fr-potencia-maxima-min').val(ui.values[0]);
                    $('#fr-potencia-maxima-max').val(ui.values[1]);

                    $('#fr-potencia-maxima-min-label').text(ui.values[0]);
                    $('#fr-potencia-maxima-max-label').text(ui.values[1]);
                }
            });
        });
    </script>

    <?php
    return ob_get_clean();
}

add_shortcode(
    'filtro_rango_potencia_maxima',
    'fr_potencia_maxima_range_filter_shortcode'
);


/**
 * 3. Filtrar los productos según potencia_maxima_min
 *    y potencia_maxima_max.
 */
function fr_filter_products_by_potencia_maxima_range($query)
{
    if (is_admin() || ! $query->is_main_query()) {
        return;
    }

    if (
        ! is_shop()
        && ! is_product_taxonomy()
        && ! is_product_category()
    ) {
        return;
    }

    $has_min = isset($_GET['potencia_maxima_min'])
        && is_numeric(wp_unslash($_GET['potencia_maxima_min']));

    $has_max = isset($_GET['potencia_maxima_max'])
        && is_numeric(wp_unslash($_GET['potencia_maxima_max']));

    if (! $has_min && ! $has_max) {
        return;
    }

    $min_potencia = $has_min
        ? (float) wc_clean(wp_unslash($_GET['potencia_maxima_min']))
        : null;

    $max_potencia = $has_max
        ? (float) wc_clean(wp_unslash($_GET['potencia_maxima_max']))
        : null;

    $taxonomy = 'pa_potencia-maxima';

    $terms = get_terms(
        array(
            'taxonomy'   => $taxonomy,
            'hide_empty' => false,
        )
    );

    if (is_wp_error($terms) || empty($terms)) {
        return;
    }

    $matching_term_ids = array();

    foreach ($terms as $term) {

        if (! is_numeric($term->name)) {
            continue;
        }

        $potencia_value = (float) $term->name;

        if (null !== $min_potencia && $potencia_value < $min_potencia) {
            continue;
        }

        if (null !== $max_potencia && $potencia_value > $max_potencia) {
            continue;
        }

        $matching_term_ids[] = (int) $term->term_id;
    }

    $tax_query = (array) $query->get('tax_query');

    /*
     * Si no hay términos coincidentes, fuerza cero resultados.
     */
    if (empty($matching_term_ids)) {
        $tax_query[] = array(
            'taxonomy' => $taxonomy,
            'field'    => 'term_id',
            'terms'    => array(-1),
        );
    } else {
        $tax_query[] = array(
            'taxonomy' => $taxonomy,
            'field'    => 'term_id',
            'terms'    => $matching_term_ids,
            'operator' => 'IN',
        );
    }

    $query->set('tax_query', $tax_query);
}

add_action(
    'woocommerce_product_query',
    'fr_filter_products_by_potencia_maxima_range'
);