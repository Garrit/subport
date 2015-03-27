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

$app->post('/submit', function ()
{
    $submission = [];
    $submission['language'] = $_POST['language'];
    $submission['problem'] = $_POST['problem'];

    $submission['entryPoint'] = basename($_FILES['source']['name']);
    $entryPointLength = strlen($submission['entryPoint']);
    if (strrpos($submission['entryPoint'], 'java') == $entryPointLength - 4)
        $submission['entryPoint'] = substr($submission['entryPoint'], 0, $entryPointLength - 5);

    $source_path = $_FILES['source']['tmp_name'];
    $source_file = fopen($source_path, 'rb');
    $source = fread($source_file, filesize($source_path));
    fclose($source_file);

    $source_filename = basename($_FILES['source']['name']);

    $submission['files'] = [[
        'filename' => $source_filename,
        'contents' => base64_encode($source)
    ]];

    $request = curl_init();
    curl_setopt($request, CURLOPT_URL, NEGOTIATOR . '/execute');
    curl_setopt($request, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($request, CURLOPT_POST, 1);
    curl_setopt($request, CURLOPT_POSTFIELDS, json_encode($submission)); 
    curl_setopt($request, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

    $response = curl_exec($request);

    if ($response === false)
        return;

    if (!file_exists('submissions'))
        mkdir('submissions');

    $submission_file = fopen('submissions/' . json_decode($response)->id . '.json', 'wb');
    fwrite($submission_file, $response);
    fclose($submission_file);

    echo $response;
});

$app->run();