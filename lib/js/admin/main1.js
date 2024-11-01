var viewport;
var contentPanel;
var headerPanel;

var idEdit;
var noIdParam;

var numPage;

Ext.onReady(function(){
	Ext.QuickTips.init();
	Ext.BLANK_IMAGE_URL = 'lib/js/framework/ext-3.4.0/resources/images/default/s.gif';

	PolesDataStore.load({params: {start: 0, limit: 250}});
	CommunesDataStore.load({params: {start: 0, limit: 250}});

    if (getURLParameter('id') != null && isInt(getURLParameter('id'))) {
        console.info('Dans main1.js onReady getURLParameter(id) != null ' + getURLParameter('id'));
    	idEdit = getURLParameter('id');
        Ext.Ajax.request({
            waitMsg: T_pleaseWait,
            url: 'lib/php/admin/database.php',
            params: {
                task: "GETNUMPAGEIDPARAM",
                usertype: 1,
                numRecordPerPage: limitPOIPerPage,
                idToFind: getURLParameter('id')
            },
            success: function(response) {
                numPage = response.responseText;
                if (numPage == 1) {
                    POIsDataStore.load({params: {start: 0, limit: limitPOIPerPage}});
                } else if (numPage == -1) {
                    alreadyShowExpandWindowGetParameter = 1;
                    POIsDataStore.load({params: {start: 0, limit: limitPOIPerPage}});
                    Ext.MessageBox.show({
                        title: T_recordNotFound,
                        msg: T_beCarrefulRecordNotFound,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.WARNING
                    });
                }
                else {
                    POIsDataStore.load({params: {start: limitPOIPerPage * (numPage - 1), limit: limitPOIPerPage}});
                }

            }
        });
    } else if (!isInt(getURLParameter('id'))) {
        noIdParam = -1;
        POIsDataStore.load({params: {start: 0, limit: limitPOIPerPage}});
        Ext.MessageBox.show({
            title: T_careful,
            msg: T_idNotInteger,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
    } else {
        noIdParam = -1;
        POIsDataStore.load({params: {start: 0, limit: limitPOIPerPage}});
    }

	contentPanel = new Ext.TabPanel({
		id: 'contentpanel',
		region: 'center',
		layoutOnTabChange: false,
		activeTab: 2,
		margins: '5 5 5 5',
		enableTabScroll: true,
		items: [{
			id: 'category',
			layout: 'fit',
			title: T_cats,
			iconCls: 'fugue_node-select-all',
			items: CategoryListingEditorGrid
		},{
			id: 'subcategory',
			layout: 'fit',
			title: T_subcategorys,
			iconCls: 'fugue_node-select-child',
			items: SubCategoryListingEditorGrid
		}, {
			id: 'poi',
			layout: 'fit',
			title: T_records,
			iconCls: 'fugue_reports',
			items: TabPanelRecord
		}, {
			id: 'mapadmin',
			layout: 'fit',
			title: T_theMap,
			iconCls: 'fugue_map-pin',
			tabCls: 'space-tab',
			items: mapAdminTabPanel
		}
		, {
			id: 'config',
			layout: 'fit',
			title: T_configuration,
			iconCls: 'silk_cog',
			tabCls: 'right-tab',
			items: TabPanelConfig
		}, {
            id: 'user',
            layout: 'fit',
            title: T_users,
            iconCls: 'fugue_users',
            tabCls: 'right-tab',
            items: UserListingEditorGrid
        }],
		listeners: {
			afterLayout: function(c){
				c.strip.setWidth(c.stripWrap.getWidth() - 2);
			},
			'tabchange': function(tabPanel, tab) {
		        console.info(tab.id);
		        if (tab.id == "user"){
		        	UsersDataStore.load({params: {start: 0, limit: 250}});
		        }else if (tab.id == "category"){
		        	CategorysDataStore.load({params: {start: 0, limit: 250}});
		        	IconsDataStore.load({params: {start: 0, limit: 250}});
		        }else if (tab.id == "subcategory"){
		        	SubCategorysDataStore.load({params: {start: 0, limit: 250}});
		        	IconsDataStore.load({params: {start: 0, limit: 250}});
		        }
		    }
		}
	});

	headerPanel = new Ext.Panel({
		region: 'north',
		cls: 'header',
		height: 110,
        collapseMode: 'mini',
        split: true,
		html: ''
	});

	viewport = new Ext.Viewport({
		layout: 'border',
		title: 'VelObs',
        items : [headerPanel, contentPanel],
		listeners: {
			afterLayout: function(){
				Ext.get('loading').hide();
				PhotoPOIModifSuppWindow.show();
				PhotoPOIModifSuppWindow.hide();
			}
		}
	});

});

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

function isInt(n) {
    return n % 1 === 0;
}