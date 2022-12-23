function transistor() {

}

function simple_example() {

    transistor(function () {
        document.querySelector('.algolia-search').classList.toggle('is-active');
    });

}

function with_custom_transition() {

    transistor({
        delay: 1000,
        duration: 3000,
        easing: 'linear',
    }, function () {
        document.querySelector('.algolia-search').classList.toggle('is-active');
    });

}

function with_custom_transition_per_property() {

    transistor({
        scale: {delay: 1000},
        translate: {
            x: {easing: 'linear'},
            y: {duration: 3000},
        },
    }, function () {
        document.querySelector('.algolia-search').classList.toggle('is-active');
    });

}

function with_custom_transition_per_element() {

    transistor(function (t) {
        t('.algolia-search', e => e.classList.toggle('is-active'));
        t('.algolia-search__input', {delay: 1000});
    });

}

function with_() {

    transistor(function (t) {
        t('.algolia-search', e => e.classList.toggle('is-active'));
        t('.algolia-search__input', {

        });
    });

}

function adding_an_element_to_the_dom() {

    transistor(function (t) {
        const container = document.querySelector('.algolia-search');
        const message = parseHTML('<div class="transistor">Searching...</div>');
        t(container, e => e.classList.toggle('is-active'));
        t(message, e => e.appendTo(container));
    });

}
