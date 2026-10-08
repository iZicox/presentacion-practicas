<?php

namespace LUC\ProductFilters;

defined('ABSPATH') || exit;

function enqueue_assets()
{
    wp_enqueue_style(
        'luc-product-filters',
        LUC_PF_URL . 'assets/filters.css',
        [],
        LUC_PF_VERSION
    );

    wp_enqueue_script(
        'luc-product-filters',
        LUC_PF_URL . 'assets/filters.js',
        [
            'jquery',
            'jquery-ui-slider',
            'jquery-touch-punch',
        ],
        LUC_PF_VERSION,
        true
    );
}
function filter_action_url()
{
    if (is_product_taxonomy()) {
        $term = get_queried_object();

        if ($term instanceof \WP_Term) {
            $url = get_term_link($term);

            if (! is_wp_error($url)) {
                return $url;
            }
        }
    }

    return wc_get_page_permalink('shop');
}

function build_form_controls(array $definitions, array $values)
{
    $controls = [];

    foreach ($definitions as $key => $definition) {
        if (! taxonomy_exists($definition['taxonomy'])) {
            continue;
        }

        $control = $definition;
        $control['key'] = $key;
        $control['value'] = $values[$key];

        switch ($definition['type']) {
            case 'range':
                $bounds = range_bounds($definition['taxonomy']);

                if (null === $bounds) {
                    continue 2;
                }

                /*
                 * Ampliar el rango visual si la URL solicita
                 * límites externos, para no mostrar unos valores
                 * diferentes de los que aplica la consulta.
                 */
                $requested = array_filter(
                    $values[$key],
                    static function ($value) {
                        return null !== $value;
                    }
                );

                $control['min'] = min(
                    array_merge([$bounds['min']], array_values($requested))
                );

                $control['max'] = max(
                    array_merge([$bounds['max']], array_values($requested))
                );

                $control['current_min'] =
                    $values[$key]['min'] ?? $bounds['min'];

                $control['current_max'] =
                    $values[$key]['max'] ?? $bounds['max'];

                if ($control['current_min'] > $control['current_max']) {
                    $control['current_min'] = $control['min'];
                    $control['current_max'] = $control['max'];
                }

                break;

            case 'checkbox':
                $options = attribute_terms(
                    $definition['taxonomy'],
                    true
                );

                /*
                 * Mantener visibles las opciones seleccionadas,
                 * incluso si actualmente no tienen productos.
                 */
                foreach (
                    attribute_terms($definition['taxonomy'], false)
                    as $term
                ) {
                    if (
                        in_array($term->slug, $values[$key], true)
                        && ! in_array(
                            $term->term_id,
                            array_column($options, 'term_id'),
                            true
                        )
                    ) {
                        $options[] = $term;
                    }
                }

                if (empty($options)) {
                    continue 2;
                }

                $control['options'] = $options;
                break;

            default:
                continue 2;
        }

        $controls[] = $control;
    }

    return $controls;
}

function render_shortcode()
{
    $definitions = filter_definitions();
    $values = read_filter_values($definitions);
    $controls = build_form_controls($definitions, $values);

    if (empty($controls)) {
        return '<p>No hay opciones de filtro disponibles.</p>';
    }

    $action_url = filter_action_url();
    $preserved = preserved_parameters();

    $clear_url = empty($preserved)
        ? $action_url
        : add_query_arg($preserved, $action_url);

    $form_id = wp_unique_id('luc-filters-');

    ob_start();

    include LUC_PF_PATH . 'templates/form.php';

    return ob_get_clean();
}   