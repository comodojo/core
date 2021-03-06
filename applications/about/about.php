<?php

/**
 * About comodojo
 *
 * @package		Comodojo Core Applications
 * @author		comodojo.org
 * @copyright	__COPYRIGHT__ comodojo.org (info@comodojo.org)
 * @version		__CURRENT_VERSION__
 * @license		GPL Version 3
 */

class about extends application {
	
	public function init() {
		$this->add_application_method('getinfo', 'get_info', Array(), 'About comodojo',true);
	}
	
	public function get_info($params) {
		$info = explode("\n",comodojo_version());
		$index = file_get_contents(COMODOJO_SITE_PATH . "comodojo/others/about.html");
		$index = str_replace("*_ABOUT_PRODUCT_*",$info[0],$index);
		$index = str_replace("*_ABOUT_VERSION_*",$info[1],$index);
		$index = str_replace("*_ABOUT_BUILD_*",$info[2],$index);
		return $index;
	}
	
}

?>
