<?php

namespace LUC\ProductFilters;

defined('ABSPATH') || exit;

/**
 * Cache local a esta petición.
 */
function attribute_terms($taxonomy, $hide_empty = true)
{
    static $cache = [];

    $key = $taxonomy . ':' . (int) $hide_empty;

    if (array_key_exists($key, $cache)) {
        return $cache[$key];
    }

    if (! taxonomy_exists($taxonomy)) {
        $cache[$key] = [];
        return [];
    }

    $terms = get_terms([
        'taxonomy'   => $taxonomy,
        'hide_empty' => $hide_empty,
        'orderby'    => 'name',
        'order'      => 'ASC',
    ]);

    $cache[$key] = is_wp_error($terms) ? [] : $terms;

    return $cache[$key];
}

/**
 * Convierte un texto de entero no negativo.
 */
function nonnegative_integer($value)
{
    if (! is_scalar($value)) {
        return null;
    }

    $value = trim((string) $value);

    if ('' === $value || ! ctype_digit($value)) {
        return null;
    }

    // Normalizar ceros iniciales antes de validar el rango de PHP.
    $value = ltrim($value, '0');
    $value = '' === $value ? '0' : $value;

    $number = filter_var(
        $value,
        FILTER_VALIDATE_INT,
        ['options' => ['min_range' => 0]]
    );

    return false === $number ? null : $number;
}

/**
 * Se usan todos los términos para que los límites y la consulta
 * compartan el mismo conjunto de valores.
 */
function numeric_terms($taxonomy)
{
    $result = [];

    foreach (attribute_terms($taxonomy, false) as $term) {
        $number = nonnegative_integer($term->name);

        if (null === $number) {
            continue;
        }

        $result[] = [
            'term_id' => (int) $term->term_id,
            'value'   => $number,
        ];
    }

    return $result;
}

function range_bounds($taxonomy)
{
    $terms = numeric_terms($taxonomy);

    if (empty($terms)) {
        return null;
    }

    $values = array_column($terms, 'value');

    return [
        'min' => min($values),
        'max' => max($values),
    ];
}