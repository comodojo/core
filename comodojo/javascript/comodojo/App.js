define(["dojo/_base/lang","dojo/dom","dojo/aspect","dojo/on","dojo/dom-construct","dojo/dom-geometry",
	"dijit/layout/ContentPane","dijit/registry",
	"comodojo/Utils","comodojo/Bus","comodojo/Dialog","comodojo/Error","comodojo/Window"],
function(lang,dom,aspect,on,domConstruct,domGeom,ContentPane,registry,utils,bus,dialog,error,Window){

var App = {
	// summary:
	// description:
};
lang.setObject("comodojo.App", App);

App.pushRunning = function(pid, appExec, appName, runMode, applicationLink) {
	// summary:
	//		Push application in running register
	// returns:
	//		Index of the application in running register
	comodojo.debugDeep('Registering in running register the application: '+appName+' ('+appExec+') with pid: '+pid.split('_')[1]);
	return bus.pushRunningApplication(pid, appExec, appName, runMode, applicationLink);
};
	
App.pullRunning = function(pid) {
	// summary:
	//		Remove application from running register
	// returns: bool
	var p = bus.pullRunningApplication(pid);
	if (!p) {
		comodojo.debugDeep('Failed to unregister application with pid: '+pid);
	}
	else {
		comodojo.debugDeep('Application with pid: '+pid+' removed from running register');
	}
	return p;
};

App.isRunning = function(appExec) {
	// summary:
	//		Check if application is running
	// returns: bool
	var i;
	for (i in bus._runningApplications) {
		if (bus._runningApplications[i][1] == appExec) {
			return true;
		}
	}
	return false;
};

App.isRegistered = function(appExec) {
	return bus.getRegisteredApplication(appExec);
};

App.getPid = function(appExec) {
	var instances = [];
	var i;
	for (i in bus._runningApplications) {
		if (bus._runningApplications[i][1] == appExec) {
			instances.push(bus._runningApplications[i][0]);
		}
	}
	if (instances.length == 0) {
		return false;
	}
	else if(instances.length == 1) {
		return instances[0];
	}
	else {
		return instances;
	}
};

App.byPid = function(pid) {
	var n;
	for (n in bus._runningApplications) {
		if (bus._runningApplications[n][0] == pid) {
			return bus._runningApplications[n][4];
		}
		else { continue; }
	}
	return false;
};

App.byExec = function(appExec) {
	var instances = [];
	var i;
	for (i in bus._runningApplications) {
		if (bus._runningApplications[i][1] == appExec) {
			instances.push(bus._runningApplications[i][4]);
		}
	}
	if (instances.length == 0) {
		return false;
	}
	else if(instances.length == 1) {
		return instances[0];
	}
	else {
		return instances;
	}
};

App.getExec = function(pid) {
	var n;
	for (n in bus._runningApplications) {
		if (bus._runningApplications[n][0] == pid) {
			return bus._runningApplications[n][1];	
		}
		else {
			continue;
		}
	}	
	return false;
};


App.preload = function(appExec, pid, applicationSpace, status) {
	var appExecFile = comodojo.applicationsPath+appExec+"/"+appExec+".js";
	
	comodojo.loadScriptFile(appExecFile,{/*sync:true*/},function() {
		comodojo.App.launch(appExec, pid, applicationSpace, status);
	});
};

App.load = function(appExec, application) {
	var reg = bus.registerApplication(appExec, application);
	if (!reg) {
		comodojo.debug('Unable to load application: '+appExec+'; maybe yet in registry?');
	}
	else {
		comodojo.debug('Loaded application: '+appExec);
	}
};

App.autostart = function() {
	comodojo.debug('Launching applications to autostart');
	for (var i in comodojo.Bus._autostartApplications) {
		comodojo.App.start(comodojo.Bus._autostartApplications[i]);
	};
};

App.start = function(appExec, status) {

	var app_reg = bus.getRegisteredApplication(appExec);

	// First, check if application is registered
	if (!app_reg) {
		comodojo.debug("Failed to start application '"+appExec+"': application not registered.");
		bus.callEvent('comodojo_app_error');
		error.generic("10029",comodojo.getLocalizedMessage('10029'),'Application not registered');
		return false;
	}

	// Then check if app is running, so check if it's unique
	if(App.isRunning(appExec) && bus._registeredApplications[appExec].properties.unique) {
		if (bus._registeredApplications[appExec].properties.forceReInit) {
			comodojo.debug("Requested to start a running application tagged as unique & to-re-init, application will be restarted.");
			App.restart(App.getPid(appExec));
			return true;
		}
		else {
			comodojo.debug("Requested to start a running application tagged as unique, now focusing.");
			App.byExec(appExec).focusOn();
			return true;
		}
	}
	
	comodojo.debug('Request to start new application: '+bus._registeredApplications[appExec].properties.title+' ('+appExec+').');

	bus.callEvent('comodojo_app_load_start');

	var pid = comodojo.getPid();
	var prop = bus._registeredApplications[appExec].properties;
	var applicationSpace = false;
	var loadingState = domConstruct.create('div',{
		innerHTML: prop.runMode == "system" ? '<span><img src="comodojo/images/small_loader.gif" />' + comodojo.getLocalizedMessage("10007") + '</span>' : '<p style="text-align: center; padding: 10px;" ><img src="comodojo/images/small_loader.gif" /></p><p style="font-weight: bold; font-size: large; text-align: center;">'+prop.title+'</p><p style="text-align: center;">'+prop.description+'</p>'	
	});
	var icon = prop.iconSrc == 'self' ? (comodojo.applicationsPath + appExec + '/resources/icon_16.png') : comodojo.icons.getIcon('run',16);
	
	switch(prop.type) {
		
		case 'windowed':

			applicationSpace = new Window.application(pid,prop.title,prop.width,prop.height,prop.resizable,prop.maxable,icon);
		
			aspect.after(applicationSpace, 'close', function(){
				applicationSpace.minNode.style.display = "none";
				applicationSpace.closeNode.style.display = "none";
				applicationSpace.maxNode.style.display = "none";
				applicationSpace.restoreNode.style.display = "none";
				applicationSpace.closeNode.style.display = "none";
				comodojo.App.kill(pid);
			});
				
			applicationSpace.set('isComodojoApplication',"WINDOWED");
				
			applicationSpace.containerNode.style.display = "none";
			applicationSpace.lockNode = loadingState;
			applicationSpace.canvas.appendChild(applicationSpace.lockNode);
				
			applicationSpace.bringToTop();

		break;

		case 'modal':

			applicationSpace = dialog.application(pid, prop.title, "", false);

			var reSize = {};
			if (prop.width != false) {
				reSize.w = parseInt(prop.width,10)+'px';
			} 
			if (prop.height != false) {
				reSize.h = parseInt(prop.height,10)+'px';
			}
			
			applicationSpace.set('isComodojoApplication',"MODAL");
			applicationSpace.containerNode.style.display = "none";
			applicationSpace.lockNode = loadingState;
			applicationSpace.domNode.appendChild(applicationSpace.lockNode);
			
			if (utils.defined(reSize.w) || utils.defined(reSize.h)) {
				applicationSpace._layout(false, resSize);
			}
			
			applicationSpace._position();
				
			applicationSpace.on('cancel',function() {
				comodojo.App.kill(pid);
			});

		break;

		case 'attached':
		
			var myNode;
			if (prop.attachNode == "body") {
				myNode = dojo.body();
			}
			else if (typeof prop.attachNode == "object") {
				myNode = prop.attachNode;
			}
			else {
				myNode = dom.byId(prop.attachNode);
			}

			var as_width,as_height;
			if (prop.width == "auto") { as_width = (domGeom.getMarginBox(myNode).w - 2) + "px"; }
			else if (isFinite(prop.width)) { as_width = prop.width + "px"; }
			else { as_width = prop.width; }
			if (prop.height == "auto") { as_height = (domGeom.getMarginBox(myNode).h - 2) + "px"; }
			else if (isFinite(prop.height)) { as_height = prop.height + "px"; }
			else { as_height = prop.height; }

			if (!prop.requestSpecialNode) {
				applicationSpace = new ContentPane({
					id: pid,
					preventCache: true,
					style: 'width:'+as_width+'height:'+as_height
				});
				applicationSpace.on('close',function() {comodojo.App.kill(pid);});
			}
			else {
				applicationSpace = domConstruct.create(prop.requestSpecialNode, {
					id: pid,
					style: 'width:'+as_width+'height:'+as_height
				});
				applicationSpace.domNode = applicationSpace;
				applicationSpace.startup = function() {return;};
				applicationSpace.close = function() {
					comodojo.App.kill(pid);
				};
				applicationSpace.containerNode = domConstruct.create(prop.requestSpecialNode, {
					id: pid+"_containerNode"
				});
			}

			applicationSpace.isComodojoApplication = "ATTACHED";
			applicationSpace.containerNode.style.display = "none";
			applicationSpace.lockNode = loadingState;
			applicationSpace.domNode.appendChild(applicationSpace.lockNode);

			myNode.appendChild(applicationSpace.domNode);

		break;

		default:
			comodojo.debug("Failed to start application '"+appExec+"': unsupported display mode.");
			bus.callEvent('comodojo_app_error');
			error.generic("10029",comodojo.getLocalizedMessage('10029'),'Unsupported display mode');
			return false;
		break; 

	}

	App.preload(appExec, pid, applicationSpace, status);
};

App.launch = function(appExec, pid, applicationSpace, status) {
	//console.log(appExec);
	//console.log(pid);
	//console.log(applicationSpace);
	//console.log(status);

	var newApp = new bus._registeredApplications[appExec].exec(pid, applicationSpace, status);
	/*
	catch (e) {
		comodojo.debug('Application '+appExec+' did not load itself:');
		comodojo.debug(e);
		comodojo.Error.generic('0000', 'Application did not load', e);
		//applicationSpace.containerNode.innerHTML = e;
		bus.callEvent('comodojo_app_error');
		App.kill(pid);
		return;
	}*/
	
	App.pushRunning(pid, appExec, bus._registeredApplications[appExec].properties.title, bus._registeredApplications[appExec].properties.runMode, newApp);
	
	newApp.isComodojoApplication = applicationSpace.isComodojoApplication;
	newApp.lock = function() { comodojo.App.lock(pid); };
	newApp.release = function() { comodojo.App.release(pid); };
	newApp.getLocalizedMessage = function(messageCode) { return comodojo.App.getLocalizedMessage(appExec, messageCode); };
	newApp.getLocalizedMutableMessage = function(messageCode, params) { return comodojo.App.getLocalizedMutableMessage(appExec, messageCode, params); };
	newApp.error = function(ec, ed) {
		bus.callEvent('comodojo_app_error');
		error.generic(ec, comodojo.App.getLocalizedMessage(appExec, ec), ed);
	};
	newApp.stop = function() { comodojo.App.stop(pid); };
	newApp.restart = function() { comodojo.App.restart(pid); };
	newApp.resourcesPath = comodojo.applicationsPath+appExec+'/resources/';
	
	applicationSpace.containerNode.style.display = "block";
	applicationSpace.lockNode.style.display = "none";

	try {
		newApp.init();
		applicationSpace.startup();
		if (applicationSpace.isComodojoApplication == "MODAL") {
			setTimeout(function() {
				registry.byId(pid)._position();
			},500);
		}
		bus.callEvent('comodojo_app_load_end');
	}
	catch (e) {
		comodojo.debug('Application '+appExec+' got error:');
		comodojo.debug(e);
		comodojo.Error.generic('0000', 'Application error', e);
		//applicationSpace.containerNode.innerHTML = e;
		bus.callEvent('comodojo_app_error');
		App.kill(pid);
	}
	
};

App.restart = function(pid) {
	var p = App.getExec(pid);
	if (!p) {
		comodojo.debug('Could not restart application: '+pid);
	}
	else {
		App.stop(pid);
		setTimeout(function() {comodojo.App.start(p);}, 1000);
	}
};

App.stop = function(pid) {
	var app = App.byPid(pid);
	if (!app) {
		comodojo.debug('Could not stop application, invalid pid reference or application not running (pid not found): '+pid);
	}
	else {
		switch (app.isComodojoApplication){
			case "WINDOWED":
				app.close();
				comodojo.debug('Stopping windowed application: '+pid);
			break;
			case "MODAL":
				app.onCancel();
				comodojo.debug('Stopping modal application: '+pid);
			break;
			case "ATTACHED":
				app.close();
				comodojo.debug('Stopping attached application: '+pid);
				domConstruct.destroy(pid);
			break;
			default:
				comodojo.debug('Could not stop application: invalid application format: '+pid);
			break;
		}
	}
};

App.kill = function(pid) {
	App.pullRunning(pid);
	comodojo.debug('Application stopped: '+pid);
	if (dom.byId(pid)) {
		comodojo.debug('Application presentation still running, killing it');
		domConstruct.destroy(pid);
	}
};

App.stopAll = function(stopSystemApps, callback) {
	comodojo.debug(!stopSystemApps ? 'Stopping USER applications' : 'Stopping ALL applications');
	
	var count = 0;
	var toStop = [];
	
	var i,o;
	for (i in bus._runningApplications) {
		if (bus._runningApplications[i][3] == 'system' && !stopAlsoSystemApps) {
			continue;
		}
		else {
			toStop.push(bus._runningApplications[i][0]);
			count++;
		}
	}
	
	for (o in toStop) {
		App.stop(toStop[o]);	
	}
	comodojo.debug('Stopped '+count+' applications');
	if (lang.isFunction(callback)) { callback(); }
};

App.stopAnyInstance = function(appExec) {
	comodojo.debug('Stopping any istance of: '+appExec);
	
	var instances = App.getPid(appExec);
	var count = 0;
	
	if (!instances) {
		comodojo.debug('No instances of "'+appexec+'" currently running');
		return;
	}
	else if (lang.isArray(instances)) {
		var i;
		for (i in instances) {
			App.stop(instances[i]);
			count++;
		}
	}
	else {
		App.stop(instances);
		count++;
	}
	comodojo.debug('Stopped '+count+' instance(s) of '+appExec);
};


App.loadCss = function(appExec) {
	return comodojo.loadCss(comodojo.applicationsPath + appExec + '/resources/' + appExec + '.css');
};
	
App.getLocalizedMessage = function(appExec, messageCode) {
	return comodojo.getLocalizedMessage(messageCode, bus._registeredApplications[appExec].i18n);
};
	
App.getLocalizedMutableMessage = function(appExec, messageCode, params) {
	return comodojo.getLocalizedMutableMessage(messageCode, params, bus._registeredApplications[appExec].i18n);
};

App.lock = function(pid) {
	var apl = App.byPid(pid);
	if (!apl) {
		return false;
	}
	else {
		apl.containerNode.style.display = "none";
		apl.lockNode.style.display = "block";
		return true;
	}
};

App.release = function(pid) {
	var apl = App.byPid(pid);
	if (!apl) {
		return false;
	}
	else {
		apl.containerNode.style.display = "block";
		apl.lockNode.style.display = "none";
		return true;
	}
};

App.setFocus = function(pid) {
	if (!App.isRunning(App.getExec(pid))) {
		comodojo.debug('Cannot focus on, application not running: '+pid);
		return;
	}

	var a = App.byPid(pid);
	if (a.isComodojoApplication == "WINDOWED") {
		if (a._isMinimized) {
			a.show();
		}
		a.bringToTop();
	}
	else {
		a.focus();
	}
};

});