// preinit template

/* CONVERSION PACKAGE */
WT.ConversionPackage_data = {
    'simple': {
        'Page_Basket': /mysite.com\/basket/i,
        'Page_Checkout': /mysite.com\/checkout\/?($|\?|#)/i,
        // ...
    },
    'advanced': [
        {
            name: "Purchase",
            // regex: confirmation_regex,
            onEvent: "confirmation_loaded",
            collectData: function(){

                var revenue = window.something;
                var units = window.something;
                var orderid = window.something;

                return {
                    revenue: revenue,
                    units: units,
                    orderid: orderid
                }

            }
        }
        
    ],
    'events': {
        'cv': ['ev', 'sel']
    },
    'triggers': {
        'hashchange on checkout': function(cb){

            if(!location.href.match(/mysite.com\/checkout/i)) return;
            window.addEventListener('hashchange', function(){
                cb(false);
            });
        },

        'confirmation-loaded': function(cb){
            if(!location.href.match(/\/thank-you/i)) return;
            
            var check = function(){
                if(window.something){
                    cb('confirmation_loaded');
                    return true;
                }
                return false;
            };
            if(!check()){
                var intvl = setInterval(check, 250);
                setTimeout(function(){
                    clearInterval(intvl);
                }, 60000);
            }

        }
    }
};

/* MASKING */
WT.optimizeModule.prototype.whitelist = [
    {
        URLs: [
            /[\?&]_wt.testWhitelist=true/i
        ],
        css: 'body { opacity: 0.00000001 !important; }'
    },
];

WT.optimizeModule.prototype.whitelist_STAGING = [

];

/* GTM EVENT INTERCEPTION */
WT.GTMEventsToIntercept = [];

/* ADVANCED CONSENT MODE - OPTIONAL */
/* 
WT.consent_checkInitialState = function(){
    // Onetrust option
    var optanoncookie = document.cookie.match(/OptanonConsent=([^;]+)/)[1];
    return decodeURIComponent(optanoncookie).match(/C0002:1/i);
};
WT.consent_updateState = function(cb){
    // Onetrust option
    window.addEventListener("consent.onetrust", function(ev){
        if(ev.detail.includes("C0002")){
            cb();
        }
    });
};
*/

// --------------------

// date stamp
if(document.cookie.match(/_wt.bdebug=true/i)) console.log('CAPI Preinit Version ('+WT.optimizeModule.prototype.wtConfigObj.s_contextName+'): 27-07-2024 16:15 - DB');

// add version 5.8
WT.optimizeModule.prototype.wtConfigObj.libUrl = 'https://c.webtrends-optimize.com/acs/common/js/5.8/wt_lib.js';

// change sizzle version
//WT.sizzleModule.prototype.wtConfigObj.libUrl = "https://c.webtrends-optimize.com/acs/common/js/sizzle_wt.min.js"

// IOS 13 Fix, Data Object
(function () {
    try {
        WT.optimizeModule.prototype.wtConfigObj.data.tablet13 = (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ? "yes" : "no";
    } catch (err) { if (document.cookie.match(/_wt.bdebug=true/i)) console.log(err); }
})();

// abort if browser does not support ES6
var supportsES6 = (function () {
    try {
        new Function("async () => {}");
        new Function("(a = 0) => a");
        return true;
    }
    catch (err) {
        return false;
    }
}());
if (!supportsES6) {
    WT.helpers.bdebug.warn('WTO : ES6 not supported')
    WT.optimizeModule.prototype.abort();
    return;
}

//Page Hide
(function pageHide(){
    if(!WT.optimizeModule.prototype.whitelist) WT.optimizeModule.prototype.whitelist = [];
    
    if (window.location.href.match(/_wt.mode=staging/i)) {
        var stagingWhitelist = WT.optimizeModule.prototype.whitelist_STAGING || [];
        for (var i = 0; i < stagingWhitelist.length; i++) {
            WT.optimizeModule.prototype.whitelist.push(stagingWhitelist[i]);
        }
    }
    WT.optimizeModule.prototype.checkWhitelist_CUSTOM=function(){var e,t,o,n=function(e){var o=e||"";return{add:function(e){e.length&&(o+=e+"\n")},output:function(e){var t;if(o.length){if(e&&(t=document.getElementById(e)),t)return!1;(t=document.createElement("style")).setAttribute("type","text/css"),e&&(t.id=e),t.styleSheet?t.styleSheet.cssText=o:t.appendChild(document.createTextNode(o)),document.getElementsByTagName("head")[0].appendChild(t),o=""}},remove:function(e,t){if(!e)return!1;e=(t=t||window.document).getElementById(e);e&&"style"==e.nodeName.toLowerCase()&&e.parentNode.removeChild(e)}}},i=WT.optimizeModule.prototype.whitelist||[];try{for(var r="",a=!1,d=0,s=i.length;d<s;d++){var u,c=i[d],p=c;c.URLs&&c.css&&(p=c.URLs,u=c.css||""),!0===function(e){if(!e)return!1;!1==e instanceof Array&&(e=[e]);for(var t,o=0;t=e[o];o++)if(window.location.href.match(t))return!0;return!1}(p)&&(u&&(r+=u),WT.optimizeModule.prototype.wtConfigObj.s_pageTimeout=5e3,WT.optimizeModule.prototype.wtConfigObj.s_pageDisplayMode="custom",a=!0)}return""!==(WT.obfHide=r)&&(e=(e=r).match(/[\{\}]+/)?e:e+"{ opacity: 0.00001 !important; }",t=new n(e),o="wto-css-capi-"+Math.floor(1e3*Math.random()),WT.addEventHandler("hide_show",function(e){e.params&&(!1===e.params.display&&t.output(o),!0===e.params.display&&t.remove(o))}),setTimeout(function(){t.remove(o)},5100)),a}catch(e){}};
    WT.optimizeModule.prototype.checkWhitelist_CUSTOM();
})();

/**
 * CONVERSION PACKAGE
 */
WT.ConversionPackage = function () {
    try {

        if(!WT.optimize || !WT.getProjectCookies){
            setTimeout(WT.ConversionPackage, 100);
            return; 
        }
        
        // already running
        var testAliasExclusionList = ['ta_dummy_exclude'];
        
        // Metrics 
        var oConv = WT.ConversionPackage_data.advanced;
        for (var key in WT.ConversionPackage_data.simple) {
            oConv.push({ regex: WT.ConversionPackage_data.simple[key], name: key });
        }

        // click based actions
        if (!Element.prototype.matches) {
            Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
        }

        function delegate(el, evt, sel, handler) {
            el.addEventListener(evt, function (event) {
                var t = event.target;
                while (t && t !== this) {
                    if (t.matches(sel)) {
                        handler.call(t, event);
                    }
                    t = t.parentNode;
                }
            });
        }

        if (window.location.href.match(/_wt.convPackageDebug=true/i)) document.cookie = '_wt.convPackageDebug=true;path=/;'; var Print = {}, bDebug = Boolean(document.cookie.match(/_wt.convPackageDebug=true/i)); if (bDebug) { Print.debug = window.console; Print.debug.alert = window.alert; } else { Print.debug = { log: function () { }, info: function () { }, warn: function () { }, error: function () { }, dir: function () { }, alert: function () { } }; } Print.debug.log('Conversion Package Running'); var Core = {}; WT.CPCore = Core; var cfg = WT.optimizeModule.prototype.wtConfigObj; var domainID = cfg.s_domainKey; var keyToken = cfg.s_keyToken; Core.cookieMethods = WT.helpers.cookie; Core.getTestAliases = function () { if (window.location.search.match(/cpDummy/i) && !Core.cookieMethods.has('wt_dummy_pkg')) { var answer = window.prompt(); Core.cookieMethods.set('wt_dummy_pkg', answer, 1); } var cookies = document.cookie.match(/_wt.control\-\d+\-([^=]+)/g); var projectCookies = document.cookie.match(/_wt.project/i); var hasLSCookies = WT.cookieStrategy === "localstorage" && window.localStorage && Object.keys(localStorage).filter(function(x){ return x.match(/_wt.(control|project)/i) }).length; if (!cookies && !projectCookies && !hasLSCookies) return false; var arr = []; if (Core.cookieMethods.has('wt_dummy_pkg')) { var dummyTa = Core.cookieMethods.get('wt_dummy_pkg'); arr.push(dummyTa); } else if (cookies) { for (var i = 0; i < cookies.length; i++) { var c = cookies[i].replace(/_wt.control\-\d+\-/i, ''); arr.push(c); } } if (WT.getProjectCookies) { var list = Object.keys(WT.getProjectCookies()); for (var i = 0; i < list.length; i++) { arr.push(list[i].replace(/_wt.control\-\d+\-/i, '')); } } return arr; }; Core.getMatchingUrl = function (wlh, regArr) { for (var j = 0; j < regArr.length; j++) { if (wlh.match(regArr[j])) { Print.debug.log("page matches:", regArr[j]); return true; } } }; Core.trackAliases = function (testAliases, testAliasExclusionList, me, dataInfo) { dataInfo = (typeof dataInfo === 'undefined') ? {} : dataInfo; for (var l = 0; l < testAliasExclusionList.length; l++) { var excludedAlias = testAliasExclusionList[l]; index = testAliases.indexOf(excludedAlias); if (index > -1) { testAliases.splice(index, 1); } } var o = { testAlias: '', conversionPoint: me.name, additionalCookies: {}, data: dataInfo }; var projectCookies = {}; if (WT.getProjectCookies) { projectCookies = WT.getProjectCookies(); } for (var k = 0; k < testAliases.length; k++) { var tA = testAliases[k]; var cookiename = '_wt.control-' + domainID + '-' + tA; var controlcookie = Core.cookieMethods.get(cookiename); if (controlcookie) { o.additionalCookies[cookiename] = { value: controlcookie }; } var pcookie = projectCookies[cookiename]; if (pcookie) o.additionalCookies[cookiename] = pcookie; } var testAliasString = testAliases.join(); o.testAlias = testAliasString; o.additionalCookies['_wt.user-' + domainID] = { value: Core.cookieMethods.get('_wt.user-' + domainID) }; o.additionalCookies['_wt.mode-' + domainID] = { value: Core.cookieMethods.get('_wt.mode-' + domainID) }; Print.debug.log("ctrack:", o); WTO_CTrack2(o); }; WT.trackEvent = function (o) { Core.trackAliases([o.testAlias], [], { name: o.conversionPoint }, o.data || {}); }; function doEvaluate(onEvent) { var wlh = window.location.href; var testAliases = Core.getTestAliases(); if (!testAliases || !testAliases.length) return; for (var i = 0; i < oConv.length; i++) { var me = oConv[i]; if ((!onEvent && !me.onEvent) || me.onEvent == onEvent) { } else { continue; } if (me.regex) { var regArr = (me.regex instanceof Array) ? me.regex : [me.regex]; var urlMatched = Core.getMatchingUrl(wlh, regArr); if (!urlMatched) continue; } if (me.path) { var regArr = (me.regex instanceof Array) ? me.regex : [me.regex]; var urlMatched = Core.getMatchingUrl(location.pathname, regArr); if (!urlMatched) continue; } if (me.ifCondition) { try { if (!me.ifCondition()) { continue; } } catch (err) { continue; } } var data = {}; if (typeof me.collectData === 'function') { try { data = me.collectData(); } catch (err) { console.log(err); } } Core.trackAliases(testAliases, testAliasExclusionList, me, data); } }; var WTO_CTrack2 = function (params) { var OTS_ACTION = params.conversionPoint ? "track" : "control"; var OTS_GUID = domainID + (params.testAlias ? "-" + params.testAlias : ""); var useTestGroupShared = false; var OTS_URL_POST = "https://ots.webtrends-optimize.com/ots/api/rest-1.2/" + OTS_ACTION + "/" + OTS_GUID; var aCookies = params.additionalCookies || {}; var cookiesFound = document.cookie.match(/_wt\.(user|mode)-[^=]+=[^;\s$]+/ig); if (cookiesFound) { var qpURL = "\x26url\x3d" + (params.URL ? encodeURIComponent(params.URL) : window.location.origin + window.location.pathname); var qpConversion = params.conversionPoint && "\x26conversionPoint\x3d" + params.conversionPoint || ""; var qpData = params.data ? "\x26data\x3d" + JSON.stringify(params.data) : ""; var offsetValue = function () { var rightNow = new Date; var offset = -rightNow.getTimezoneOffset() / 60; return offset * 1E3 * 60 * 60; }; var offset = "\x26_wm_TimeOffset\x3d" + offsetValue(); var referrer = ""; if (window.document && window.document.referrer && document.referrer !== "") referrer = "\x26_wm_referer\x3d" + document.referrer; var rqElSrc = "keyToken\x3d" + keyToken + "\x26preprocessed\x3dtrue\x26_wt.encrypted\x3dtrue\x26testGroup\x3d" + (useTestGroupShared ? "shared" : "default") + qpURL + "\x26cookies\x3d" + JSON.stringify(aCookies) + qpConversion + qpData + offset + referrer; Print.debug.log("--- Sending Request ---"); Print.debug.log(rqElSrc); if (navigator.sendBeacon && window.Blob) { var blob = new Blob([rqElSrc], { type: 'application/x-www-form-urlencoded' }); navigator.sendBeacon(OTS_URL_POST, blob); } else { var xhttp = new XMLHttpRequest(); xhttp.open("POST", OTS_URL_POST, true); xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); xhttp.send(rqElSrc); } } }; WT.helpers.CTrack2 = WTO_CTrack2;

        /* Triggers 
        -------------------------------------------------------------*/
        
        // On page load
        doEvaluate(false);

        if(WT.ConversionPackage_data.triggers){
            for(var key in WT.ConversionPackage_data.triggers){
                WT.ConversionPackage_data.triggers[key](doEvaluate);
            }
        }

        if(WT.ConversionPackage_data.events){
            for(var cv in WT.ConversionPackage_data.events){
                var me = WT.ConversionPackage_data.events;
                var ev = me[0];
                var sel = me[1];
    
                delegate(document, ev, sel, (e) => doEvaluate(cv));
            }
        }

        function processOptData(aEntry) { try { if (!(aEntry instanceof Array)) return "bad input"; var testAliases = Core.getTestAliases(); if (!testAliases || !testAliases.length) return "no control cookies found, nothing to store."; aEntry.forEach(function (o) { if (o.event) { var o_data = {}; if (o.data) { for (var key in o.data) { if (!(typeof o.data[key]).match(/number|string/i)) { continue; } o_data[key] = o.data[key]; } } Core.trackAliases(testAliases, testAliasExclusionList, { name: o.event }, o_data); } }); } catch (err) { } } if (window.opt_data && opt_data.length) { processOptData(opt_data) } if (!window.opt_data || window.opt_data instanceof Array) { window.opt_data = { h: (window.opt_data || []), push: function (o) { try { if (!o) return "opt_data.push - missing any arguments"; if (!o.event) return "opt_data.push - you should provide o.event"; this.h.push(o); processOptData([o]); return this.h; } catch (err) { return err; } } }; }
    } catch (err) { if (document.cookie.match(/_wt.bdebug=true/i)) console.log(err); }
};
WT.ConversionPackage();


/**
 * GA: Data Hook
 * version:  monkey patch DATALAYER INTERCEPTION
 * - This snippet polls for datalayer, lifts current values, processes and transfers events of interest into Optimize.
 * - Stores old dataLayer.push method and replaces with a new version we can intercept incoming pushes which we then:
 *      - return the events to the old datalayer.push
 *      - processes and transfers events of interest into Optimize
 */
(function(){
    var intvl = setInterval(function(){
        if(typeof window.dataLayer !== 'object' || !window.dataLayer.push) return;        
        clearInterval(intvl);

        if(WT.gtmHookActive) return;

        window.opt_data = window.opt_data || [];

        /**
         * Parse the object from the datalayer with an event Purchase to process the data 
         */
        function getPurchaseEccomData(o) {
            try {
                var data = {};
                if(!o || typeof o !== 'object') return {};
                var eccom = o.ecommerce || o[2] || {};
                //AOV / Revenue
                data.revenue = parseFloat((eccom.purchase && eccom.purchase.actionField && eccom.purchase.actionField.revenue) || eccom.value || 0);
                //units per transaction
                data.UPT = 0;
                data.items = [];
                var products = (eccom.purchase && eccom.purchase.products) || eccom.items || [];
                products.forEach(function(item){
                    if(item.quantity) data.UPT = data.UPT + parseInt(item.quantity);
                    data.items.push(item);
                });
                var additionalData = (eccom.purchase && eccom.purchase.actionField) || eccom || {};
                for(var key in additionalData){
                    if(key === 'revenue' || key === 'value') continue;
                    if(additionalData[key]) data[key] = additionalData[key];
                }
                return data;
            } catch(err){
                return {};
            }
        }

        function processEvent(o){
            try {
                //1.1 populate with events we want to capture e.g. 'form_submission_successful'
                var eventsWeAreInterestedIn = WT.GTMEventsToIntercept;

                var evt = o.event;
                var ga4evt = (o[0] && o[0] === 'event' && o[1]) || undefined;

                var event = evt || ga4evt;
                var data = (ga4evt && o[2]) || (typeof o.data === 'object' && o.data) || {};

                //1.2 we want to do something here. this is an event we're interested in.
                if(eventsWeAreInterestedIn.includes(event)){
                    opt_data.push({
                        event: event,
                        data: data
                    });
                }

                if(event === 'purchase'){
                    var eccomData = getPurchaseEccomData(o);
                    opt_data.push({
                        event: 'Purchase',
                        data: eccomData 
                    });
                }  
                
            } catch(err) {
                if (document.cookie.match(/_wt.bdebug=true/i)) console.log(err);
            }
        }

        //2. process existing events
        dataLayer.forEach(function(o){
            try {
                processEvent(o);
            } catch(err) {
                if (document.cookie.match(/_wt.bdebug=true/i)) console.log(err);
            }
        });

        //3.1 store old dataLayer.push
        var dataLayerPush__old = dataLayer.push;

        //3.2 create a new version of that method. should receive an Object as the argument
        dataLayer.push = function(o){

            //3.3 trigger the old event, so we don't break existing functionality.
            dataLayerPush__old.apply(this, arguments);

            try {
                processEvent(o);
            } catch(err) {
                if (document.cookie.match(/_wt.bdebug=true/i)) console.log(err);
            }
            
        };
       

        WT.gtmHookActive = true;

    }, 500);

    setTimeout(function(){
        clearInterval(intvl);
    }, 15000);
})();
