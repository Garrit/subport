<?php

require 'vendor/autoload.php';
require 'config.php';

require 'problems.php';

$app = new \Slim\Slim();
$app->response->headers->set('Content-Type', 'application/json');

$app->get('/problems/', function ()
{
    $problems = [];

    foreach (glob(PROBLEMS_PATH . '/*', GLOB_ONLYDIR) as $problem_path)
    {
        $problem = read_problem(basename($problem_path));
        $problems[$problem->name] = $problem;
    }

    echo json_encode($problems);
});

$app->get('/problems/:name', function ($problem_name)
{
    $problem_name = preg_replace('/[^A-Za-z0-9]/', '', $problem_name);
    echo json_encode(read_problem(basename($problem_name)));
});

$app->run();