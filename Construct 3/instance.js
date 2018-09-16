"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.ValerypopoffJSPlugin;
	
	PLUGIN_CLASS.Instance = class ValerypopoffJSPluginInstance extends SDK.IInstanceBase
	{
		constructor(sdkType, inst)
		{
			super(sdkType, inst);
		}
		
		Release()
		{
		}
		
		OnCreate()
		{
		}
		
		OnPropertyChanged(id, value)
		{
		}
		
		LoadC2Property(name, valueString)
		{
			switch(name) 
			{
				case "Script files".toLowerCase().split(" ").join("-"):
					this._inst.SetPropertyValue("Scriptfiles", valueString);
					return true;
					
			}	
			
			return false;
		}
	};
}