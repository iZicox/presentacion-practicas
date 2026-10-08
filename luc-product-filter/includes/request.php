<?php

namespace LUC\ProductFilters;

defined('ABSPATH') || exit;

function request_value($name)
{
    return isset($_GET[$name])
        ? wp_unslash($_GET[$name])
        : null;
}

function selected_slugs($raw)
{
    if (null === $raw) {
        return [];
    }

    $values = is_array($raw) ? $raw : [$raw];
    $slugs = [];

    foreach ($values as $value) {
        if (! is_scalar($value)) {
            continue;
        }

        $slug = sanitize_title((string) $value);

        if ('' !== $slug) {
            $slugs[] = $slug;
        }
    }

    return array_values(array_unique($slugs));
}

function read_range_value(array $definition)
{
    $min = nonnegative_integer(
        request_value($definition['params']['min'])
    );

    $max = nonnegative_integer(
        request_value($definition['params']['max'])
    );

    if (null !== $min && null !== $max && $min > $max) {
        [$min, $max] = [$max, $min];
    }

    /*
     * No limitar aquí los valores a los límites del catálogo:
     * una URL que pide 500–600 debe dar cero resultados si no
     * existen potencias en ese rango.
     */
    return [
        'min' => $min,
        'max' => $max,
    ];
}

function read_filter_values(array $definitions)
{
    $values = [];

    foreach ($definitions as $key => $definition) {
        switch ($definition['type']) {
            case 'range':
                $values[$key] = read_range_value($definition);
                break;

            case 'checkbox':
                $values[$key] = selected_slugs(
                    request_value($definition['param'])
                );
                break;
        }
    }

    return $values;
}

function preserved_parameters()
{
    $result = [];

    foreach (preserved_parameter_names() as $name) {
        $value = request_value($name);

        if (null === $value || ! is_scalar($value)) {
            continue;
        }

        $result[$name] = sanitize_text_field((string) $value);
    }

    return $result;
}