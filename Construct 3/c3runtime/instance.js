"use strict";


	var IsValidIdentifier = function(name_)
	{	
		var fnNameRegex = /^[$A-Z_][0-9A-Z_$]*$/i;
		return fnNameRegex.test( name_ );
	}

	var DotStringToDotArray = function( str_ )
	{
		// Array of indexes that will be used to dotsplit the string. Only split by dots that are not in brackets
		// To determine whether the dot is in brackets, we use simple logic:
		// if before the dot there's different amount of '[' and ']', the dot is in brackets 
		
		var SplitArray = [];
		var left = 0;
		var right = 0;

		for( var i=0, str_length=str_.length; i<str_length; i++ )
		{
			if( str_[i] == '[' )
			{
				left++;
				continue;
			}

			if( str_[i] == ']' )
			{
				right++;
				continue;
			}

			if( str_[i] == '.' && (left == right) )
			{
				SplitArray.push(i);
			}
		}
	

		// Split the string using the SplitArray
		// ----------------------------------------------------------------------
		
		var Dotparts = [];
		var splitArrayLengthMinusOne = SplitArray.length-1;
		
		SplitArray.forEach( function(currentValue, index, arr)
		{
			var prevValue = SplitArray[index-1];

			var substr = str_.substring( prevValue+1, currentValue );
			if( substr != "" ) Dotparts.push( substr ); 

			//If this is the last dot, push to dotparts the rest of the string
			if( index == splitArrayLengthMinusOne )
			{
				substr = str_.substring( currentValue+1 );
				if( substr != "" ) Dotparts.push( substr ); 
			}
		});

		// If nothing was added to dotparts (if there was no dots), put the whole string
		if( Dotparts.length == 0 )
		{
			Dotparts.push( str_ )
		}


		
		// Trim every Dotparts element and if this is an array access, go to recursion
		//-------------------------------------------------------------------------------------------
		Dotparts.forEach( function(currentValue, index, arr)
		{ 
			// If this is something like [*]
			if( currentValue[0] == '[' )
			arr[index] = DotStringToDotArray( currentValue.substring(1, currentValue.length-1) ) ;
			
		});

		return Dotparts;
	}
	
	var HashtagParamsToCode = function(code_, params_)
	{
		// Replace all #0 #1 #3... in the code to the corresponding parameters
		code_ = code_.replace( /#[0-9]+/g, function(str)
												{
													var temp = params_[ str.substr(1) ];
													
													if (typeof temp === "string")
													return "'" + temp + "'";
													else
													return temp;
												} 
									);

		return code_;
	}
	
	var MakeCallString = function (funcname_,funcparams_)
	{
 		var callstring = funcname_ + "(";
 		
 		if (funcparams_)
		for (var i=0, funcparams_length=funcparams_.length; i<funcparams_length; ++i)
		{
			if (typeof funcparams_[i] === "string")
			callstring = callstring + "'" + funcparams_[i] + "'";
			else
			callstring = callstring + funcparams_[i];

			if( i != funcparams_.length-1 )
			callstring = callstring + ",";					
		}

		callstring = callstring + ")";

		return callstring;
	}

{
	C3.Plugins.ValerypopoffJSPlugin.Instance = class ValerypopoffJSPluginInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Backward compatibility for C2 runtime
			this.properties = properties;

					this.returnValue = undefined;
		this.sciptsToLoad = 0;
		this.Aliases = {};
		this.construct_compare_function_prefix = "ConstructCompare_";

		this.AliasDotpartsCache = 
		{
			count: 0,
			max_count: 1024,
			Dotparts: {},
			AliasNames: {},
			AliasTrailers: {}
		};

		this.NonAliasDotpartsCache =
		{
			count: 0,
			max_count: 2048,
			Dotparts: {}
		};


		//If there's js script file specified, include it into the webpage
		if( this.properties[0] != "" )
		{
			//Script names are separated with '\n' or ';' depending on a Construct version
			var lines = [];
			if( __CONSTRUCT2_RUNTIME2__ )
			{
				lines = this.properties[0].split(';');	
			}
			else
			{
				lines = this.properties[0].split('\n');
			}
			
			for(var i=0; i<lines.length; i++)
			{
				//Skip the string if it's empty or contains only spaces
				var temp = lines[i];
				if( !temp.replace(/\s/g, '').length )
				continue;

				//Remember that we need to load this script
				this.sciptsToLoad++;

				var nameOfExternalScript = "";
				if( __CONSTRUCT2_RUNTIME2__ )
				{
					nameOfExternalScript = lines[i];
				} else
				{
					// C2 runtime
					if( this.runtime !== undefined )
						nameOfExternalScript = this.runtime.getProjectFileUrl( lines[i] );
					// C3 runtime
					else
						nameOfExternalScript = this._runtime.GetAssetManager().GetProjectFileUrl( lines[i] );
				}

				var this_ = this;
				//$.ajax is preferable because it automatically makes the whole game wait until scripts are loaded
				//for some reason if it's not jquery, it doesn't wait autimatically and you have to check if scripts are loaded 				
				if (window.jQuery)
				{  
	 				$.ajax({  
					url: nameOfExternalScript, 
					dataType: "script", 
					async: false,
					success: function(){ this_.sciptsToLoad-- ; } 
					});
			    } else  
				//if jQuery is not presented, load scripts using regular javascript
			    {
					var myScriptTag = document.createElement('script');
					myScriptTag.setAttribute("type","text/javascript");
					myScriptTag.setAttribute("src", nameOfExternalScript);
					myScriptTag.onreadystatechange = function ()
					{
	  					if (this.readyState == 'complete') 
	  					this_.sciptsToLoad--; 
					}
					myScriptTag.onload = function(){ this_.sciptsToLoad--; };

					document.getElementsByTagName("head")[0].appendChild(myScriptTag);
			    }
			}
		}		
		}
		
		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				// data to be saved for savegames
			};
		}
		
		LoadFromJson(o)
		{
			// load state for savegames
		}
	};


	var InstanceFunctionsObject = {
	ShowError( info )
	{

		var error_str = "ValerypopoffJS plugin: Error in " + info.caller_name + "\n";
		error_str += "--------------------- \n";


		if( __DEBUG__ )
		{
			error_str += "DEBUG CALLER: " + info.debug_caller + "\n";
			error_str += "--------------------- \n";
		}

		if( info["show-alias-expression"] )
		{
			error_str += "Alias expression: " + info.alias_expression + "\n";
			error_str += "--------------------- \n";
		}

		if( info["show-code"] )
		{
			error_str += "JS code: " + info.code + "\n";
			error_str += "--------------------- \n";
		}		
		
		error_str += info.error_message;

		console.error( error_str );	
	},
	
	Resolve( dotparts_, caller_name_, code_, alias_name_, alias_trailer_ )
	{
		var context = window;
		var end = context;
		var endname = "";
		//var prevname = "";

		for( var i=0, dotparts_length=dotparts_.length; i<dotparts_length; i++ )
		{
			endname = dotparts_[i];

			if( typeof(endname) == "object" )
			{
				var temp = this.Resolve( endname, caller_name_, code_, alias_name_, alias_trailer_ );

				if( temp.error ) return {error: true}				
					
				endname = temp.end;


				try
				{
					end = end[endname];
				}
				catch(err)
				{
					//if (err instanceof TypeError)
			 		//err.message = prevname + " is undefined";
				 	var info = 
				 	{
				 		debug_caller: "Resolve",
				 		caller_name: caller_name_,		 		
				 		error_message: err.message,
				 		"show-code": true,
				 		code: code_
				 	}

				 	if( alias_name_ )
				 	{
				 		info["show-alias-expression"] = true;
				 		info.code = this.Aliases[alias_name_].js + alias_trailer_;
				 		info.alias_expression = code_;
				 	}

				 	this.ShowError( info );
					return {error: true}
				}	

			} else
			{
				try
				{
					// Optimization
					// We only need to check if it's a valid identifier if the context is window. Because a non-identifier 
					// can only be in brackets. And when resolving the brackets contents, the context is always window
					if(context == window)
					{
						// If endname is not an identidifier, then it's a string or a number. Then it must be in [brackets]. 
						// In this case, the result of endname resolving IS an endname itself
						// In other words, you don't calculate 4 in [4] or 'something' in ['something']. 
						// You just use it as a string-index to acces an object or an array item
						if( !IsValidIdentifier(endname) )
						{
							// If this is a string in 'quotes', remove quotes, 
							// Optimization
							// if( endname[0] == '\'' ) plus substring is 14% faster than
							// endname = endname.replace(/'/g, "");
							if( endname[0] == '\'' )
							endname = endname.substring(1, endname.length-1);

							end = endname; 
						}
						else
						end = end[endname];
					}
					else
					end = end[endname];

				}
				catch(err)
				{
					//if (err instanceof TypeError)
			 		//err.message = prevname + " is undefined";

				 	var info = 
				 	{
				 		debug_caller: "Resolve",
				 		caller_name: caller_name_,		 		
				 		error_message: err.message,
				 		"show-code": true,
				 		code: code_
				 	}

				 	if( alias_name_ )
				 	{
				 		info["show-alias-expression"] = true;
				 		info.code = this.Aliases[alias_name_].js + alias_trailer_;
				 		info.alias_expression = code_;
				 	}

				 	this.ShowError( info );
					return {error: true}
				}	
			}

			//prevname = endname;			


			if( i<dotparts_length-1 )
			context = end;
		}

		return { error: false, context: context, end: end, endname: endname };
	},
	
	ParseJS(code_, is_alias_, caller_name_)
	{
		var alias_found = false;
		var alias_name = undefined;
		var alias_trailer = undefined;
		var Dotparts = [];
		var cache = undefined;


		// Remove all unwanted spaces
		var trimmed_code = code_.trim().replace(/\s*([\.\[\]])\s*/g, "$1");


		// Getting a proper cache-------------------------------------
		if( is_alias_ )
		cache = this.AliasDotpartsCache; 
		else
		cache = this.NonAliasDotpartsCache;


		// Get Dotparts from cache -----------------------------------
		if( cache.Dotparts[ trimmed_code ] )
		{
			Dotparts = cache.Dotparts[ trimmed_code ];

			if( is_alias_ )
			{
				alias_found = true;
				alias_name = cache.AliasNames[ trimmed_code ];
				alias_trailer = cache.AliasTrailers[ trimmed_code ];
			}
		}
		// No cache ---------------------------------------------
		else   
		{
			if( is_alias_ )
			{
				alias_name = trimmed_code.split(/[\.\[]/)[0];
				alias_trailer = trimmed_code.substring( alias_name.length );

				if( this.Aliases[alias_name] )
				{
					alias_found = true;

					if( alias_trailer )
					Dotparts = DotStringToDotArray( this.Aliases[alias_name].dotstring + alias_trailer.split('[').join(".[") );
					else
					Dotparts = DotStringToDotArray( this.Aliases[alias_name].dotstring );
										
				} else 
				return { 
						error: 			true, 
						alias_found:	alias_found, 
						trimmed_code: 	trimmed_code, 
						alias_name: 	alias_name, 
						alias_trailer: 	alias_trailer 
						};
			} 
			// Not alias, just code
			else
			{
				Dotparts = DotStringToDotArray( trimmed_code.split('[').join(".[") );
			}


			// Caching ---------------------------------------------

			// delete old cache entries if max_count entries reached
			if( cache.count >= cache.max_count )
			for( var i in cache.Dotparts ) 
			{
				delete cache.Dotparts[i];

				if( is_alias_ )
				{
					delete cache.AliasNames[ i ];
					delete cache.AliasTrailers[ i ];
				}

				cache.count--;


				if(cache.count <= cache.max_count)
				break;
			}

			
			// Put things in cache
			// DANGEROUS: trimmed_code = trimmed_code + Math.random();
			
			cache.Dotparts[ trimmed_code ] = Dotparts;

			if( is_alias_ )
			{
				cache.AliasNames[ trimmed_code ] = alias_name;
				cache.AliasTrailers[ trimmed_code ] = alias_trailer;
			}
			

			cache.count++;
			
			//console.log( "cache.count: " + cache.count );
			//console.log( "cache.Dotparts.length: " + Object.keys(cache.Dotparts).length );
			//console.log( "cache.AliasNames.length: " + Object.keys(cache.AliasNames).length );
			//console.log( "cache.AliasTrailers.length: " + Object.keys(cache.AliasTrailers).length );
		}


		
		var Result = this.Resolve( Dotparts, caller_name_, trimmed_code, alias_name, alias_trailer );

		return { 
					error: 			Result.error, 
					end: 			Result.end, 
					endname: 		Result.endname, 
					context: 		Result.context, 
					trimmed_code: 	trimmed_code, 
					alias_found: 	alias_found, 
					alias_name: 	alias_name, 
					alias_trailer: 	alias_trailer
				};
	}
}
	for( var k in InstanceFunctionsObject )
	{
		C3.Plugins.ValerypopoffJSPlugin.Instance.prototype[k] = InstanceFunctionsObject[k];
	}
	
}