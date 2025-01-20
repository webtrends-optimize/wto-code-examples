 /**
  *  WEBTRENDS OPTIMIZE - SINGLE PAGE APP MODULE : PREINIT MODULE
  *  Dev: Sandeep
  * @requires WT.optimizeModule.prototype.wtConfigObj.libUrl = 'https://c.webtrends-optimize.com/acs/common/js/5.8/wt_lib.js';
  * @trigger define an a event on route change and trigger this function
  */
WT.refreshAndExecute = function(){
    // Page hide -- INITIALISE
    WT.hideAndShow(document.body, WT.optimizeModule.prototype.wtConfigObj.s_pageDisplayMode, false, WT.optimizeModule.prototype.wtConfigObj.overlayColor);
    
    // Page hide -- INITIALISE
    var PDM = WT.optimizeModule.prototype.wtConfigObj.s_pageDisplayMode;
    if(["display", "visibility"].includes(PDM)){
        WT.hideAndShow(document.body, PDM, false, null);
    } else if(["shift", "overlay"].includes(PDM)){
        WT.hideAndShow("body", PDM, false, null);
    }
  
    if(WT.optimizeModule.prototype.checkWhitelist_CUSTOM) {
        WT.optimizeModule.prototype.checkWhitelist_CUSTOM();
        
        WT.fireEvent(new WT.Event("hide_show",WT.Event.STATUS_SUCCESS,document.body,{
            displayType: 'custom', 
            display: false
        }));
    }
  
    // cache pv and hideshow listeners
    var temp = {};
    ["hide_show", "pageview"].forEach(function(e){
        if( WT.optimize.g_ConfigParams.s_eventHandlers[e] && WT.optimize.g_ConfigParams.s_eventHandlers[e].success && WT.optimize.g_ConfigParams.s_eventHandlers[e].success.length ){
            if(!temp[e]) temp[e] = [];
            WT.optimize.g_ConfigParams.s_eventHandlers[e].success.forEach(function(f){
                temp[e].push(f);
            });
        }
    });
  
    WT.optimize._ctor();
  
    // rebuild hooks 
    for(var ev in temp){
        var list = temp[ev];
        list.forEach(function(f){
            WT.addEventHandler(ev, f); 
        });
    }
  
    // Trigger SPA Hooks
    WT.fireEvent(new WTEvent("spa_start", WTEvent.STATUS_SUCCESS,document,{}));
  
    WT.execute(WT.optimizeModule.prototype.wtConfigObj);
};

//MUTATION EVENT : SPA
(function routeChange() {
    try {
        var log = WT.helpers.bdebug.log;
        if (WT.routeChangeEvent) return;
        //Observer Checks
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        if (!MutationObserver) {
            log('browser doesn\'t support mutationobserver');
            return;
        }
        var currentURL = window.location.pathname;
        var observer = new MutationObserver(function (mutations) {
            if (window.location.pathname !== currentURL) {
                currentURL = window.location.pathname;
                window.dispatchEvent(new CustomEvent('WTO:route-change', {
                    detail: { pageUrl: currentURL }
                }));
                WT.refreshAndExecute();
            }
        });
        var config = { subtree: true, childList: true };
        observer.observe(document, config);
        WT.routeChangeEvent = true;
    } catch (err) {
        if (document.cookie.match(/_wt.bdebug=true/i)) console.log(err);
    }
}());
