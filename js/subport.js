Handlebars.registerHelper('marked', function (contents) {
    return new Handlebars.SafeString(marked(contents));
});

var setActiveMenuItem = function (item) {
    $('li.active').removeClass('active');
    $('#' + item + '-menu-item').addClass('active');
}

var renderTemplate = function (template, contents, callback) {
    $.get(template + '.html', function (source) {
        template = Handlebars.compile(source);
        callback(template(contents));
    })
};

routie({
    '/problems': function () {
        setActiveMenuItem('problems');

        $.getJSON('backend/problems', function (problems) {
            contents = {problems: problems};
            renderTemplate('problems', contents, function (template) {
                $('#main').html(template);
            });
        });
    },
    '/problems/:name': function (name) {

        $.getJSON('backend/problems/' + name, function (problem) {
            renderTemplate('problem', problem, function (template) {
                $('#main').html(template);
                $('#submission-form').submit(function (ev) {
                    ev.preventDefault();

                    $(this).ajaxSubmit({
                        success: function (response) {
                            $('#form-submitting').hide();
                            $('#form-submitted').show();
                        }
                    });

                    $(this).hide();
                    $('#form-submitting').show();
                });
            });
        });
    },
    '/submissions': function () {
        setActiveMenuItem('submissions');

        renderTemplate('submissions', {}, function (template) {
            $('#main').html(template);
        });
    }
});

$(document).ready(function () {
    if (window.location.hash.length == 0)
        routie('/problems');
});