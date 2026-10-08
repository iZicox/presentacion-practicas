<?php

namespace LUC\ProductFilters;

defined('ABSPATH') || exit;

function build_range_clause(array $definition, array $value)
{
    if (null === $value['min'] && null === $value['max']) {
        return null;
    }

    $matching_ids = [];

    foreach (numeric_terms($definition['taxonomy']) as $term) {
        if (
            null !== $value['min']
            && $term['value'] < $value['min']
        ) {
            continue;
        }

        if (
            null !== $value['max']
            && $term['value'] > $value['max']
        ) {
            continue;
        }

        $matching_ids[] = $term['term_id'];
    }

    return [
        'taxonomy'         => $definition['taxonomy'],
        'field'            => 'term_id',
        'terms'            => $matching_ids ?: [0],
        'operator'         => 'IN',
        'include_children' => false,
    ];
}

function build_checkbox_clause(array $definition, array $value)
{
    if (empty($value)) {
        return null;
    }

    return [
        'taxonomy'         => $definition['taxonomy'],
        'field'            => 'slug',
        'terms'            => $value,
        'operator'         => 'IN',
        'include_children' => false,
    ];
}

function build_filter_clauses(array $definitions, array $values)
{
    $clauses = [];

    foreach ($definitions as $key => $definition) {
        if (! taxonomy_exists($definition['taxonomy'])) {
            continue;
        }

        switch ($definition['type']) {
            case 'range':
                $clause = build_range_clause(
                    $definition,
                    $values[$key]
                );
                break;

            case 'checkbox':
                $clause = build_checkbox_clause(
                    $definition,
                    $values[$key]
                );
                break;

            default:
                continue 2;
        }

        if (null !== $clause) {
            $clauses[] = $clause;
        }
    }

    return $clauses;
}

function apply_product_filters($query)
{
    if (is_admin() || ! $query->is_main_query()) {
        return;
    }

    if (! is_shop() && ! is_product_taxonomy()) {
        return;
    }

    $definitions = filter_definitions();
    $values = read_filter_values($definitions);
    $clauses = build_filter_clauses($definitions, $values);

    if (empty($clauses)) {
        return;
    }

    $existing = $query->get('tax_query');

    $tax_query = [
        'relation' => 'AND',
    ];

    if (is_array($existing) && ! empty($existing)) {
        $tax_query[] = $existing;
    }

    foreach ($clauses as $clause) {
        $tax_query[] = $clause;
    }

    $query->set('tax_query', $tax_query);
}