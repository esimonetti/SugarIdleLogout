# SugarIdleLogout
Sample implementation of an idle based logout for the Sugar web browser ui valid for both BWC and sidecar functionality

## Notes
The conditions where this customisation applies are very specific for certain uses of the CRM.<br />
The customisation requires all users to be aware that they need to save periodically their work as if the idle timeout is reached and the system is automatically logged out, the non-saved information is permanently lost.<br />

## Requirements
* Tested on Sugar 7.9.0.0
* Tested on Chrome

## Installation
* Copy the full folder structure within `src` to your Sugar system
* Add on `config_override.php` the setting `$sugar_config['additional_js_config']['idle_logout_time'] = 3600;` with a value of more than 60 seconds
* Run a quick repair and rebuild
* Hard refresh your browser's cache
