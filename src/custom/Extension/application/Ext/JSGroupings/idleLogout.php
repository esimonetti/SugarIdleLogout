<?php

foreach ($js_groupings as $key => $groupings) {
    foreach  ($groupings as $file => $target) {
        if ($target == 'include/javascript/sugar_sidecar.min.js') {
            $js_groupings[$key]['custom/include/javascript/idleLogout.js'] = 'include/javascript/sugar_sidecar.min.js';
        }
        break;
    }
}
