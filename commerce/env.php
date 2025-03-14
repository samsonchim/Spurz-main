<?php
/*This is the env.php file
This file is used to load the environment variables from the .env file
This file should be included in the main file where the environment variables are needed
This file should be included at the top of the main file */
function loadEnv($file = '.env') {
    if (!file_exists($file)) {
        return;
    }

    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue; // Skip comments
        }
        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        if (!array_key_exists($key, $_ENV)) {
            $_ENV[$key] = $value;
        }
    }
}


/*For more security you can do the following
 1. Ensure .env is not accessible from the web
    Add this to .htaccess (for Apache servers):

    <Files .env>
    Order allow,deny
    Deny from all
    </Files>

2. or For Ngix server add this to the configuration file:

    location ~ /\.env {
    deny all;
    }
*/