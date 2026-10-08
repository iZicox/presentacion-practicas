<?php

namespace LUC\ProductFilters;

defined('ABSPATH') || exit;
?>

<fieldset
    class="luc-filter luc-range"
    data-min="<?php echo esc_attr($control['min']); ?>"
    data-max="<?php echo esc_attr($control['max']); ?>"
    data-step="<?php echo esc_attr($control['step']); ?>"
    data-current-min="<?php echo esc_attr($control['current_min']); ?>"
    data-current-max="<?php echo esc_attr($control['current_max']); ?>"
>
    <legend>
        <?php echo esc_html($control['label']); ?>
    </legend>

    <div class="luc-range__summary" aria-live="polite">
        <span class="luc-range__min-label">
            <?php echo esc_html($control['current_min']); ?>
        </span>
        –
        <span class="luc-range__max-label">
            <?php echo esc_html($control['current_max']); ?>
        </span>
    </div>

    <div class="luc-range__slider"></div>

    <input
        type="hidden"
        class="luc-range__min"
        name="<?php echo esc_attr($control['params']['min']); ?>"
        value="<?php echo esc_attr($control['value']['min'] ?? ''); ?>"
    >

    <input
        type="hidden"
        class="luc-range__max"
        name="<?php echo esc_attr($control['params']['max']); ?>"
        value="<?php echo esc_attr($control['value']['max'] ?? ''); ?>"
    >
</fieldset>