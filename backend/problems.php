<?php

function read_problem($problem_name)
{
    $problem_file = PROBLEMS_PATH . '/' . $problem_name . '/problem.json';
    $problem = json_decode(file_get_contents($problem_file));

    if (isset($problem->descriptionFile))
    {
        $description_file = dirname($problem_file) . '/' . $problem->descriptionFile;
        $problem->description = file_get_contents($description_file);
    }

    return $problem;
}