<?php

namespace LUC\ProductFilters;

defined('ABSPATH') || exit;

function filter_definitions()
{
    return [
        'potencia_maxima' => [
            'type'     => 'range',
            'label'    => 'Potencia máxima',
            'taxonomy' => 'pa_potencia-maxima',
            'params'   => [
                'min' => 'potencia_maxima_min',
                'max' => 'potencia_maxima_max',
            ],
            'step' => 1,
        ],

        'regulacion' => [
            'type'     => 'checkbox',
            'label'    => 'Regulación',
            'taxonomy' => 'pa_regulacion',
            'param'    => 'regulacion',
        ],

        'formato' => [
            'type'     => 'checkbox',
            'label'    => 'Formato',
            'taxonomy' => 'pa_formato',
            'param'    => 'formato',
        ],

        'proteccion' => [
            'type'     => 'checkbox',
            'label'    => 'Protección',
            'taxonomy' => 'pa_proteccion',
            'param'    => 'proteccion',
        ],
    ];
}

/**
 * Parámetros ajenos al plugin que conserva el formulario.
 */
function preserved_parameter_names()
{
    return [
        'orderby',
        's',
        'post_type',
    ];
}