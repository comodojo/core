define(["dojo/_base/lang","dojo/dom-construct","dojo/dom-attr","dojo/on","dojo/json","comodojo/Dialog-base","comodojo/Bus","comodojo/Utils","dojo/domReady!"],
function(lang,domConstruct,domAttr,on,JSON,dialogBase,bus,utils){

// module:
// 	comodojo/Dialog
	
var Dialog = {
	// summary:
	// description:
};
lang.setObject("comodojo.Dialog", Dialog);

Dialog.custom = function(params) {
	return new dialogBase(params);
};

Dialog.application = function(Id, Title, Content, Forced, Width, Height) {

	return new dialogBase({
		id: Id,
		title: Title,
		content: Content,
		forced: Forced,
		draggable: false,
		_isApplication: true,
		persistent: true,
		width: utils.defined(Width) ? Width : false,
		height: utils.defined(Height) ? Height : false
	});

};

Dialog.modal = function(Title, Content, Forced, Persistent) {

	return new dialogBase({
		title: Title,
		content: Content,
		forced: Forced,
		persistent: Persistent
	});

};

Dialog.remote = function(Title, Href, Forced, Persistent) {

	return new dialogBase({
		title: Title,
		href: Href,
		forced: Forced,
		persistent: Persistent
	});

};

Dialog.info = function(Content, Title) {
	
	return new dialogBase({
		title: !Title ? "" : Title,
		content: Content,
		primaryCloseButton: false,
		secondaryCloseButton: true,
		parseOnLoad: false
	});

};

Dialog.action = function(Title, Content, ActionOk, ActionCancel) {

	return new dialogBase({
		id: 'actionDialog',
		title: Title,
		content: Content,
		forced: true,
		blocker: false,
		hided: false,
		draggable: false,
		actionOk: ActionOk,
		closeOnOk: true,
		actionCancel: ActionCancel,
		closeOnCancel: true
	});

};

Dialog.warning = function(Title, Content, ActionOk, ActionCancel) {

	return new dialogBase({
		id: 'warningDialog',
		title: Title,
		content: Content,
		forced: true,
		blocker: false,
		hided: false,
		draggable: false,
		actionOk: ActionOk,
		closeOnOk: true,
		actionCancel: ActionCancel,
		closeOnCancel: true
	});

};

Dialog.input = function(Title, Message, Callback) {

	var content=domConstruct.create('input',{
		style: "padding: 4px; width: 300px; margin-top:10px; font-size:110%;"
	});

	var message=domConstruct.create('p',{
		className: "box info",
		style: "width: 280px;",
		innerHTML: Message
	});

	var cbox = domConstruct.create('div',{
		style: "text-align:center"
	});

	if (Message != false) { cbox.appendChild(message); }
	cbox.appendChild(content);

	var d = new dialogBase({
		id: 'actionDialog',
		title: Title,
		content: cbox,
		forced: true,
		blocker: false,
		hided: false,
		draggable: false,
		actionOk: function() {
			if ($d.isFunction(Callback)) {
				Callback(content.value);
			}
		},
		closeOnOk: true,
		actionCancel: false,
		closeOnCancel: true,
		focusKilled: false
	});

	content.focus();

	return d;
	
};

Dialog.timed = function(Title, Content, Time) {

	return new dialogBase({
		title: Title,
		content: Content,
		timer: Time,
		primaryCloseButton: false,
		secondaryCloseButton: true
	});

};

Dialog.select = function(Title, Message, Options, Callback) {

	var i=0, content=domConstruct.create('select'), select, option, type;

	for (i in Options) {
		type = typeof Options[i].id;
		option = domConstruct.create('option',{
			innerHTML: Options[i].label,
			value: JSON.stringify(Options[i].id)
		});
		content.appendChild(option);
	}

	var message=domConstruct.create('p',{
		className: "box info",
		style: "width: 280px;",
		innerHTML: Message
	});

	var cbox = domConstruct.create('div',{
		style: "text-align:center"
	});

	if (Message != false) { cbox.appendChild(message); }
	cbox.appendChild(content);

	var d = new dialogBase({
		id: 'actionDialog',
		title: Title,
		content: cbox,
		forced: true,
		blocker: false,
		hided: false,
		draggable: false,
		actionOk: function() {
			if ($d.isFunction(Callback)) {
				Callback(JSON.parse(content.value));
			}
		},
		closeOnOk: true,
		actionCancel: false,
		closeOnCancel: true,
		focusKilled: false
	});

	content.focus();

	return d;

};

Dialog.password = function(Title, Message, Callback) {

	var content=domConstruct.create('input',{
		type:'password',
		style: "padding: 4px; width: 300px; margin-top:10px; font-size:110%;"
	});

	var message=domConstruct.create('p',{
		className: "box info",
		style: "width: 280px;",
		innerHTML: Message
	});

	var cbox = domConstruct.create('div',{
		style: "text-align:center"
	});

	if (Message != false) { cbox.appendChild(message); }
	cbox.appendChild(content);

	var d = new dialogBase({
		id: 'actionDialog',
		title: Title,
		content: cbox,
		forced: true,
		blocker: false,
		hided: false,
		draggable: false,
		actionOk: function() {
			if ($d.isFunction(Callback)) {
				Callback(content.value);
			}
		},
		closeOnOk: true,
		actionCancel: false,
		closeOnCancel: true,
		focusKilled: false
	});

	content.focus();

	return d;

};

return Dialog;
	
});