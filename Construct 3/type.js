"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.ValerypopoffJSPlugin;
	
	PLUGIN_CLASS.Type = class ValerypopoffJSPluginType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}