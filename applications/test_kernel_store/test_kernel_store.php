<?php

/**
 * [APP DESCRIPTION]
 *
 * @package		Comodojo Core Applications
 * @author		comodojo.org
 * @copyright	__COPYRIGHT__ comodojo.org (info@comodojo.org)
 * @version		__CURRENT_VERSION__
 * @license		GPL Version 3
 */

class test_kernel_store extends application {
	
	public function init() {
		//$this->add_application_method('METHOD', 'LOCAL_METHOD', Array(), 'DESCRIPTION',CACHE);
		$this->add_store_methods('test');
	}
	
}

?>