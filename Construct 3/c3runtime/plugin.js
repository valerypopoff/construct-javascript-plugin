"use strict";

var __CONSTRUCT2_RUNTIME2__ = false;
var __CONSTRUCT3_RUNTIME2__ = false;
var __CONSTRUCT3_RUNTIME3__ = true;
var __DEBUG__ = false;

if( typeof cr == "undefined" )
{
	var cr = {};
	
	cr.do_cmp = function (x, cmp, y)
	{
		if (typeof x === "undefined" || typeof y === "undefined")
			return false;
			
		switch (cmp)
		{
			case 0:     // equal
				return x === y;
			case 1:     // not equal
				return x !== y;
			case 2:     // less
				return x < y;
			case 3:     // less/equal
				return x <= y;
			case 4:     // greater
				return x > y;
			case 5:     // greater/equal
				return x >= y;
			default:
				assert2(false, "Invalid comparison value: " + cmp);
				return false;
		}
	};
}

{
	C3.Plugins.ValerypopoffJSPlugin = class ValerypopoffJSPluginPlugin extends C3.SDKPluginBase
	{
		constructor(opts)
		{
			super(opts);
		}
		
		Release()
		{
			super.Release();
		}
	};
}