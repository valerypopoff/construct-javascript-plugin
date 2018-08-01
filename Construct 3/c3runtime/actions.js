"use strict";

{
var ActsObject = 
{
	ExecuteJSWithParams(code, params_)
    {
        var caller_name_ = "'Execute JS code' action";
        this.returnValue = undefined;
 
        // Replace all #0 #1 #3... in the code to the corresponding parameters
        code = code.replace( /#[0-9]+/g, function(str)
                                                {
                                                    var temp = params_[ str.substr(1) ];
                                                     
                                                    if (typeof temp === "string")
                                                    return "'" + temp + "'";
                                                    else
                                                    return temp;
                                                } 
                                    );
 
        try
        {
            return this.returnValue = eval(code);
 
        } catch(err)
        {
            this.ShowError( 
            { 
                debug_caller: "ExecuteJSWithParams",
                caller_name: caller_name_,
                "show-code": true,
                code: code,
                error_message: err.message
            });
 
            return;
        }
    },
	CallJSfunction(funcname_, funcparams_, store_return_value_, caller_name_, final_)
    {
        //If no store_return_value_ passed, make it true
        if( store_return_value_ === undefined )
        store_return_value_ = true;
 
        //If no caller_name_ passed, make it "'Call function' action"
        if( caller_name_ === undefined )
        caller_name_ = "'Call function' action";
 
        // Only parse if parsed result is not passed to the function
        // If it's passed, then it must have been parsed in the CallAlias action
        if( final_ === undefined )
        var final = this.ParseJS( funcname_, false, caller_name_ );
        else
        var final = final_;
         
        // Parse-resolve error
        if( final.error )
        {
            return;
        }
 
 
        //If a function name contains parenthes, shoot an error
        if( funcname_.indexOf("(") >= 0 || funcname_.indexOf(")") >= 0 )
        {
            var info = 
            {
                debug_caller: "CallJSfunction",
                caller_name: caller_name_,              
                error_message: "'" + final.trimmed_code + "' must be a function name, not a function call. Remove parentheses."
            }
 
            if( final.alias_found )
            {
                info["show-alias-expression"] = true;
                info.alias_expression = final.trimmed_code;
            }
             
            this.ShowError( info );
            return;
        }
 
 
 
 
        var ret = undefined;
 
        try
        {
            ret = final.end.apply(final.context, funcparams_);
 
        } catch(err)
        {
             
            if (err instanceof TypeError && err.message.indexOf("apply") >= 0 && err.message.indexOf("undefined") >= 0 )
            err.message = funcname_ + " is undefined";
             
 
            var info = 
            {
                debug_caller: "CallJSfunction",
                caller_name: caller_name_,
                error_message: err.message
            }
             
 
            if( final.alias_found )
            {
                info["show-alias-expression"] = true;
                info.alias_expression = MakeCallString(final.trimmed_code, funcparams_);
                info["show-code"] = true,
                info.code = MakeCallString(this.Aliases[final.alias_name].js + final.alias_trailer, funcparams_);
            }
            else
            {
                info["show-code"] = true,
                info.code = MakeCallString(final.trimmed_code, funcparams_);
            }
 
 
            this.ShowError( info );
            return;
        } 
 
        //Only store return value if the flag is true
        if( store_return_value_ )
        this.returnValue = ret;
  
        return ret;
         
    },
	InitAlias(alias_name_, alias_js_)
    {
        var caller_name_ = "'Init alias' action";
        alias_name_ = alias_name_.trim();
        alias_js_ = alias_js_.trim();
 
 
        //If the JS is empty, shoot an error
        if( alias_js_.length == 0 )
        {
            var info = 
            {
                debug_caller: "InitAlias",
                caller_name: caller_name_,
                error_message: "Javascript string of alias '" + alias_name_ + "' must not be empty."
            }
 
            this.ShowError( info );
            return;             
        }
 
        //If the alias name contains dots or brackets, shoot an error
        if( alias_name_.indexOf(".") >= 0 || alias_name_.indexOf("[") >= 0 || alias_name_.indexOf("]") >= 0 )
        {
            var info = 
            {
                debug_caller: "InitAlias",
                caller_name: caller_name_,
                error_message: "Alias name must not contain '.', '[' or ']' signs: '" + alias_name_ + "'"
            }
 
            this.ShowError( info );
            return;
        }
 
 
        // Check if there's already an alias with the same name
        //if( this.AliasIndex( alias_name_ ) >= 0 )
        if( this.Aliases[alias_name_] != undefined )
        {
            var info = 
            {
                debug_caller: "InitAlias",
                caller_name: caller_name_,
                error_message: "Alias '" + alias_name_ + "' already exists"
            }
 
            this.ShowError( info );
            return;
        }
 
 
        // Finally, if everything is OK, add new alias
        var newAlias = new Object();
        newAlias.js = alias_js_;
        newAlias.dotstring = alias_js_.split('[').join(".[");
        //newAlias.name = alias_name_;
        //newAlias.dotparts = DotStringToDotArray(newAlias.dotstring);
        //newAlias.dotparts_length = newAlias.dotparts.length;
 
        this.Aliases[alias_name_] = newAlias;
    },
	SetAlias(alias_exp_, alias_value_)
    {
        var caller_name_ = "'Set alias' action";
        var final = this.ParseJS(alias_exp_, true, "'Set alias' action");
 
        // If such alias was not found
        if( !final.alias_found )
        {
            var info = 
            {
                debug_caller: "SetAlias",
                caller_name: caller_name_,              
                error_message: "No such alias '" + final.trimmed_code + "'"
            }
 
            this.ShowError( info );
            return;         
        }
 
        // Error during parse-resolve
        if( final.error )
        return;
         
 
 
        try
        {
            final.context[final.endname] = alias_value_;
             
        // It seems like no way an error can occure though
        } catch(err)
        {
            var code = alias_exp_ + "=";
            if( typeof alias_value_ == "string" )
            code = code + "'" + alias_value_ + "'";
            else
            code = code + alias_value_;
 
            var info = 
            {
                debug_caller: "SetAlias",
                caller_name: caller_name_,
                "show-alias-expression": true,
                alias_expression: final.trimmed_code,
                "show-code": true,
                code: code,         
                error_message: err.message
            }
 
            this.ShowError( info );
            return;         
        } 
    },
	CallAlias(alias_exp_, funcparams_, store_return_value_, caller_name_)
    {
        //If no store_return_value_ passed, make it true
        if( store_return_value_ === undefined )
        store_return_value_ = true;
 
        //If no caller_name_ passed, make it "'Call function' action"
        if( caller_name_ === undefined )
        caller_name_ = "'Call alias' action";
 
 
        var final = this.ParseJS(alias_exp_, true, caller_name_);
 
         
        // If no such alias
        if( !final.alias_found )
        {
            var info = 
            {
                debug_caller: "CallAlias",
                caller_name: caller_name_,              
                error_message: "No such alias '" + final.trimmed_code + "'"
            }
 
            this.ShowError( info );
            return;         
        }
     
        // If there was an error during parse-resolve
        if( final.error )
        return;
 
 
 
        var ret = this.ACTS.CallJSfunction.call(this, this.Aliases[final.alias_name].js + final.alias_trailer, funcparams_, store_return_value_, caller_name_, final );
         
        return ret;
 
    }
};

	C3.Plugins.ValerypopoffJSPlugin.Acts = {};

	for( var k in ActsObject )
	{
		C3.Plugins.ValerypopoffJSPlugin.Acts[k] = ActsObject[k];
	}
}

C3.Plugins.ValerypopoffJSPlugin.Instance.prototype.ACTS = C3.Plugins.ValerypopoffJSPlugin.Acts;
