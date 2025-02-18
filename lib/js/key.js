var USE_TF = false;
var TF_key = "" ; // documentation ici : http://thunderforest.com/docs/apikeys/
var LOAD_ALL_OBSERVATIONS_DEFAULT = true;
function getCookie(sName) {
        var cookContent = document.cookie, cookEnd, i, j;
        var sName = sName + "=";
 
        for (i=0, c=cookContent.length; i<c; i++) {
                j = i + sName.length;
                if (cookContent.substring(i, j) == sName) {
                        cookEnd = cookContent.indexOf(";", j);
                        if (cookEnd == -1) {
                                cookEnd = cookContent.length;
                        }
                        return decodeURIComponent(cookContent.substring(j, cookEnd));
                }
        }       
        return null;
}

//Surcharge les variables de translation_fr.js et translation_en.js
//ajouter ici les variables des fichiers translation_fr.js et translation_en.js que vous voulez remplacer sans les perde lors d'une prochaine mise à jour
//T_header_main = 'Une entête spécifique pour mon instance'; //texte affiché dans l'entête de l'interface publique


//Définition des cartes à afficher dans l'interface pour affichage des observations en fonction des catégories sélectionnées
//1 : définir le layer
//2 : ajouter une entrée au tableau mapLayersArray contenant le layer ci-dessus
//ce tableau est utilisé pour afficher des layers sélectionnables dans l'interface
//Attention : tous les layers définis ici sont chargés sur l'interface, pouvant engendrés un trafic réseau non négligeable
var mapnik = new OpenLayers.Layer.OSM("OpenStreetMap Mapnik", "https://tile.openstreetmap.org/${z}/${x}/${y}.png",
        {
                'sphericalMercator': true,
                isBaseLayer: true,
                'attribution': '<a href="http://www.openstreetmap.org" target="_blank">OpenStreetMap</a>'
        }
);
var osmcyclemap = new OpenLayers.Layer.OSM("OSM Cycle Map",
        ['https://tile.thunderforest.com/cycle/${z}/${x}/${y}.png?apikey='+ TF_key],
    {
        'sphericalMercator': true,
        isBaseLayer: true,
        'attribution': 'Maps © <a href="http://www.thunderforest.com/" target="_blank">Thunderforest</a>, Data © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>'
    }
);
//la carte affichée par défaut est la première
var mapLayersArray = [
        [0, 'Mapnik',mapnik],
        //[1, 'OpenCycleMap', osmcyclemap]
];

//Création de la carte utilisée dans la vue de modification d'une observation dans l'interface d'administration
//peut-être la même définition qu'une carte ci-dessus, mais ne pas affecter une variable de carte déjà existante sinon une des 2 cartes ne s'affichera pas
var adminMapForPoi = new OpenLayers.Layer.OSM("OpenStreetMap Mapnik", "https://tile.openstreetmap.org/${z}/${x}/${y}.png");

