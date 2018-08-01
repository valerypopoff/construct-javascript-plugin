"use strict";

{
	var ExpsObject =
	{
	JSCodeValue()
    {
	    //- C2-C3 COMPATIBILITY -------------------------
	    var params_ = Array.from(arguments);
	    var ret;

	    if( __CONSTRUCT3_RUNTIME3__ )
	    	ret = {set_int(){}, set_float(){}, set_string(){}, set_any(){}};
		else
		{
			ret = params_[0];

	        for( var i=0; i<params_.length-1; i++ ) 
	        params_[i] = params_[i+1];

	    	params_.pop();
		}
		//----------------------------------------------
	    
    	var code_ = params_[0];
    	
    	var caller_name_ = "'JSCodeValue' expression";
        var jscode = code_;
 
        //Make an array from all arguments of a function. 
        //Then delete first param leaving only parameters that were passed to a code (if any)
        params_.splice(0, 1);
 
        if( params_.length )
        jscode = HashtagParamsToCode(jscode, params_);
 
 
 
        var jsret = undefined;
        try
        {
            jsret = eval(jscode);
        } catch(err)
        {
            this.ShowError( 
            { 
                debug_caller: "JSCodeValue",
                caller_name: caller_name_,
                "show-code": true,
                code: jscode,
                error_message: err.message
            });
 
 
            ret.set_any( undefined );
            return;         
        }
 
        if( typeof jsret == "boolean" )
        {
        	ret.set_any( jsret ? 1 : 0 );
        	
        	if( __CONSTRUCT3_RUNTIME3__ )
        	return jsret ? 1 : 0;
        }
        else
        {
        	ret.set_any( jsret );
        	
        	if( __CONSTRUCT3_RUNTIME3__ )
        	return jsret;
        }
    },
	StoredReturnValue() 
    {
	    //- C2-C3 COMPATIBILITY -------------------------
	    var params_ = Array.from(arguments);
	    var ret;

	    if( __CONSTRUCT3_RUNTIME3__ )
	    	ret = {set_int(){}, set_float(){}, set_string(){}, set_any(){}};
		else
		{
			ret = params_[0];

	        for( var i=0; i<params_.length-1; i++ ) 
	        params_[i] = params_[i+1];

	    	params_.pop();
		}
		//----------------------------------------------
	    

        if( typeof this.returnValue === "boolean" )
        {
        	ret.set_any( this.returnValue ? 1 : 0 );
        	
        	if( __CONSTRUCT3_RUNTIME3__ )
        	return this.returnValue ? 1 : 0;
        }
        else
        {
        	ret.set_any( this.returnValue );
        	
        	if( __CONSTRUCT3_RUNTIME3__ )
        	return this.returnValue;
        }
    },
	FunctionReturnValue()    
    {
	    //- C2-C3 COMPATIBILITY -------------------------
	    var params_ = Array.from(arguments);
	    var ret;

	    if( __CONSTRUCT3_RUNTIME3__ )
	    	ret = {set_int(){}, set_float(){}, set_string(){}, set_any(){}};
		else
		{
			ret = params_[0];

	        for( var i=0; i<params_.length-1; i++ ) 
	        params_[i] = params_[i+1];

	    	params_.pop();
		}
		//----------------------------------------------
	    
		var func_exp_ = params_[0];

        var caller_name_ = "'FunctionReturnValue' expression";
        var store_return_value_ = false;
        var final = this.ParseJS(func_exp_, false, caller_name_);
 
        //Make an array from all arguments of a function. 
        //Then delete first param leaving only parameters that were passed to a code (if any)
        params_.splice(0, 1);
 
 
        // If there was an error during parse-resolve
        if( final.error )
        {
            ret.set_any( undefined );
            return;
        }   
 
         
        var jsret = undefined;
        jsret = this.ACTS.CallJSfunction.call(this, func_exp_, params_, store_return_value_, caller_name_, final );
 
 
        if( typeof jsret === "boolean" )
        {
        	ret.set_any( jsret ? 1 : 0 );
        	
        	if( __CONSTRUCT3_RUNTIME3__ )
        	return jsret ? 1 : 0;
        }
        else
        {
        	ret.set_any( jsret );
        	
        	if( __CONSTRUCT3_RUNTIME3__ )
        	return jsret;
        }
 
        return;
    },
	AliasValue()    
    {
	    //- C2-C3 COMPATIBILITY -------------------------
	    var params_ = Array.from(arguments);
	    var ret;

	    if( __CONSTRUCT3_RUNTIME3__ )
	    	ret = {set_int(){}, set_float(){}, set_string(){}, set_any(){}};
		else
		{
			ret = params_[0];

	        for( var i=0; i<params_.length-1; i++ ) 
	        params_[i] = params_[i+1];

	    	params_.pop();
		}
		//----------------------------------------------
	    
		var alias_exp_ = params_[0];
        var caller_name_ = "'AliasValue' expression";
        var final = this.ParseJS(alias_exp_, true, caller_name_);
 
        // If no such alias
        if( !final.alias_found )
        {
            var info = 
            {
                debug_caller: "AliasValue",
                caller_name: caller_name_,              
                error_message: "No such alias '" + final.trimmed_code + "'"
            }
 
            this.ShowError( info );
 
            ret.set_any( undefined );
            return;         
        }
 
        // If there was an error during parse-resolve
        if( final.error )
        {
            ret.set_any( undefined );
            return;
        }   
 
 
         
        var jsret = undefined;
        try
        {
            jsret = final.end;
 
        } catch(err)
        {
            var info = 
            {
                debug_caller: "SetAlias",
                caller_name: caller_name_,
                "show-alias-expression": true,
                alias_expression: final.trimmed_code,
                //"show-code": true,
                //code: code,           
                error_message: err.message
            }
 
            this.ShowError( info );
 
 
            ret.set_any( undefined );
            return;         
        } 
 
        if( typeof jsret === "boolean" )
        {
        	ret.set_any( jsret ? 1 : 0 );
        	
        	if( __CONSTRUCT3_RUNTIME3__ )
        	return jsret ? 1 : 0;
        }
        else
        {
        	ret.set_any( jsret );
        	
        	if( __CONSTRUCT3_RUNTIME3__ )
        	return jsret;
        }
 
        return;
    },
	AliasCallReturnValue()  
    {
	    //- C2-C3 COMPATIBILITY -------------------------
	    var params_ = Array.from(arguments);
	    var ret;

	    if( __CONSTRUCT3_RUNTIME3__ )
	    	ret = {set_int(){}, set_float(){}, set_string(){}, set_any(){}};
		else
		{
			ret = params_[0];

	        for( var i=0; i<params_.length-1; i++ ) 
	        params_[i] = params_[i+1];

	    	params_.pop();
		}
		//----------------------------------------------
	    
		var alias_exp_ = params_[0];

        var caller_name_ = "'AliasCallValue' expression";
        var store_return_value_ = false;
        var final = this.ParseJS(alias_exp_, true, caller_name_);
 
        //Make an array from all arguments of a function. 
        //Then delete first param leaving only parameters that were passed to a code (if any)
        params_.splice(0, 1);
 
 
        // If no such alias
        if( !final.alias_found )
        {
            var info = 
            {
                debug_caller: "AliasCallValue",
                caller_name: caller_name_,              
                error_message: "No such alias '" + final.trimmed_code + "'"
            }
 
            this.ShowError( info );
 
            ret.set_any( undefined );
            return;         
        }
 
        // If there was an error during parse-resolve
        if( final.error )
        {
            ret.set_any( undefined );
            return;
        }   
 
 
         
        var jsret = undefined;
        jsret = this.ACTS.CallJSfunction.call(this, alias_exp_, params_, store_return_value_, caller_name_, final );
 
 
        if( typeof jsret === "boolean" )
        {
        	ret.set_any( jsret ? 1 : 0 );
        	
        	if( __CONSTRUCT3_RUNTIME3__ )
        	return jsret ? 1 : 0;
        }
        else
        {
        	ret.set_any( jsret );  
        	
        	if( __CONSTRUCT3_RUNTIME3__ )
        	return jsret;
        }
        
        return;
    }
	};

	C3.Plugins.ValerypopoffJSPlugin.Exps = {};

	for( var k in ExpsObject )
	{
		C3.Plugins.ValerypopoffJSPlugin.Exps[k] = ExpsObject[k];
	}

}

C3.Plugins.ValerypopoffJSPlugin.Instance.prototype.EXPS = C3.Plugins.ValerypopoffJSPlugin.Exps;