/**
 * Cacheman - get statistics about cache usage and clean cache
 *
 * @package		Comodojo Core Applications
 * @author		comodojo.org
 * @copyright	__COPYRIGHT__ comodojo.org (info@comodojo.org)
 * @version		__CURRENT_VERSION__
 * @license		GPL Version 3
 */

$d.require("comodojo.Form");

$c.App.load("cacheman",

	function(pid, applicationSpace, status){
	
		var myself = this;
		
		this.init = function(){
			$c.Kernel.newCall(myself.initCallback,{
				application: "cacheman",
				method: "getStats"
			});
		};
		
		this.initCallback = function(success,result) {
			if (success) {
				myself.form = new $c.Form({
					modules: ['Button'],
					autoFocus: false,
					hierarchy: [{
		              	name: "tips",
		                type: "warning",
		                content: myself.getLocalizedMessage('0000')
		            },{
		                name: "active",
		                type: "info",
		                content: myself.getLocalizedMessage('0001')+result.active_pages
		            },{
		                name: "expired",
		                type: "info",
		                content: myself.getLocalizedMessage('0002')+result.expired_pages
		            },{
		                name: "ttl",
		                type: "info",
		                content: myself.getLocalizedMessage('0003')+result.cache_ttl+' sec'
		            },{
		                name: "oldest",
		                type: "info",
		                content: myself.getLocalizedMessage('0004')+$c.Utils.dateFromServer(result.oldest_page)
		            },{
		                name: "purge",
		                type: "Button",
		                label: myself.getLocalizedMessage('0005'),
		                onClick: function() {
		                	myself.purge();
		                }
		            }],
					attachNode: applicationSpace.containerNode
				}).build();
			}
			else {
				$c.Error.modal(result.code,result.name);
				myself.stop();
			}
		};
		
		this.purge = function() {
			$c.Loader.start();
			$c.Kernel.newCall(myself.purgeCallback,{
				application: "cacheman",
				method: "purgeCache"
			});
		};
		
		this.purgeCallback = function() {
			$c.Loader.changeContent($c.icons.getIcon('apply',32),myself.getLocalizedMessage('0006'));
			$c.Loader.stopIn(2000);
			myself.stop();
		};
		
	}
	
);
