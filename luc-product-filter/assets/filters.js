jQuery(function ($) {
    $('.luc-range').each(function () {
        const $control = $(this);
        const $slider = $control.find('.luc-range__slider');

        const $minInput = $control.find('.luc-range__min');
        const $maxInput = $control.find('.luc-range__max');

        const $minLabel = $control.find('.luc-range__min-label');
        const $maxLabel = $control.find('.luc-range__max-label');

        const rangeMin = Number($control.attr('data-min'));
        const rangeMax = Number($control.attr('data-max'));
        const step = Number($control.attr('data-step'));

        const currentMin = Number(
            $control.attr('data-current-min')
        );

        const currentMax = Number(
            $control.attr('data-current-max')
        );

        function updateValues(values) {
            $minInput.val(values[0]);
            $maxInput.val(values[1]);

            $minLabel.text(values[0]);
            $maxLabel.text(values[1]);
        }

        if (
            typeof $.fn.slider !== 'function'
            || rangeMin === rangeMax
        ) {
            return;
        }

        $slider.slider({
            range: true,
            min: rangeMin,
            max: rangeMax,
            step: step,
            values: [currentMin, currentMax],

            slide: function (event, ui) {
                updateValues(ui.values);
            },

            change: function (event, ui) {
                if (event.originalEvent) {
                    updateValues(ui.values);
                }
            }
        });
    });

    $('.luc-filters').on('submit', function () {
        /*
         * No enviar límites vacíos si el usuario
         * todavía no ha utilizado el slider.
         */
        $(this)
            .find('.luc-range__min, .luc-range__max')
            .each(function () {
                this.disabled = this.value.trim() === '';
            });
    });
});