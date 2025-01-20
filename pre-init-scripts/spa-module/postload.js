/**
  *  WEBTRENDS OPTIMIZE - SINGLE PAGE APP MODULE : POST LOAD SETUP REPLACEMENT
  *  Dev: Sandeep
  */
WT.optimize.setup=function(arg1,arg2){
    
    WT.Debug.info("OVERWRITTEN SETUP CALL");
    
    try{
        if(WT.optimize.g_Aborted){
            WT.Debug.error("setup: Aborted due to prior error, check error message for details.", 0);
            return
            
        }
        
        var params={};
        
        if(typeof arg1=="object") params=arg1;
        else if(typeof arg1=="string"){
            if(typeof arg2!="undefined") params=arg2;
            params["testAlias"]=arg1
            
        }
        
        if(typeof arg1!="string"){
            if(WT.optimize.g_hasEmptySetup){
                WT.Debug.error("setup: Only one empty setup call is supported.",0);
                return
                
            }
            
            // CHANGE HERE
            // WT.optimize.g_hasEmptySetup=true;
            
        }
        
        if(typeof arg1=="string")
            for(var i in WT.optimize.g_ParamsList)
                if(arg1==WT.optimize.g_ParamsList[i]["testAlias"]){
                    WT.Debug.error("setup: Duplicate setup calls with the same alias are not supported.", 0);
                    return
                    
                }
                
        params["s_requestType"]="control";
        
        if(!WT.optimize.g_ConfigLoaded){
            
            var obj=this;
            
            WT._addEventHandler(WTEvent.CAPI_CONFIG_PROCESSED,function(){
                obj._initialize(params)
                
            });
            
            WT.hideAndShow(document.body,this.g_ConfigParams["s_pageDisplayMode"],false,this.g_ConfigParams["overlayColor"])
            
        } else this._initialize(params)
        
    }catch(e){
        WT.Debug.error("setup: Fatal error, check error message for details.",0,e);
        var event=new WTEvent(e.wtevent?e.wtevent:WTEvent.ABORT,WTEvent.STATUS_FAULT,this);
        event.params["error"]=e;
        WT._fireEvent(event)
    }
};
WT.optimize.setup = WT.optimize.setup.bind(WT.optimize);
        
WT.refresh = function(){
    try{
        WT.optimize.g_hasEmptySetup=false;
        WT.optimize.g_Aborted=false;
        WT.optimize.g_RunObjList=[];
        WT.optimize.g_ParamsList=[];
        WT.optimize.g_PageTimer=null;
        WT.optimize.g_PageStartTime=null;
        WT.optimize.g_PageEndTime=null;
        WT.optimize.Preview={};
        // WT.optimize._ctor();
        var tmp=WT.optimize.Library.DynamicID;
        
        var fn = WT.optimize._Library || WT.optimize.zd67f;
        WT.optimize.Library=new fn(WT.optimize);
        WT.optimize.Library.DynamicID=tmp;
        
    }catch(e){
        WT.Debug.error("refresh: Fatal Error, check error message for details",0,e);
        var event=new WTEvent(e.wtevent?e.wtevent:WTEvent.ABORT,WTEvent.STATUS_FAULT,this);
        event.params["error"]=e;WT._fireEvent(event)
    }
};
        

WT.optimize.setup(WT.optimizeModule.prototype.wtConfigObj);
