Handlebars.registerHelper('marked', function (contents) {
    return new Handlebars.SafeString(marked(contents));
});

var setActiveMenuItem = function (item) {
    $('li.active').removeClass('active');
    $('#' + item + '-menu-item').addClass('active');
}

var renderTemplate = function (template, contents, callback) {
    $.get(template + '.html', function (source) {
        var template = Handlebars.compile(source);
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
        setActiveMenuItem('problems');

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

        $.getJSON('backend/submissions/', function (submissions) {
            submissions = submissions.map(function (submission) {
                if (submission.cases) {
                    var wrong = 0;
                    var runtime = 0;

                    submission.cases.forEach(function (submissionCase) {
                        if (submissionCase.value < submissionCase.valueMax)
                            wrong++;
                        runtime += submissionCase.runtime;
                    });

                    if (wrong > 0)
                        submission.status = 'failed';
                    else
                        submission.status = 'passed';

                    submission.runtime = runtime / 1000 + 's';
                }
                else {
                    submission.status = 'in-progress';
                }

                return submission;
            });

            var contents = {submissions: submissions};

            renderTemplate('submissions', contents, function (template) {
                $('#main').html(template);

                $('.submission-row').click(function () {
                    routie('/submissions/' + $(this).data('submission-id'));
                });
            });
        });
    },
    '/submissions/:id': function (id) {
        setActiveMenuItem('submissions');

        $.getJSON('backend/submissions/' + id, function (submission) {
            $.getJSON('backend/problems/' + submission.problem, function (problem) {

                var cases = {}

                submission.cases.forEach(function (submissionCase) {
                    submissionCase.output = atob(submissionCase.output);
                    submissionCase.runtime /= 1000;
                    cases[submissionCase.name] = submissionCase;
                });

                problem.cases.forEach(function (problemCase) {
                    if (!cases[problemCase.name])
                        return;

                    cases[problemCase.name].referenceOutput = problemCase.output;
                });

                submission.files.forEach(function (file, index, array) {
                    array[index].contents = atob(file.contents);
                });

                var contents = {submission: submission, problem: problem, cases: cases}

                renderTemplate('submission', contents, function (template) {
                    $('#main').html(template);
                });
            });
        });
    }
});

$(document).ready(function () {
    if (window.location.hash.length == 0)
        routie('/problems');
});