<?php

/** 
 * startup.php
 * 
 * backend class in charge of building environment & controls for a new instance of Comodojo;
 *
 * @package		Comodojo ServerSide Core Packages
 * @author		comodojo.org
 * @copyright	__COPYRIGHT__ comodojo.org (info@comodojo.org)
 * @version		__CURRENT_VERSION__
 * @license		GPL Version 3
 */

require 'comodojo_basic.php';

class comodojo_startup extends comodojo_basic {
	
	public $use_session_transport = true;
	
	public $require_valid_session = false;
	
	public $do_authentication = true;
	
	private $meta = '';
	
	private $js_loader = false;
	
	public function logic($attributes) {
		
		comodojo_load_resource('events');
		$events = new events();
		
		//if(isset($attributes['userName']) AND isset($attributes['userPass'])) $this->auth_login($attributes['userName'], $attributes['userPass']);
		
		try {
			$events->record('SITE_HIT', COMODOJO_USER_NAME);
		}
		catch(Exception $e) {
			comodojo_debug("There was a problem recording event 'SITE_HIT': ".$e->getMessage(),'WARNING','startup');
		}
		
		$this->evalMeta();
		
		$this->header_params['statusCode'] = 200;
		$this->header_params['contentType'] = 'text/html';
		$this->header_params['charset'] = COMODOJO_DEFAULT_ENCODING;
		
		$suspended = $this->shouldSuspend($attributes);
		if ($suspended !== false) {
			return $suspended;
		}
		else {
			
			$this->buildJsLoader($attributes);
			
			return $this->set_template();
			
		}
		
	}
	
	private function evalMeta() {
		
		$metaTags = json2array(COMODOJO_SITE_TAGS);
		
		foreach ($metaTags as $metaTag) {
			if ($metaTag["content"] != "") $this->meta .= "<meta name=\"".$metaTag["name"]."\" content=\"".$metaTag["content"]."\"/>\n";
		}
		
	}
	
	private function shouldSuspend($attributes) {
		
		if (COMODOJO_SITE_SUSPENDED AND COMODOJO_USER_ROLE != 1) {
			
			$index = file_get_contents(COMODOJO_SITE_PATH . "comodojo/templates/web_suspended.html");
			
			$index = str_replace("*_SITETITLE_*",COMODOJO_SITE_TITLE,$index);
			$index = str_replace("*_META_*",$this->meta,$index);
			$index = str_replace("*_SUSPENDEDMESSAGE_*",COMODOJO_SITE_SUSPENDED_MESSAGE,$index);
			$index = str_replace("*_SITEDATE_*",date("Y",strtotime(COMODOJO_SITE_DATE)),$index);
			$index = str_replace("*_SITEAUTHOR_*",COMODOJO_SITE_AUTHOR,$index);
			
			if(isset($attributes['userName']) AND isset($attributes['userPass'])) $index = str_replace("*_DISPLAY_*",'block',$index);
			else $index = str_replace("*_DISPLAY_*",'none',$index);
			
			return $index;
			
		}
		else return false;

	}

	private function buildJsLoader($attributes) {
		
		//****** CSS ******
		$myCssLoader = "
		<link rel=\"stylesheet\" type=\"text/css\" href=\"comodojo/javascript/dojo/resources/dojo.css\" />
		<link rel=\"stylesheet\" type=\"text/css\" href=\"comodojo/javascript/dijit/themes/" . COMODOJO_SITE_THEME_DOJO . "/" . COMODOJO_SITE_THEME_DOJO . ".css\" />
		";
		//*****************
		
		//****** VAR SCRIPT ******
		$myJsLoader = "
			<script type=\"text/javascript\">
			var dojoConfig = {
				async: false,
				parseOnLoad: false,
				baseUrl: '" . COMODOJO_JS_BASE_URL . "',
				waitSeconds: '" . COMODOJO_JS_XD_TIMEOUT . "',
				locale: '" . $this->locale . "',
				has: {
					'dojo-amd-factory-scan': false,
					'dojo-firebug': ".(COMODOJO_JS_DEBUG ? "true" : "false").",
					'dojo-debug-messages': ".(COMODOJO_JS_DEBUG_DEEP ? "true" : "false").",
					'popup': ".(COMODOJO_JS_DEBUG_POPUP ? "true" : "false")."
				}
			};
			
			var comodojoConfig = {
					version: '" . comodojo_version('VERSION') . "',
					debug: " . (COMODOJO_JS_DEBUG ? "true" : "false") . ",
					debugDeep: " . (COMODOJO_JS_DEBUG_DEEP ? "true" : "false") . ",
					userName: " . (is_null(COMODOJO_USER_NAME) ? "false" : "'".COMODOJO_USER_NAME."'") . ",
					userCompleteName: " . (is_null(COMODOJO_USER_COMPLETE_NAME) ? "false" : "'".COMODOJO_USER_COMPLETE_NAME."'") . ",
					userRole: " . (is_null(COMODOJO_USER_ROLE) ? 0 : COMODOJO_USER_ROLE) . ",
					registrationMode: ".COMODOJO_REGISTRATION_MODE.",
					locale: '" . $this->locale . "',
					phpLocale: '" . $this->locale . "',
					queryString: " . array2json($attributes) . ",
					dojoTheme: '" . COMODOJO_SITE_THEME_DOJO . "',
					defaultContainer: '" . COMODOJO_SITE_DEFAULT_CONTAINER . "',
					serverTimezoneOffset: '" . getServerTimezoneOffset() . "',
					siteUrl: '" . getSiteUrl() . "'";
		if ($this->unsupported_locale != false) {
			$myJsLoader .= ",
					unsupportedLocale: '" . $this->unsupported_locale . "'";
		}
		$myJsLoader .="
				}
			</script>
		";
		//************************
		
		//****** DOJO.JS ******
		if (COMODOJO_JS_XD_LOADING) {
			$myJsLoader .= '
			<script type="text/javascript" src="' . COMODOJO_JS_XD_LOCATION . '"></script>
			<script type="text/javascript">
				dojo.registerModulePath("custom", "../custom");
			</script>
			';
		}
		else {
			$myJsLoader .= '
			<script type="text/javascript" src="comodojo/javascript/dojo/dojo.js" ></script>
			<script type="text/javascript">
				dojo.registerModulePath("custom", "../custom");
			</script>
			';
		}
		//*********************
		
		//****** DOJO REQUIRES ******
		$myJsLoader .= "
			<script type=\"text/javascript\">
		";
		
		$myDojoRequires = json2array(COMODOJO_JS_REQUIRES);
		
		foreach ($myDojoRequires as $dr) {
				
			$myJsLoader .= "
				dojo.require(\"" . $dr["name"] . "\");";
			
			if (!empty($dr["extraCSS"])) {
				$myCssLoader .= "\n
		<link rel=\"stylesheet\" type=\"text/css\" href=\"". $dr["extraCSS"] . "\" />
				";
			}
		}
		
		$myJsLoader .= "
			</script>
			<script type=\"text/javascript\" src=\"comodojo/javascript/resources/comodojo.js\" ></script>
			<script type=\"text/javascript\">
				dojo.ready(function() {
					comodojo.initEnv();";
		/*
		if ($this->throwSiteMessage) {
			$myJsLoader .= "
					comodojo.dialog.siteMessage($this->_siteMessageCode, '$this->_siteMessageClass');
			";
		}
		*/
		$myJsLoader .= "					
				});
			</script>
		";
		//***************************
		
		//****** FINALY COMPOSE $THIS ******
		$this->js_loader = $myCssLoader . $myJsLoader;
		//**********************************
		
	}
	
	private function set_template() {
		
		$index = file_get_contents(COMODOJO_SITE_PATH . "comodojo/themes/" . COMODOJO_SITE_THEME . "/theme.html");
		
		//if (!COMODOJO_GLOBAL_DEBUG_ENABLED) $index = preg_replace('/<!--(.|\s)*?-->/', '', $index);
		
		$index = str_replace("*_SITETITLE_*",COMODOJO_SITE_TITLE,$index);
		$index = str_replace("*_SITEDESCRIPTION_*",COMODOJO_SITE_DESCRIPTION,$index);
		$index = str_replace("*_SITEDATE_*",date("Y",strtotime(COMODOJO_SITE_DATE)),$index);
		$index = str_replace("*_SITEAUTHOR_*",COMODOJO_SITE_AUTHOR,$index);
		$index = str_replace("*_DEFAULTENCODING_*",strtolower(COMODOJO_DEFAULT_ENCODING),$index);
		$index = str_replace("*_META_*",$this->evalMeta(),$index);
		$index = str_replace("*_DOJOTHEME_*",COMODOJO_SITE_THEME_DOJO,$index);
		$index = str_replace("*_DOJOLOADER_*",$this->js_loader,$index);
		$index = str_replace("*_CONTENT_*",'<div id="'.COMODOJO_SITE_DEFAULT_CONTAINER.'"></div>',$index);
		
		return $index;
		
	}
	
}

?>