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

class helloworld extends application {
	
	public function init() {
		$this->add_application_method('say', 'sayHello', Array(), 'Say hello!',false);
	}
	
	public function sayHello ($attributes) {
		return 'Hello ' . (isset($attributes['to']) ? $attributes['to'] : 'world') . '!'; 
	}
	
}

?>
