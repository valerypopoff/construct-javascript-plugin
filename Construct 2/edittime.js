function GetPluginSettings()
{
	return {
		"name":			"Valerypopoff JS Plugin",				
		"id":			"ValerypopoffJSPlugin",	
		"version":		"0.6.2",			
		"description":	"Use javascript functions, get and set object properties and call object methods. Keep event sheets for high-level logic. Implement game objects, and algorithms in javascript.",
		"author":		"Valera Popov",
		"help url":		"https://readymag.com/valerypopoff/valerypopoff-js-plugin/",
		"category":		"Data & Storage",				
		"type":			"object",			// not in layout
		"rotatable":	false,
		"flags":		pf_singleglobal
	};
};


////////////////////////////////////////
// Conditions

AddAnyTypeParam("Value", "The value to compare to.");
AddCmpParam("Comparison", "How to compare.");
AddStringParam("JS function name (no parentheses)", "Enter JS function name to call.");
AddVariadicParams("Parameter {n}", "Parameter to pass to the function.");
AddCondition(0, cf_none, "Compare Function Return value", "General", "{0} {1} function {2} ({...})", "Call JS function and compare its return value (does NOT store return value).", "CompareFunctionReturnValue");


AddAnyTypeParam("Value", "The value to compare to.");
AddCmpParam("Comparison", "How to compare.");
AddStringParam("JS code", "JS string that will be executed with eval. You can include parameters into the string using #-entries like this: #0, #1, #2 ... #999. The string will be parsed and all #-entries will be replaced with respective parameter values.");
AddVariadicParams("Parameter {n}", "Parameter to pass to the code.");
AddCondition(1, cf_none, "Compare JS code Completion value", "Eval", "{0} {1} value of {2} ({...})", "Compare completion value of JS code with optional parameters (does NOT store return value). This condition uses eval.", "CompareExecReturnWithParams");


AddCmpParam("Comparison", "How to compare.");
AddAnyTypeParam("Value", "The value to compare to.");
AddCondition(2, cf_none, "Compare Stored Return value", "General", "Stored Return {0} {1}", "Compare last stored return value after actions.", "CompareStoredReturnValue");


AddCondition(3, cf_none, "All scripts loaded", "General", "All scripts loaded", "Check if all scripts are loaded.", "AllScriptsLoaded");


AddStringParam("Alias expression", "Alias expression to compare.");
AddCmpParam("Comparison", "How to compare.");
AddAnyTypeParam("Value", "The value to compare to.");
AddCondition(4, cf_none, "Compare alias", "Aliases", "[{0}] {1} {2}", "Compare the value behind the alias expression.", "CompareAliasValue");


AddAnyTypeParam("Value", "The value to compare to.");
AddCmpParam("Comparison", "How to compare.");
AddStringParam("Alias expression", "Alias expression to call.");
AddVariadicParams("Parameter {n}", "Parameter to pass to the function.");
AddCondition(5, cf_none, "Compare alias Call", "Aliases", "{0} {1} [{2}] ({...})", "Call JS function behind the alias expression and compare its return value (does NOT store return value).", "CompareAliasCallReturnValue");



////////////////////////////////////////
// Actions

AddStringParam("JS code", "JS string that will be executed with eval. You can include parameters into the string using #-entries like this: #0, #1, #2 ... #999. The string will be parsed and all #-entries will be replaced with respective parameter values.");
AddVariadicParams("Parameter {n}", "Parameter to pass to the code.");
AddAction(0, af_none, "Execute JS code (stores return value)", "Eval", "Execute code: {0} ({...})", "Execute JS code with optional parameters and store returned completion value. This action uses eval.", "ExecuteJSWithParams");


AddStringParam("JS function name (no parentheses)", "Enter JS function name to call.");
AddVariadicParams("Parameter {n}", "Parameter to pass to the function.");
AddAction(1, af_none, "Call JS function (stores return value)", "General", "Call function: {0} ({...})", "Call JS function with optional parameters and store its return value.", "CallJSfunction");


AddStringParam("Alias name", "New alias name to create.");
AddStringParam("JS", "What the alias is associated with in JS.");
AddAction(2, af_none, "Init alias", "Aliases", "Init [{0}] with javascript {1}", "Init alias with javascript code.", "InitAlias");


AddStringParam("Alias expression", "Alias expression to set.");
AddAnyTypeParam("Value", "Value to set the alias expression to.");
AddAction(3, af_none, "Set alias", "Aliases", "Set [{0}] to {1}", "Set value behind alias expression.", "SetAlias");


AddStringParam("Alias expression", "Alias expression to call.");
AddVariadicParams("Parameter {n}", "Parameter to pass to the function.");
AddAction(4, af_none, "Call alias (stores return value)", "Aliases", "Call [{0}] ({...})", "Call the function behind alias expression and store its return value.", "CallAlias");



////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_any, "Stored Return Value", "General", "StoredReturnValue", "Get stored return value after actions");


AddStringParam("JS code", "This expression uses eval. Enter JS string (it will be executed with eval) and optional parameters. If you pass parameters, include them into the string using #-entries like this: #0, #1, #2 ... #999. The string will be parsed and all #-entries will be replaced with respective parameter values.");
AddExpression(1, ef_return_any | ef_variadic_parameters, "JS Code Value", "Eval", "JSCodeValue", "Execute JS code with optional parameters and get its completion value right away (it will NOT store this value)");


AddStringParam("Alias expression", "Enter alias expression.");
AddExpression(2, ef_return_any | ef_variadic_parameters, "Alias value", "Aliases", "AliasValue", "Get alias value");



////////////////////////////////////////
ACESDone();

////////////////////////////////////////

var property_list = [
	new cr.Property(ept_text, 'Script files', '', 'Javascript files to include to the game.'),
	
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}