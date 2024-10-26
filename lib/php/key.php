<?php
	//error_reporting(E_ALL);
	//ini_set('display_errors', 1);
	define('DEBUG', TRUE);
	define('LOG_FILE', '/var/www/html/logs/velobs.log');
	define('HOST', 'db');
	define('PORT', '3306');

	define('SGBD', 'mysql');

	define('DB_USER', 'user');
	define('DB_PASS', 'password');
	define('DB_NAME', 'mydatabase');

	define('URL', 'cyclofiche.velo-cite.org');
	
	define('MAIL_ALIAS_OBSERVATION_ADHERENTS', 'cyclofiche@velo-cite.org');
	define('MAIL_FROM', 'cyclofiche@velo-cite.org');
	define('MAIL_REPLY_TO', 'cyclofiche@velo-cite.org');
	define('MAIL_SUBJECT_PREFIX', '[Cyclofiche]');
	
	define('VELOBS_ASSOCIATION', 'VéloCité Bordeaux');
	define('VELOBS_COLLECTIVITE1', 'Bordeaux Métropole');
	define('VELOBS_COLLECTIVITE2', '');
	define('VELOBS_COLLECTIVITE3', '');
	define('VELOBS_EMERGENCY_MAIL1', 'Veuillez téléphoner au 05 61 222 222 pour prévenir de ce problème si celui-ci est sur la commune de Toulouse');
	
	define('MAIL_SIGNATURE', '<br />L\'équipe Vélo-Cité Bordeaux :)<br />05 56 81 63 89<br />
<br />
<a href="http://velo-cite.org/contact/adherer/">Vous aimez nos actions? Soutenez nous !</a><br />
<a href="http://www.velo-cite.org/">www.velo-cite.org</a> / <a href="https://fr-fr.facebook.com/velocite.bordeauxmetropole">Facebook</a><br />
<br />');
	
	if (!function_exists('mysql_connect')){
        include_once('mysql2i.class.php');
    }
	
?>
