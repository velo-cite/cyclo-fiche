<?php header('Content-Type: text/html; charset=UTF-8');
	session_start();
	include_once '../key.php';
	
	if (isset($_SESSION['user'])) {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES utf8mb4");
				
				if (isset($_GET['type'])) {
					switch ($_GET['type']) {
						case 'category':
							$file = "category_".date('Y-m-d').".csv";
							$fh = fopen("../../../resources/csv/".$file, 'w');
							if (!$fh) {
								echo '{"success": false}';
							} else {
								$sql = "SELECT * FROM category ORDER BY id_category ASC";
								$result = mysql_query($sql);
								$csv = '"id_category";"lib_category";"display_category"';
								$csv .= "\r\n";
								while ($row = mysql_fetch_array($result)) {
									$csv .= $row['id_category'].';"'.$row['lib_category'].'";'.$row['display_category'];
									$csv .= "\r\n";
								}
								fputs($fh, $csv);
								fclose($fh);
								echo '{"success": true, "file": "'.$file.'"}';
							}
							break;
							
						case 'subcategory':
							$file = "subcategory_".date('Y-m-d').".csv";
							$fh = fopen("../../../resources/csv/".$file, 'w');
							if (!$fh) {
								echo '{"success": false}';
							} else {
								$sql = "SELECT * FROM subcategory INNER JOIN category ON (category.id_category = subcategory.category_id_category) ORDER BY id_subcategory ASC";
								$result = mysql_query($sql);
								$csv = '"id_subcategory";"lib_subcategory";"lib_category";"display_subcategory"';
								$csv .= "\r\n";
								while ($row = mysql_fetch_array($result)) {
									$csv .= $row['id_subcategory'].';"'.$row['lib_subcategory'].'";"'.$row['lib_category'].'";'.$row['display_subcategory'];
									$csv .= "\r\n";
								}
								fputs($fh, $csv);
								fclose($fh);
								echo '{"success": true, "file": "'.$file.'"}';
							}
							break;	
												
						case 'poi':
							$file = "velobs_poi_".date('Y-m-d').".csv";
							$fh = fopen("../../../resources/csv/".$file, 'w');
							if (!$fh) {
								echo '{"success": false}';
							} else {
								if (isset($_SESSION['type']) && isset($_SESSION['pole'])){
									$extraSQL = "";
									//si l'utilisateur fait partie d'un pole technique, on restreint les POI correspondant au pole et qui ne sont pas avec priorité à "A modérer", "refusé par 2P2R" et "Doublon"
									if ($_SESSION['type'] == 3){
										$extraSQL = " AND poi.pole_id_pole = " .$_SESSION['pole'] . " AND poi.priorite_id_priorite NOT IN (4,7,15) AND poi.moderation_poi = 1 AND poi.transmission_poi = 1";
									}//si l'utilisateur fait partie d'une communauté de communes, on restreint les POI à ceux qui ne sont pas avec priorité à "A modérer", "refusé par 2P2R" et "Doublon"
									elseif ($_SESSION['type'] == 2){
										$extraSQL = " AND poi.priorite_id_priorite NOT IN (4,7,15) AND moderation_poi = 1 AND commune_id_commune IN (".str_replace(';',',',$_SESSION['territoire']).") ";
									}//si l'utilisateur fait partie des modérateurs, on restreint les POI correspondant au pole
									elseif ($_SESSION['type'] == 4){
										$extraSQL = " AND poi.pole_id_pole = " .$_SESSION['pole'] . " ";
									}
								}
								$sql = "SELECT 
											poi.*, 
											priorite.lib_priorite, 
											pole.lib_pole, 
											status.lib_status,
											st_x(poi.geom_poi) AS X, 
											st_y(poi.geom_poi) AS Y, 
											lib_category, 
											lib_subcategory, 
											lib_commune 
										FROM poi 
											INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) 
											INNER JOIN category ON (subcategory.category_id_category = category.id_category) 
											INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) 
											INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) 
											INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) 
											INNER JOIN status ON (poi.status_id_status = status.id_status)
										WHERE 
											poi.delete_poi = FALSE 
											$extraSQL
										ORDER BY id_poi DESC";
								$result = mysql_query($sql);
								$csv = '"Ref. fiche";"Statut";"Commune";"Localisation précise";"Catégories";"Modération";"Description";"Proposition";"[Public] Commentaire Vélo-Cité";"[Privé] Commentaire Vélo-Cité";"[Public] Réponse de la collectivité";"[Privé] Réponse de la collectivité";"Email";"Date de création";"Dernière modification"';
								$csv .= "\r\n";
								while ($row = mysql_fetch_array($result)) {
									$csv .= stripslashes(str_replace('"', "", $row['ref_poi']).';"'.str_replace('"', "", $row['lib_status']).'";"'.str_replace('"', "", $row['lib_commune']).'";"'.str_replace('"', "", $row['rue_poi']).'";"'.str_replace('"', "", $row['lib_subcategory']).'";"'.str_replace('"', "", $row['moderation_poi']).'";"'.str_replace('"', "", $row['desc_poi']).'";"'.str_replace('"', "", $row['prop_poi']).'";"'.str_replace('"', "", $row['commentfinal_poi']).'";"'.str_replace('"', "", $row['observationterrain_poi']).'";"'.str_replace('"', "", $row['reponsegrandtoulouse_poi']).'";"'.str_replace('"', "", $row['reponsepole_poi']).'";"'.str_replace('"', "", $row['mail_poi']).'";"'.str_replace('"', "", $row['datecreation_poi']).'";"'.str_replace('"', "", $row['lastdatemodif_poi']).'"');
									$csv .= "\r\n";
								}
								fputs($fh, $csv);
								fclose($fh);
								echo '{"success": true, "file": "'.$file.'"}';
							}
							break;
						case 'commune':
							$file = "commune_".date('Y-m-d').".csv";
							$fh = fopen("../../../resources/csv/".$file, 'w');
							if (!$fh) {
								echo '{"success": false}';
							} else {
								$sql = "SELECT * FROM commune ORDER BY id_commune ASC";
								$result = mysql_query($sql);
								$csv = '"id_commune";"lib_commune";';
								$csv .= "\r\n";
								while ($row = mysql_fetch_array($result)) {
									$csv .= $row['id_commune'].';"'.$row['lib_commune'].'";';
									$csv .= "\r\n";
								}
								fputs($fh, $csv);
								fclose($fh);
								echo '{"success": true, "file": "'.$file.'"}';
							}
							break;
							
						case 'pole':
							$file = "pole_".date('Y-m-d').".csv";
							$fh = fopen("../../../resources/csv/".$file, 'w');
							if (!$fh) {
								echo '{"success": false}';
							} else {
								$sql = "SELECT * FROM pole ORDER BY id_pole ASC";
								$result = mysql_query($sql);
								$csv = '"id_pole";"lib_pole";';
								$csv .= "\r\n";
								while ($row = mysql_fetch_array($result)) {
									$csv .= $row['id_pole'].';"'.$row['lib_pole'].'";';
									$csv .= "\r\n";
								}
								fputs($fh, $csv);
								fclose($fh);
								echo '{"success": true, "file": "'.$file.'"}';
							}
							break;
							
						case 'quartier':
							$file = "quartier_".date('Y-m-d').".csv";
							$fh = fopen("../../../resources/csv/".$file, 'w');
							if (!$fh) {
								echo '{"success": false}';
							} else {
								$sql = "SELECT * FROM quartier ORDER BY id_quartier ASC";
								$result = mysql_query($sql);
								$csv = '"id_quartier";"lib_quartier";';
								$csv .= "\r\n";
								while ($row = mysql_fetch_array($result)) {
									$csv .= $row['id_quartier'].';"'.$row['lib_quartier'].'";';
									$csv .= "\r\n";
								}
								fputs($fh, $csv);
								fclose($fh);
								echo '{"success": true, "file": "'.$file.'"}';
							}
							break;
							
						case 'priorite':
							$file = "priorite_".date('Y-m-d').".csv";
							$fh = fopen("../../../resources/csv/".$file, 'w');
							if (!$fh) {
								echo '{"success": false}';
							} else {
								$sql = "SELECT * FROM priorite ORDER BY id_priorite ASC";
								$result = mysql_query($sql);
								$csv = '"id_priorite";"lib_priorite";';
								$csv .= "\r\n";
								while ($row = mysql_fetch_array($result)) {
									$csv .= $row['id_priorite'].';"'.$row['lib_priorite'].'";';
									$csv .= "\r\n";
								}
								fputs($fh, $csv);
								fclose($fh);
								echo '{"success": true, "file": "'.$file.'"}';
							}
							break;
					}
				} else {
					echo '{"success": false}';
				}
							
				mysql_free_result($result);
				mysql_close($link);	
				break;
			case 'postgresql':
				// TODO
				break;
		}

	}
?>
