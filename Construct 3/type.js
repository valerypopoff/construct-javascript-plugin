"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.ValerypopoffJSPlugin;
	
	PLUGIN_CLASS.Type = class ValerypopoffJSType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}