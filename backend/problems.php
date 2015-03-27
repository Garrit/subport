<?php

function read_problem($problem_name)
{
    $problem_file = PROBLEMS_PATH . '/' . $problem_name . '/problem.json';
    $problem = json_decode(file_get_contents($problem_file));

    populate_property_from_file($problem, $problem_file, 'descriptionFile', 'description');

    foreach ($problem->samples as &$sample)
    {
        populate_property_from_file($sample, $problem_file, 'inputFile', 'input');
        populate_property_from_file($sample, $problem_file, 'outputFile', 'output');
    }

    foreach ($problem->cases as &$case)
    {
        populate_property_from_file($case, $problem_file, 'inputFile', 'input');
        populate_property_from_file($case, $problem_file, 'outputFile', 'output');
    }

    return $problem;
}

function populate_property_from_file(&$obj, $problem_file, $src_prop, $target_prop)
{
    if (!isset($obj->{$src_prop}))
        return;

    $file = dirname($problem_file) . '/' . $obj->{$src_prop};
    $obj->{$target_prop} = file_get_contents($file);
    unset($obj->{$src_prop});
}