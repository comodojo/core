define(["dojo/_base/lang","dojo/aspect","comodojo/Utils"],
function(lang,aspect,utils){

// module:
// 	comodojo/Bus

var Bus = {
	// summary:
	// description:
};
lang.setObject("comodojo.Bus", Bus);

Bus._connections = {};

Bus._triggers = {};

//Bus._locks = {};

Bus._events = {};

Bus._tmp = {};

Bus._timestamps = {};

// Registered application registry
// Object
Bus._registeredApplications = {};

// Running application registry
// Array
Bus._runningApplications = [];

// Autostart application registry
// Array
Bus._autostartApplications = [];

Bus.addTrigger = function(trigger, functionString, time) {
	// summary:
	//		Add a trigger to the bus
	// trigger: String
	//		The trigger name
	// functionString: String|Function
	//		The function called on each trigger start
	// time: Int
	//		Time interval
	Bus._triggers[trigger] = setInterval(functionString, time);
};

Bus.removeTrigger = function(trigger) {
	// summary:
	//		Remove a trigger from the bus
	// trigger: String
	//		The trigger name
	clearInterval(Bus._triggers[trigger]);
};

Bus.addConnection = function(connection, evt, func) {
	// summary:
	//		Add a connection to the bus
	// connection: String
	//		The connection name
	// event: String
	//		The event connected
	// func: Function
	//		The function to connect to event
	Bus.addEvent(evt);
	Bus._connections[connection] = aspect.after(Bus._events, evt, func);
};

Bus.removeConnection = function(connection) {
	// summary:
	//		Remove a connection from the bus
	// connection: String
	//		The connection name
	Bus._connections[connection].remove();
};
		
Bus.addTimestamp = function(service, selector) {
	// summary:
	//		Add a timestamp reference to the bus
	// service: String
	//		The service reference (see kernel part)
	// selector: String
	//		The selector reference (see kernel part)
	// returns:
	//		Timestamp, as recorder
	if (!service || !selector) {return false;}
	var timestamp = Math.round(new Date().getTime()/1000);
	if (!lang.isArray(Bus._timestamps[service])) {
		Bus._timestamps[service] = [];
	}
	Bus._timestamps[service][selector] = timestamp;
	comodojo.debugDeep('Timestamp added to '+service+'/'+selector+': '+timestamp);
	return timestamp;
};

Bus.updateTimestamp = function(service, selector) {
	// summary:
	//		Update a timestamp reference
	// service: String
	//		The service reference (see kernel part)
	// selector: String
	//		The selector reference (see kernel part)
	// returns:
	//		Timestamp, as recorder
	comodojo.debugDeep('Timestamp updated to '+service+'/'+selector);
	return Bus.addTimestamp(service, selector);
};

Bus.removeTimestamp = function(service, selector) {
	// summary:
	//		Update a timestamp reference
	// service: String
	//		The service reference (see kernel part)
	// selector: String
	//		The selector reference (see kernel part)
	// returns: Bool
	//		True in case of success, false otherwise
	if (!lang.isString(service) || !lang.isString(selector) || !lang.isArray(comodojo.Bus._timestamps[service]) || isNaN(comodojo.Bus._timestamps[service][selector])) {
		comodojo.debugDeep('Cannot remove timestamp from '+service+'/'+selector);
		return false;
	}
	else {
		delete comodojo.Bus._timestamps[service][selector];
		comodojo.debugDeep('Removed timestamp from '+service+'/'+selector);
		return true;
	}
};

Bus.getTimestamp = function(service, selector) {
	// summary:
	//		Get a timestamp reference
	// service: String
	//		The service reference (see kernel part)
	// selector: String
	//		The selector reference (see kernel part)
	// returns:
	//		Timestamp, as recorded, in case of success, false otherwise
	if (!lang.isString(service) || !lang.isString(selector) || !lang.isArray(Bus._timestamps[service]) || isNaN(Bus._timestamps[service][selector])) {
		return false;
	}
	else {
		return Bus._timestamps[service][selector];
	}
};

Bus.getTimestampAndUpdate = function(service, selector) {
	// summary:
	//		Get a timestamp reference and update it at same time
	// service: String
	//		The service reference (see kernel part)
	// selector: String
	//		The selector reference (see kernel part)
	// returns:
	//		Timestamp, as recorded, in case of success, false otherwise
	if (!lang.isString(service) || !lang.isString(selector) || !lang.isArray(comodojo.Bus._timestamps[service]) || isNaN(comodojo.Bus._timestamps[service][selector])) {
		return false;
	}
	else {
		var value = comodojo.Bus._timestamps[service][selector];
		comodojo.Bus.addTimestamp(service,selector); 
		return value;
	}
};

Bus.addEvent = function(evt) {
	// summary:
	//		Add an event to the bus
	// evt: String
	//		The event name
	if (!lang.isFunction(comodojo.Bus._events[evt])) {
		comodojo.Bus._events[evt] = function(){
			return;
		};
		comodojo.debugDeep("Added new event: " + evt);
	}
	else {
		comodojo.debugDeep("Event: " + evt + " is already registered");
	}
};

Bus.removeEvent = function(evt) {
	// summary:
	//		Remove an event from the bus
	// evt: String
	//		The event name
	if (!lang.isFunction(comodojo.Bus._events[evt])) {
		comodojo.debugDeep("Event " + evt + " is not registered");
	}
	else {
		delete comodojo.Bus._events.evt;
		comodojo.debugDeep("Removed event: " + evt);
	}
};
		
Bus.callEvent = function(evt){
	// summary:
	//		Call an event
	// evt: String
	//		The event name
	if (lang.isFunction(Bus._events[evt])) {
		comodojo.debugDeep("Called event: " + evt + ", raising...");
		Bus._events[evt]();
	}
	else {
		comodojo.debugDeep("Event: " + evt + " is not registered");
	}
};

Bus.registerApplication = function(appExec, application) {
	// summary:
	//		Add an application to registered registry
	// appExec: String
	//		The application exec (app name)
	// application: Function
	//		Application function
	// returns:
	//		True in case of success, false otherwise
	var r;
	if (!utils.defined(Bus._registeredApplications[appExec])) {
		Bus._registeredApplications[appExec] = {};
		Bus._registeredApplications[appExec].exec = application;
		Bus.callEvent("comodojo_app_registered_registry_change");
		r = true;
	}
	else if (!lang.isFunction(Bus._registeredApplications[appExec].exec)) {
		Bus._registeredApplications[appExec].exec = application;
		r = true;
	}
	else {
		r = false;
	}
	return r;
};

Bus.unregisterApplication = function(appExec) {
	// summary:
	//		Remove an application from registered registry
	// appExec: String
	//		The application exec (app name)
	// returns:
	//		True in case of success, false otherwise
	var r;
	if (!utils.defined(Bus._registeredApplications[appExec])) {
		r = false;
	}
	else {
		delete Bus._registeredApplications[appExec];
		Bus.callEvent("comodojo_app_registered_registry_change");
		r = true;
	}
	return r;
};

Bus.getRegisteredApplication = function(appExec) {
	// summary:
	//		Get registered application (if any)
	// appExec: String
	//		The application exec (app name)
	// returns:
	//		Application in case of success, false otherwise
	var r;
	if (!utils.defined(Bus._registeredApplications[appExec])) {
		r = false;
	}
	else {
		r = Bus._registeredApplications[appExec];
	}
	return r;
};

Bus.getRegisteredApplications = function() {
	// summary:
	//		Get a list of registered applications
	// returns:
	//		Array of applications (array of names)
	return Bus._registeredApplications.keys();
};

Bus.pushRunningApplication = function(pid, appExec, appName, runMode, applicationLink) {
	// summary:
	//		Add application to running register
	// pid: String
	//		Application PID
	// appExec: 
	//		Application exec
	// appName: String
	//		Application name
	// runMode: String
	//		Running mode (system/user)
	// applicationLink:
	//		Application link
	// returns: Integer
	//		Application index in running registry
	var l = Bus._runningApplications.push(Array(pid, appExec, appName, runMode, applicationLink));
	Bus.callEvent("comodojo_app_running_registry_change");
	return l-1;
};

Bus.pullRunningApplication = function(pid) {
	// summary:
	//		Remove application from running register
	// pid: String
	//		Application PID
	// returns: Bool
	//		True in case of success, false otherwise
	var i, r=false;
	for (i in Bus._runningApplications) {
		if (Bus._runningApplications[i][0] == pid) {
			Bus._runningApplications.splice(i,1);
			Bus.callEvent("comodojo_app_running_registry_change");
			r=true;
		}
		else {
			continue;
		}
	}
	return r;
};

Bus.getRunningApplication = function(pid) {
	// summary:
	//		Get running application by pid
	// returns:
	//		Object containing application name, exec, link or false if app not found
	var app = false;
	for (var i in Bus._runningApplications) {
		if (Bus._runningApplications[i][0] == pid) {
			app = {name:Bus._runningApplications[i][2],exec:Bus._runningApplications[i][1],link:Bus._runningApplications[i][4]};
		}
		else {
			continue;
		}
	};
	return app;
};

Bus.getRunningApplications = function(exclude_system,only_pid_ist) {
	// summary:
	//		Get all running applications
	// returns:
	//		Object containing applications name, exec, link referenced by pid
	var apps = only_pid_ist ? [] : {};

	for (var i in Bus._runningApplications) {
		if (exclude_system && Bus._runningApplications[i][3] == 'system') {
			continue;
		}
		if (only_pid_ist) {
			apps.push(Bus._runningApplications[i][0]);
		}
		else {
			apps[Bus._runningApplications[i][0]] = {
				exec:Bus._runningApplications[i][1],
				name:Bus._runningApplications[i][2],
				mode:Bus._runningApplications[i][3],
				link:Bus._runningApplications[i][4]
			};
		}
	};
	return apps;
};

Bus.addAutostartApplication = function(appExec) {
	Bus._autostartApplications.push(appExec);
};

Bus.temp = function(k, v) {
	if (!v) {
		if (utils.defined(Bus._tmp[k])) {
			return Bus._tmp[k];
		}
		else {
			return false;
		}
	}
	else {
		Bus._tmp[k] = v;
		return Bus._tmp[k];
	}
};

//Add std events to the bus:
Bus.addEvent('comodojo_startup_start');
Bus.addEvent('comodojo_startup_end');
Bus.addEvent('comodojo_app_registered_registry_change');
Bus.addEvent('comodojo_app_running_registry_change');
Bus.addEvent('comodojo_app_error');
Bus.addEvent('comodojo_app_load_start');
Bus.addEvent('comodojo_app_load_end');
Bus.addEvent('comodojo_app_require_resize');
Bus.addEvent('comodojo_kernel_start');
Bus.addEvent('comodojo_kernel_end');
Bus.addEvent('comodojo_kernel_error');
Bus.addEvent('comodojo_login_start');
Bus.addEvent('comodojo_login_end');
Bus.addEvent('comodojo_login_error');
Bus.addEvent('comodojo_logout_start');
Bus.addEvent('comodojo_logout_end');
Bus.addEvent('comodojo_logout_error');

return Bus;

});