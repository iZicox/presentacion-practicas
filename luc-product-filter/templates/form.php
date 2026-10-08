<?php

namespace LUC\ProductFilters;

defined('ABSPATH') || exit;
?>

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