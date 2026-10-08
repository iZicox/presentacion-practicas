<?php

namespace LUC\ProductFilters;

defined('ABSPATH') || exit;
?>

<fieldset class="luc-filter luc-checkbox">

    <legend>
        <?php echo esc_html($control['label']); ?>
    </legend>

    <div class="luc-checkbox__options">

        <?php foreach ($control['options'] as $term) : ?>

            <label class="luc-checkbox__option">

                <input
                    type="checkbox"
                    name="<?php echo esc_attr($control['param']); ?>[]"
                    value="<?php echo esc_attr($term->slug); ?>"
                    <?php
                    checked(
                        in_array(
                            $term->slug,
                            $control['value'],
                            true
                        )
                    );
                    ?>
                >

                <span>
                    <?php echo esc_html($term->name); ?>
                </span>

            </label>

        <?php endforeach; ?>

    </div>
</fieldset>