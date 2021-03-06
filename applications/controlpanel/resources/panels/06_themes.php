<?php

/** 
 * controlpanel panel definition
 *
 * @package		Comodojo Core Applications
 * @author		comodojo.org
 * @copyright	__COPYRIGHT__ comodojo.org (info@comodojo.org)
 * @version		__CURRENT_VERSION__
 * @license		GPL Version 3
 */

function get_available_site_themes() {
	$handler = opendir(COMODOJO_SITE_PATH."comodojo/themes");
	$themes_available = Array();
	while (false !== ($item = readdir($handler))) {
		if (is_readable(COMODOJO_SITE_PATH."comodojo/themes/".$item."/theme.info")) {
			require(COMODOJO_SITE_PATH."comodojo/themes/".$item."/theme.info");
			if (is_array($theme)) {
				array_push($themes_available, Array(
					"label"=>$theme["name"],
					"id"=>$theme["name"],
					"createdBy"=>$theme["createdBy"],
					"version"=>$theme["version"],
					"framework"=>$theme["framework"],
					"comment"=>$theme["comment"]
				));
				$theme = "";
			}
		}
	}
	closedir($handler);
	return $themes_available;
}

function get_available_dojo_themes() {
	return Array(
		Array("label"=>"tundra","id"=>"tundra"),
		Array("label"=>"soria","id"=>"soria"),
		Array("label"=>"nihilo","id"=>"nihilo"),
		Array("label"=>"claro","id"=>"claro")
	);
}

$panels = Array(
	"themes" => Array(
		"builder"	=>	"theme",
		"icon"		=>	"themes.png",
		"label"		=>	"the_0",
		"table"		=>	"options",
		"where"		=>	Array("siteId","=",COMODOJO_UNIQUE_IDENTIFIER),
		"include"	=>	Array("SITE_THEME","SITE_THEME_DOJO")
	)
);

$options = Array(
	"SITE_THEME"	=>	Array(
		"type"		=>	"Select",
		"label"		=>	"the_1",
		"required"	=>	true,
		"onclick"	=>	false,
		"options"	=>	get_available_site_themes()
	),
	"SITE_THEME_DOJO"		=>	Array(
		"type"		=>	"Select",
		"label"		=>	"the_2",
		"required"	=>	true,
		"onclick"	=>	false,
		"options"	=>	get_available_dojo_themes()
	)
);

?>