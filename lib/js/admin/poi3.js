//composants devant être inaccessibles aux comptes des pôles techniques
var arrayComponentsToDisable = ["SubCategoryPOIField", "CommunePOIField", "PolePOIField", "RespComcomPOIField", "DescPOIField", "PropPOIField", "RuePOIField", "ObsPOIField", "NumPOIField"];
for (var i = 0; i < arrayComponentsToDisable.length; i++) {
	Ext.getCmp(arrayComponentsToDisable[i]).style = {'border-color':'orange','background-color':'white','cursor':'not-allowed'};
	Ext.getCmp(arrayComponentsToDisable[i]).disable();
}

chkColumn_transmissionPOI.on('click', saveThePOI5);
chkColumn_traiteparpolePOI.on('click', saveThePOI6);

var photoPOI = new Ext.grid.Column({
	header: T_picture, 
	dataIndex: 'photo_poi', 
	width: 150,
	hidden: false,
	readOnly: true,
	renderer: function(value, metaData, record, rowIndex, colIndex, store) {
		if (value != '') {
			metaData.css = 'photo';
		} else {
			metaData.css = 'nophoto';
		}
		if (value == '') {
			return '<span style="color:gray">'+T_noPhoto+'</span>';
		} else {
			return '<span ext:qtip="'+T_dblClickShowPicture+'" style="color:gray">'+T_okPhoto+'</span>';
		}
	}
});
var idPOI; // <== need for photo
photoPOI.on('dblclick', function(columnIndex, grid, rowIndex, e, record){
	e.preventDefault();
	idPOI = grid.getStore().getAt(rowIndex).get('id_poi');

	if (grid.getStore().getAt(rowIndex).get('photo_poi') != ''){

		hiddenIdPOI.setValue(idPOI);
		var srcimg = 'resources/pictures/'+grid.getStore().getAt(rowIndex).get('photo_poi');
		var el = Ext.get('photo');

		var img = new Image();
		img.src = 'resources/pictures/'+grid.getStore().getAt(rowIndex).get('photo_poi');

		if (img.height == 0) {
			var temp = grid.getStore().getAt(rowIndex).get('photo_poi');
			var size = temp.split('x');
			var largeur = size[0];
			var hauteur = size[1];
			img.height = hauteur;
		}

		if (img.height > 350) { 
			el.set({height: 350});
			PhotoPOIModifSuppWindow.setHeight(500);
		} else {
			el.set({height: img.height});
			var ht = img.height+140;
			PhotoPOIModifSuppWindow.setHeight(ht);
		}
		el.set({src: srcimg});

		if (!PhotoPOIModifSuppWindow.isVisible()) { 
			PhotoPOIModifSuppWindow.show();
		} else { 
			PhotoPOIModifSuppWindow.toFront();
		}
	}
});

var PhotoPOIModifSuppForm = new Ext.form.FormPanel({
	id: 'PhotoPOIModifSuppForm',
	fileUpload: true,
	frame: true,
	autoScroll: true,
	bodyStyle: 'padding: 5px',
	labelWidth: 50,
	defaults: {
		anchor: '95%',
		allowBlank: false,
		msgTarget: 'side'
	},
	items: [hiddenIdPOI,
		{
			html: "<center><img id='photo' height='350' src='resources/images/logo_blank.png'/></center><br/>"
    	}
	],
	buttons: [
		{
			text: T_close,
			handler: function() {
				PhotoPOIModifSuppWindow.hide();
				POIListingEditorGrid.selModel.clearSelections();
			}
	}]
});

var PhotoPOIModifSuppWindow = new Ext.Window({
	id: 'PhotoPOIModifSuppWindow',
	iconCls: 'silk_image',
	title: T_image,
	closable: false,
	border: false,
	width: 640,
	height: 500,
	plain: true,
	layout: 'fit',
	modal: true,
	items: PhotoPOIModifSuppForm
});


//CONCATENATION DES COLONNES POUR L'INTERFACE DE MODERATION DES COMMENTAIRES
var CommentsPOIColumnModel = new Ext.grid.ColumnModel(
    [idComments, textComments, photoComments, mailComments, dateCreationComments]
);
CommentsPOIColumnModel.defaultSortable = true;

var CommentsPOIListingEditorGrid = new Ext.grid.EditorGridPanel({
    id: 'CommentsPOIListingEditorGrid',
    store: CommentsDataStore,
    cm: CommentsPOIColumnModel,
    selModel: new Ext.grid.RowSelectionModel({singleSelect: false}),
    bbar: new Ext.PagingToolbar({
        pageSize: 50,
        store: CommentsDataStore,
        displayInfo: true
    })
});

var expandCommentsWindow = new Ext.Window({
    title: T_comments,
    height: 480,
    width: 640,
    layout: 'fit',
    modal: true,
    maximizable: false,
    items: CommentsPOIListingEditorGrid,
    iconCls: 'silk_comment',
    closable: false,
    buttons: [
        {
            text: T_close,
            handler: function() {
                expandCommentsWindow.hide();
            }
        }
    ]
});

var comments = new Ext.grid.Column({
    header: T_comments,
    hidden: false,
    dataIndex: 'num_comments',
    width: 90,
    renderer: function(value, metaData, record, rowIndex, colIndex, store) {
        if (value == 0) {
            metaData.css = 'nophoto';
            return value+' commentaire';
        } else {
            metaData.css = 'photo';
            if (value == 1) {
                return '<span ext:qtip="'+T_dblClickViewComment+'">'+value+' commentaire</span>';
            } else {
                return '<span ext:qtip="'+T_dblClickViewComment+'">'+value+' commentaires</span>';
            }
        }
    }
});
comments.on('dblclick', function(columnIndex, grid, rowIndex, e) {
    id = grid.getStore().getAt(rowIndex).get('id_poi');
    valeur = grid.getStore().getAt(rowIndex).get('num_comments');

    hiddenPOIComment = id;
    if (valeur == 0) {
        Ext.MessageBox.show({
            title: T_careful,
            msg: T_noCommentsCom,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.INFO
        });
    } else {
        CommentsDataStore.setBaseParam('id_poi', id);
        CommentsDataStore.load();
        expandCommentsWindow.setTitle(T_comments+' [Obs. - '+id+']');
        expandCommentsWindow.show();
    }

});

var POIsColumnModel = new Ext.grid.ColumnModel(
	[identifiantPOI,{ 
			header: T_titlePOI, 
			dataIndex: 'lib_poi',
			hidden: true,
			width: 200,
			css:'cursor:not-allowed;color:blue;',
			sortable: true
		},{ 
			header: T_dateCreation, 
			dataIndex: 'datecreation_poi', 
			width: 150,
			css:'cursor:not-allowed;color:blue;',
			sortable: true
		},{
            header: T_lastdateModif,
            dataIndex: 'lastdatemodif_poi',
            width: 120,
            css:'cursor:not-allowed;color:blue;',
            sortable: true
        },{
			header: T_subcategorys,
			dataIndex: 'lib_subcategory',
			width: 170,
			css:'cursor:not-allowed;color:blue;',
			sortable: true
		}, photoPOI,{
			header: T_commune,
			dataIndex: 'lib_commune',
			width: 170,
			css:'cursor:not-allowed;color:blue;',
			sortable: true
		},{
			header: T_pole,
			dataIndex: 'lib_pole',
			css:'cursor:not-allowed;color:blue;',
			width: 170,
			sortable: true
		},{ 
			header: T_rueRecord, 
			dataIndex: 'rue_poi', 
			width: 100,
			css:'cursor:not-allowed;color:blue;',
			sortable: true,
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
		},{ 
			header: T_numRecord, 
			dataIndex: 'num_poi',
			css:'cursor:not-allowed;color:blue;',
			width: 100,
			sortable: true,
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
		},moderatePOIButton,  {
			header: T_description, 
			dataIndex: 'desc_poi', 
			css:'cursor:not-allowed;color:blue;',
			width: 220,
			sortable: true,
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
		},{ 
			header: T_proposition, 
			dataIndex: 'prop_poi', 
			width: 220,
			sortable: true,
			css:'cursor:not-allowed;color:blue;',
            renderer: function(val) {
                return '<span  ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
		},{
			header: T_priorite,
			dataIndex: 'lib_priorite',
			width: 170,
			css:'cursor:not-allowed;color:blue;',
			sortable: true
		},{ 
			header: T_obsterrain, 
			dataIndex: 'observationterrain_poi', 
			width: 220,
			css:'cursor:not-allowed;color:blue;',
			sortable: true,
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
		},{
			header: '[Public] ' + T_reponseGrandToulouse, 
			dataIndex: 'reponsegrandtoulouse_poi', 
			width: 220,
			css:'cursor:not-allowed;color:blue;',
			sortable: true,
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
		},{ 
			header: T_reponsePole, 
			dataIndex: 'reponsepole_poi', 
			width: 220,
			sortable: true,
			editor: new Ext.form.TextArea({
				allowBlank: true
			}),
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
		},chkColumn_traiteparpolePOI,comments
	]
);
POIsColumnModel.defaultSortable = true;

var paging = new Ext.PagingToolbar({
    pageSize: limitPOIPerPage,
    store: POIsDataStore,
    displayInfo: true
});
var POIListingEditorGrid = new Ext.grid.EditorGridPanel({
	title: T_data,
	iconCls: 'fugue_reports',
	id: 'POIListingEditorGrid',
	store: POIsDataStore,
	cm: POIsColumnModel,
	plugins: [chkColumn_displayPOI, chkColumn_fixPOI, chkColumn_moderationPOI, /*chkColumn_transmissionPOI,*/chkColumn_traiteparpolePOI],
	clicksToEdit: 2,
	selModel: new Ext.grid.RowSelectionModel({singleSelect: false}),
	bbar: paging,
  	tbar: [
       '->',{
			text: T_downloadRecord,
			handler: writePOICsv,
			iconCls: 'silk_table_save'
		}
	]
});
POIListingEditorGrid.on('afteredit', saveThePOI);

function saveThePOI(oGrid_event) {
	Ext.get('update').show();
	Ext.Ajax.request({
		waitMsg: T_pleaseWait,
		url: 'lib/php/admin/database.php',
		params: {
			task: "UPDATEPOI",
			id_poi: oGrid_event.record.data.id_poi,
			lib_poi: oGrid_event.record.data.lib_poi,
			adherent_poi: oGrid_event.record.data.adherent_poi,
			adherentfirstname_poi: oGrid_event.record.data.adherentfirstname_poi,
			num_poi: oGrid_event.record.data.num_poi,
			tel_poi: oGrid_event.record.data.tel_poi,
			mail_poi: oGrid_event.record.data.mail_poi,
			rue_poi: oGrid_event.record.data.rue_poi,
			communename_poi: oGrid_event.record.data.communename_poi,
			commune_id_commune: oGrid_event.record.data.lib_commune,
			pole_id_pole: oGrid_event.record.data.lib_pole,
			quartier_id_quartier: oGrid_event.record.data.lib_quartier,
			priorite_id_priorite: oGrid_event.record.data.lib_priorite,
			desc_poi: oGrid_event.record.data.desc_poi,
			prop_poi: oGrid_event.record.data.prop_poi,
			observationterrain_poi: oGrid_event.record.data.observationterrain_poi,
			reponsegrandtoulouse_poi: oGrid_event.record.data.reponsegrandtoulouse_poi,
			reponsepole_poi: oGrid_event.record.data.reponsepole_poi,
			commentfinal_poi: oGrid_event.record.data.commentfinal_poi,
			datecreation_poi: oGrid_event.record.data.datecreation_poi,
			datefix_poi: oGrid_event.record.data.datefix_poi,
			subcategory_id_subcategory: oGrid_event.record.data.lib_subcategory,
            poleedit : 1 // ce champ est utile pour savoir que l'on édite à partir de l'admin des poles >> pour écrire un mail à toulouse métropole
		},
		success: function(response) {
			var result = eval(response.responseText);
			switch (result) {
			case 1:
                POIsDataStore.commitChanges();
                POIListingEditorGrid.selModel.clearSelections();
                break;
            case 2:
                Ext.MessageBox.show({
                    title: T_careful,
                    msg: T_cantModifyField,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
                break;
            case 4:
            	POIsDataStore.commitChanges();
                POIListingEditorGrid.selModel.clearSelections();
                break;
            case 10:
            	Ext.MessageBox.show({
                    title: T_careful,
                    msg: T_errorUpdateObservationNeedFinalComment,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
            	break;
            case 11:
            	Ext.MessageBox.show({
                    title: T_careful,
                    msg: T_errorUpdateObservationNeedFinalCommentTwin,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
            	break;
            default:
            	Ext.MessageBox.show({
                    title: T_careful,
                    msg: T_errorUpdateObservationWIthoutExplanation,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
            	break;
			}
			Ext.get('update').hide();
		},
		failure: function(response) {
			var result = response.responseText;
			Ext.MessageBox.show({
					title: T_careful,
					msg: T_badConnect,
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.ERROR
				});
			Ext.get('update').hide();
		}
	});
}


function saveThePOI5(ctrlObj, eventObj, recordObj) {
	Ext.get('update').show();
	Ext.Ajax.request({
		waitMsg: T_pleaseWait,
		url: 'lib/php/admin/database.php',
		params: {
			task: "UPDATEPOI",
			id_poi: recordObj.data.id_poi,
			transmission_poi: recordObj.data.transmission_poi
		},
		success: function(response) {
			var result = eval(response.responseText);
			switch (result) {
			case 1:
                POIsDataStore.commitChanges();
                POIListingEditorGrid.selModel.clearSelections();
                break;
            case 2:
            	Ext.MessageBox.alert(T_success,T_no_modification_on_data);
                break;
            case 4:
            	POIsDataStore.commitChanges();
                POIListingEditorGrid.selModel.clearSelections();
                break;
            case 10:
            	Ext.MessageBox.show({
                    title: T_careful,
                    msg: T_errorUpdateObservationNeedFinalComment,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
            	break;
            case 11:
            	Ext.MessageBox.show({
                    title: T_careful,
                    msg: T_errorUpdateObservationNeedFinalCommentTwin,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
            	break;
            default:
            	Ext.MessageBox.show({
                    title: T_careful,
                    msg: T_errorUpdateObservationWIthoutExplanation,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
            	break;
			}
			Ext.get('update').hide();
		},
		failure: function(response){
			var result = response.responseText;
			Ext.MessageBox.show({
					title: T_careful,
					msg: T_badConnect,
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.ERROR
				});
			Ext.get('update').hide();
		}
	});
}

function saveThePOI6(ctrlObj, eventObj, recordObj) {
	Ext.get('update').show();
	Ext.Ajax.request({
		waitMsg: T_pleaseWait,
		url: 'lib/php/admin/database.php',
		params: {
			task: "UPDATEPOI",
			id_poi: recordObj.data.id_poi,
			traiteparpole_poi: recordObj.data.traiteparpole_poi
		},
		success: function(response) {
			var result = eval(response.responseText);
			switch (result) {
			case 1:
                POIsDataStore.commitChanges();
                POIListingEditorGrid.selModel.clearSelections();
                break;
            case 2:
            	Ext.MessageBox.alert(T_success,T_no_modification_on_data);
                break;
            case 4:
            	POIsDataStore.commitChanges();
                POIListingEditorGrid.selModel.clearSelections();
                break;
            case 10:
            	Ext.MessageBox.show({
                    title: T_careful,
                    msg: T_errorUpdateObservationNeedFinalComment,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
            	break;
            case 11:
            	Ext.MessageBox.show({
                    title: T_careful,
                    msg: T_errorUpdateObservationNeedFinalCommentTwin,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
            	break;
            default:
            	Ext.MessageBox.show({
                    title: T_careful,
                    msg: T_errorUpdateObservationWIthoutExplanation,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
            	break;
			}
			Ext.get('update').hide();
		},
		failure: function(response){
			var result = response.responseText;
			Ext.MessageBox.show({
					title: T_careful,
					msg: T_badConnect,
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.ERROR
				});
			Ext.get('update').hide();
		}
	});
}

var id;
var validButton = new Ext.Button({
    iconCls: 'silk_tick',
    text: T_save,
    handler: function() {
        Ext.Ajax.request({
            waitMsg: T_pleaseWait,
            url: 'lib/php/admin/database.php',
            params: {
                task: "UPDATEPOI",
                id_poi: id,
                reponsepole_poi: RespPolePOIField.getValue(),
                traiteparpole_poi: TraitePolePOIField.getValue()
            },
            success: function(response) {
                var result = eval(response.responseText);
                switch(result){
                    case 1:
                        POIsDataStore.reload();
                        expandWindow.hide();
                        POIListingEditorGrid.selModel.clearSelections();
                        break;
                    case 4:
                        POIsDataStore.reload();
                        expandWindow.hide();
                        POIListingEditorGrid.selModel.clearSelections();
                        break;
                    case 2:
						Ext.MessageBox.alert(T_success,T_no_modification_on_data);
						break;
                    default:
                    	Ext.MessageBox.show({
                            title: T_careful,
                            msg: T_errorUpdateObservationWIthoutExplanation,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.INFO
                        });
                    	break;
                }
            },
            failure: function(response) {
                var result = response.responseText;
                Ext.MessageBox.alert(T_error, T_badConnect);
            }
        });
    }
});

var buttonModerateComments = new Ext.Button({
	iconCls: 'silk_pencil',
	text: T_comments
	
});
buttonModerateComments.on('click', function(columnIndex, grid, rowIndex, e) {
	console.info("buttonModerateComments.on('click')" + id);
//    id = 2135;

    hiddenPOIPhoto = id;
    
    CommentsDataStore.setBaseParam('id_poi', id);
    CommentsDataStore.load();
    expandCommentsWindow.setTitle(T_comments+' [Obs. - '+id+']');
    expandCommentsWindow.show();

});
var resetButton = new Ext.Button({
	iconCls: 'silk_cancel',
	text: T_reset,
	handler: function() {
		expandWindow.hide();
	}
});

var buttonPhotoPOI = new Ext.Button({
	iconCls: 'silk_photos',
	text: T_image
});
buttonPhotoPOI.on('click', function() {
    if (tof != '') {
        hiddenIdPOI.setValue(id);
        var srcimg = 'resources/pictures/'+tof;
        var el = Ext.get('photo');

        var img = new Image();
        img.src = 'resources/pictures/'+tof;

        if (img.height == 0) {
            var temp = tof;
            var size = temp.split('x');
            var largeur = size[0];
            var hauteur = size[1];
            img.height = hauteur;
        }

        if (img.height > 350) {
            el.set({height: 350});
            PhotoPOIModifSuppWindow.setHeight(500);
        } else {
            el.set({height: img.height});
            var ht = img.height+140;
            PhotoPOIModifSuppWindow.setHeight(ht);
        }
        el.set({src: srcimg});

        if (!PhotoPOIModifSuppWindow.isVisible()) {
            PhotoPOIModifSuppWindow.show();
        } else {
            PhotoPOIModifSuppWindow.toFront();
        }
    }
});

var expandWindow = new Ext.Window({
    title: T_record,
    height: 650,
	width: 900,
    layout: 'fit',
    modal: true,
    maximizable: true,
    items: [expandMapPanel],
    iconCls: 'silk_map',
    closeAction: 'hide',
    bbar : {
        xtype : 'container',
        layout : {
            type : 'vbox',
            pack  : 'start',
            align : 'stretch'
        },
        height : 225,
        defaults : { flex : 1 },
        items : [
            new Ext.Toolbar({
                height: 25,
                items : ['Rue:',RuePOIField,'Repère:',NumPOIField,'[Privé] Commentaire Vélo-Cité:',ObsPOIField]
            }),
            new Ext.Toolbar({
                height: 75,
                items : [SubCategoryPOIField,'Description:',DescPOIField,'Proposition:',PropPOIField]
            }),
            new Ext.Toolbar({
                height: 75,
                items : ['[Public] Réponse de la collectivité:',RespComcomPOIField,'[Privé] Réponse de la collectivité:',RespPolePOIField]
            }),
            new Ext.Toolbar({
                height: 25,
                items : ['Commune:',CommunePOIField,'Pole:',PolePOIField,'Photo:',buttonPhotoPOI]
            }),
            new Ext.Toolbar({
                height: 25,
                items : ['Traité par pole:',TraitePolePOIField,'->', buttonModerateComments, ' ', validButton, ' ', resetButton]
            })
        ]
    }
});
expandWindow.on('hide', function() {
	vectors.removeAllFeatures();
});

function createFeature(X,Y,com,pole,traite,reponsecomcom,reponsepole,desc,prop,subcat,rue,num,obs) {
    CommunePOIField.setValue(com);
    PolePOIField.setValue(pole);
    TraitePolePOIField.setValue(traite);
    RespComcomPOIField.setValue(reponsecomcom);
    RespPolePOIField.setValue(reponsepole);
    DescPOIField.setValue(desc);
    PropPOIField.setValue(prop);
    SubCategoryPOIField.setValue(subcat);
    RuePOIField.setValue(rue);
    NumPOIField.setValue(num);
    ObsPOIField.setValue(obs);

	var point = new OpenLayers.Geometry.Point(X,Y);  
	var feat = new OpenLayers.Feature.Vector(point, null, 
		{
			strokeColor: "#ff0000", 
            strokeOpacity: 0.8,
            fillColor : "#ff0000",
            fillOpacity: 0.4,
            pointRadius : 8
		}
	);
	vectors.addFeatures([feat]);
}

var tof;
moderatePOIButton.on('click', function(columnIndex, grid, rowIndex, e) {
	expandWindow.show();
	id = grid.getStore().getAt(rowIndex).get('id_poi');
	var dateLastModif = grid.getStore().getAt(rowIndex).get('lastdatemodif_poi');
	if (grid.getStore().getAt(rowIndex).get('lastdatemodif_poi') == '0000-00-00'){
		dateLastModif = grid.getStore().getAt(rowIndex).get('datecreation_poi');
	}
    expandWindow.setTitle(T_record+' n°'+id +', '+ T_lastModificationDate + ' : ' + dateLastModif);
	var lat = grid.getStore().getAt(rowIndex).get('latitude_poi');
	var lon = grid.getStore().getAt(rowIndex).get('longitude_poi');

    var commune = grid.getStore().getAt(rowIndex).get('lib_commune');
    var pole = grid.getStore().getAt(rowIndex).get('lib_pole');
    var traite = grid.getStore().getAt(rowIndex).get('traiteparpole_poi');
    var reponsecomcom = grid.getStore().getAt(rowIndex).get('reponsegrandtoulouse_poi');
    var reponsepole = grid.getStore().getAt(rowIndex).get('reponsepole_poi');
    var obs = grid.getStore().getAt(rowIndex).get('observationterrain_poi');
    var desc = grid.getStore().getAt(rowIndex).get('desc_poi');
    var prop = grid.getStore().getAt(rowIndex).get('prop_poi');
    var subcat = grid.getStore().getAt(rowIndex).get('lib_subcategory');
    var rue = grid.getStore().getAt(rowIndex).get('rue_poi');
    var num = grid.getStore().getAt(rowIndex).get('num_poi');
var  nbrComments = grid.getStore().getAt(rowIndex).get('num_comments');
    
    
    if (nbrComments == 0) {
    	buttonModerateComments.disable();
    } else {
    	buttonModerateComments.enable();
    }
    tof = grid.getStore().getAt(rowIndex).get('photo_poi');
    if (tof == '') {
        buttonPhotoPOI.setText(T_noImage);
        buttonPhotoPOI.disable();
    } else {
        buttonPhotoPOI.setText(T_image);
        buttonPhotoPOI.enable();
    }

	if ((lat == '') && (lon == '')) {
			var uri = 'lib/php/admin/getDefaultConfigMap.php';
			OpenLayers.loadURL(uri,'',this,setLatLonZoomDefault);
	} else {
		var lonlat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), expandMap.getProjectionObject());
        createFeature(lonlat.lon,lonlat.lat,commune,pole,traite,reponsecomcom,reponsepole,desc,prop,subcat,rue,num,obs);
		var lonlatwgs = lonlat.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
		latitudeField.setValue(lat);
		longitudeField.setValue(lon);
		expandMap.setCenter(new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), expandMap.getProjectionObject()), 13);
	}
});

var TabPanelRecord = new Ext.TabPanel({
	activeTab: 0,	
	region: 'center',
	margins: '5 5 5 0',
	border: false,
	tabPosition: 'bottom',
	items: [
		POIListingEditorGrid
	]
});
