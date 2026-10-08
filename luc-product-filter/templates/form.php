<?php

namespace LUC\ProductFilters;

defined('ABSPATH') || exit;

$panel_id = $form_id . '-panel';
?>

<div
    class="luc-filters-container"
    data-luc-filters-container
>
    <button
        type="button"
        class="luc-filters-toggle"
        aria-expanded="true"
        aria-controls="<?php echo esc_attr($panel_id); ?>"
    >
        <span class="luc-filters-toggle__label">
            Ocultar filtros
        </span>

        <span
            class="luc-filters-toggle__icon"
            aria-hidden="true"
        ></span>
    </button>

    <div
        class="luc-filters-panel"
        id="<?php echo esc_attr($panel_id); ?>"
    >

        <form
            class="luc-filters"
            method="get"
            action="<?php echo esc_url($action_url); ?>"
        >
            <?php foreach ($controls as $control) : ?>

                <?php
                // El tipo ya ha sido validado en build_form_controls().
                include LUC_PF_PATH
                    . 'templates/'
                    . $control['type']
                    . '.php';
                ?>

            <?php endforeach; ?>

            <?php foreach ($preserved as $name => $value) : ?>

                <input
                    type="hidden"
                    name="<?php echo esc_attr($name); ?>"
                    value="<?php echo esc_attr($value); ?>"
                >

            <?php endforeach; ?>

            <div class="luc-filters__actions">

                <button type="submit">
                    Aplicar filtros
                </button>

                <a href="<?php echo esc_url($clear_url); ?>">
                    Limpiar filtros
                </a>

            </div>
        </form>

    </div>
</div>
