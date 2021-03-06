<?php

/** 
 * user_avatar.php
 * 
 * Returns user avatar as image link
 *
 * @package		Comodojo PHP Backend
 * @author		comodojo.org
 * @copyright	__COPYRIGHT__ comodojo.org (info@comodojo.org)
 * @version		__CURRENT_VERSION__
 * @license		GPL Version 3 (all but gravatar func)
 */

/**
 * Get either a Gravatar URL or complete image tag for a specified email address.
 *
 * @param string $email The email address
 * @param string $s Size in pixels, defaults to 80px [ 1 - 2048 ]
 * @param string $d Default imageset to use [ 404 | mm | identicon | monsterid | wavatar ]
 * @param string $r Maximum rating (inclusive) [ g | pg | r | x ]
 * @param boole $img True to return a complete IMG tag False for just the URL
 * @param array $atts Optional, additional key/value attributes to include in the IMG tag
 * @return String containing either just a URL or a complete image tag
 * @source http://gravatar.com/site/implement/images/php/
 */
function get_gravatar( $email, $s = 80, $d = 'mm', $r = 'g', $img = false, $atts = array() ) {
	$url = 'http://www.gravatar.com/avatar/';
	$url .= md5( strtolower( trim( $email ) ) );
	$url .= "?s=$s&d=$d&r=$r";
	if ( $img ) {
		$url = '<img src="' . $url . '"';
		foreach ( $atts as $key => $val )
			$url .= ' ' . $key . '="' . $val . '"';
		$url .= ' />';
	}
	return $url;
}

/**
 * Get avatar for current user
 * 
 * @param string $size The image size
 * @return String containing avatar's url
 */
function get_current_user_avatar($size=64) {
	
	return get_user_avatar(COMODOJO_USER_NAME,COMODOJO_USER_EMAIL,COMODOJO_USER_GRAVATAR,$size);
	
}

/**
 * Get avatar for generic user (if any)
 *
 * @param string $userName The user name
 * @param string $userEmail The user email
 * @param bool $gravatar If true, avatar will be generated via Gravatar
 * @param string $size The image size
 * @return String containing avatar's url
 */
function get_user_avatar($userName, $userEmail, $gravatar, $size=64) {
	$userImage = COMODOJO_SITE_PATH . COMODOJO_HOME_FOLDER . COMODOJO_USERS_FOLDER . $userName . '/._avatar.png';
	if ($gravatar) {
		$image = get_gravatar($userEmail, $size, 'mm', COMODOJO_GRAVATAR_RATING);
	}
	else if (realFileExists($userImage)) {
		comodojo_load_resource('image_tools');
		$it = new image_tools();
		$image = (is_null(COMODOJO_SITE_EXTERNAL_URL) ? COMODOJO_SITE_URL : COMODOJO_SITE_EXTERNAL_URL) . COMODOJO_HOME_FOLDER.COMODOJO_THUMBNAILS_FOLDER . $it->thumbnail($userImage,$size);
	}
	else {
		comodojo_load_resource('image_tools');
		$it = new image_tools();
		$image = (is_null(COMODOJO_SITE_EXTERNAL_URL) ? COMODOJO_SITE_URL : COMODOJO_SITE_EXTERNAL_URL) . COMODOJO_HOME_FOLDER.COMODOJO_THUMBNAILS_FOLDER . $it->thumbnail(COMODOJO_SITE_PATH . 'comodojo/images/logo.png',$size);
	}
	
	return $image;
	
}

/**
 * Sanity check for CoMoDojo loader
 * 
 * @define function loadHelper_user_avatar
 */
function loadHelper_user_avatar() { return false; }

?>