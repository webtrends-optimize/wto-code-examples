// YOU MANAGE THIS BIT
WT.ConversionPackage_events = {
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

// LEAVE THIS BIT ALONE 
WT.ConversionPackage = function () {
    try {

        if(!WT.optimize || !WT.getProjectCookies){
            setTimeout(WT.ConversionPackage, 100);
            return; 
        }
        
        // already running
        var testAliasExclusionList = ['ta_dummy_exclude'];
        
        // Metrics 
        var oConv = WT.ConversionPackage_events.advanced;
        for (var key in WT.ConversionPackage_events.simple) {
            oConv.push({ regex: WT.ConversionPackage_events.simple[key], name: key });
        }
        if (window.location.href.match(/_wt.convPackageDebug=true/i)) document.cookie = '_wt.convPackageDebug=true;path=/;'; var Print = {}, bDebug = Boolean(document.cookie.match(/_wt.convPackageDebug=true/i)); if (bDebug) { Print.debug = window.console; Print.debug.alert = window.alert; } else { Print.debug = { log: function () { }, info: function () { }, warn: function () { }, error: function () { }, dir: function () { }, alert: function () { } }; } Print.debug.log('Conversion Package Running'); var Core = {}; WT.CPCore = Core; var cfg = WT.optimizeModule.prototype.wtConfigObj; var domainID = cfg.s_domainKey; var keyToken = cfg.s_keyToken; Core.cookieMethods = WT.helpers.cookie; Core.getTestAliases = function () { if (window.location.search.match(/cpDummy/i) && !Core.cookieMethods.has('wt_dummy_pkg')) { var answer = window.prompt(); Core.cookieMethods.set('wt_dummy_pkg', answer, 1); } var cookies = document.cookie.match(/_wt.control\-\d+\-([^=]+)/g); var projectCookies = document.cookie.match(/_wt.project/i); var hasLSCookies = WT.cookieStrategy === "localstorage" && window.localStorage && Object.keys(localStorage).filter(function(x){ return x.match(/_wt.(control|project)/i) }).length; if (!cookies && !projectCookies && !hasLSCookies) return false; var arr = []; if (Core.cookieMethods.has('wt_dummy_pkg')) { var dummyTa = Core.cookieMethods.get('wt_dummy_pkg'); arr.push(dummyTa); } else if (cookies) { for (var i = 0; i < cookies.length; i++) { var c = cookies[i].replace(/_wt.control\-\d+\-/i, ''); arr.push(c); } } if (WT.getProjectCookies) { var list = Object.keys(WT.getProjectCookies()); for (var i = 0; i < list.length; i++) { arr.push(list[i].replace(/_wt.control\-\d+\-/i, '')); } } return arr; }; Core.getMatchingUrl = function (wlh, regArr) { for (var j = 0; j < regArr.length; j++) { if (wlh.match(regArr[j])) { Print.debug.log("page matches:", regArr[j]); return true; } } }; Core.trackAliases = function (testAliases, testAliasExclusionList, me, dataInfo) { dataInfo = (typeof dataInfo === 'undefined') ? {} : dataInfo; for (var l = 0; l < testAliasExclusionList.length; l++) { var excludedAlias = testAliasExclusionList[l]; index = testAliases.indexOf(excludedAlias); if (index > -1) { testAliases.splice(index, 1); } } var o = { testAlias: '', conversionPoint: me.name, additionalCookies: {}, data: dataInfo }; var projectCookies = {}; if (WT.getProjectCookies) { projectCookies = WT.getProjectCookies(); } for (var k = 0; k < testAliases.length; k++) { var tA = testAliases[k]; var cookiename = '_wt.control-' + domainID + '-' + tA; var controlcookie = Core.cookieMethods.get(cookiename); if (controlcookie) { o.additionalCookies[cookiename] = { value: controlcookie }; } var pcookie = projectCookies[cookiename]; if (pcookie) o.additionalCookies[cookiename] = pcookie; } var testAliasString = testAliases.join(); o.testAlias = testAliasString; o.additionalCookies['_wt.user-' + domainID] = { value: Core.cookieMethods.get('_wt.user-' + domainID) }; o.additionalCookies['_wt.mode-' + domainID] = { value: Core.cookieMethods.get('_wt.mode-' + domainID) }; Print.debug.log("ctrack:", o); WTO_CTrack2(o); }; WT.trackEvent = function (o) { Core.trackAliases([o.testAlias], [], { name: o.conversionPoint }, o.data || {}); }; function doEvaluate(onEvent) { var wlh = window.location.href; var testAliases = Core.getTestAliases(); if (!testAliases || !testAliases.length) return; for (var i = 0; i < oConv.length; i++) { var me = oConv[i]; if ((!onEvent && !me.onEvent) || me.onEvent == onEvent) { } else { continue; } if (me.regex) { var regArr = (me.regex instanceof Array) ? me.regex : [me.regex]; var urlMatched = Core.getMatchingUrl(wlh, regArr); if (!urlMatched) continue; } if (me.path) { var regArr = (me.regex instanceof Array) ? me.regex : [me.regex]; var urlMatched = Core.getMatchingUrl(location.pathname, regArr); if (!urlMatched) continue; } if (me.ifCondition) { try { if (!me.ifCondition()) { continue; } } catch (err) { continue; } } var data = {}; if (typeof me.collectData === 'function') { try { data = me.collectData(); } catch (err) { console.log(err); } } Core.trackAliases(testAliases, testAliasExclusionList, me, data); } }; var WTO_CTrack2 = function (params) { var OTS_ACTION = params.conversionPoint ? "track" : "control"; var OTS_GUID = domainID + (params.testAlias ? "-" + params.testAlias : ""); var useTestGroupShared = false; var OTS_URL_POST = "https://ots.webtrends-optimize.com/ots/api/rest-1.2/" + OTS_ACTION + "/" + OTS_GUID; var aCookies = params.additionalCookies || {}; var cookiesFound = document.cookie.match(/_wt\.(user|mode)-[^=]+=[^;\s$]+/ig); if (cookiesFound) { var qpURL = "\x26url\x3d" + (params.URL ? encodeURIComponent(params.URL) : window.location.origin + window.location.pathname); var qpConversion = params.conversionPoint && "\x26conversionPoint\x3d" + params.conversionPoint || ""; var qpData = params.data ? "\x26data\x3d" + JSON.stringify(params.data) : ""; var offsetValue = function () { var rightNow = new Date; var offset = -rightNow.getTimezoneOffset() / 60; return offset * 1E3 * 60 * 60; }; var offset = "\x26_wm_TimeOffset\x3d" + offsetValue(); var referrer = ""; if (window.document && window.document.referrer && document.referrer !== "") referrer = "\x26_wm_referer\x3d" + document.referrer; var rqElSrc = "keyToken\x3d" + keyToken + "\x26preprocessed\x3dtrue\x26_wt.encrypted\x3dtrue\x26testGroup\x3d" + (useTestGroupShared ? "shared" : "default") + qpURL + "\x26cookies\x3d" + JSON.stringify(aCookies) + qpConversion + qpData + offset + referrer; Print.debug.log("--- Sending Request ---"); Print.debug.log(rqElSrc); if (navigator.sendBeacon && window.Blob) { var blob = new Blob([rqElSrc], { type: 'application/x-www-form-urlencoded' }); navigator.sendBeacon(OTS_URL_POST, blob); } else { var xhttp = new XMLHttpRequest(); xhttp.open("POST", OTS_URL_POST, true); xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); xhttp.send(rqElSrc); } } }; WT.helpers.CTrack2 = WTO_CTrack2;

        /* Triggers 
        -------------------------------------------------------------*/
        
        // On page load
        doEvaluate(false);

        for(var key in WT.ConversionPackage_events.triggers){
            WT.ConversionPackage_events.triggers[key](doEvaluate);
        }
        
        function processOptData(aEntry) { try { if (!(aEntry instanceof Array)) return "bad input"; var testAliases = Core.getTestAliases(); if (!testAliases || !testAliases.length) return "no control cookies found, nothing to store."; aEntry.forEach(function (o) { if (o.event) { var o_data = {}; if (o.data) { for (var key in o.data) { if (!(typeof o.data[key]).match(/number|string/i)) { continue; } o_data[key] = o.data[key]; } } Core.trackAliases(testAliases, testAliasExclusionList, { name: o.event }, o_data); } }); } catch (err) { } } if (window.opt_data && opt_data.length) { processOptData(opt_data) } if (!window.opt_data || window.opt_data instanceof Array) { window.opt_data = { h: (window.opt_data || []), push: function (o) { try { if (!o) return "opt_data.push - missing any arguments"; if (!o.event) return "opt_data.push - you should provide o.event"; this.h.push(o); processOptData([o]); return this.h; } catch (err) { return err; } } }; }
    } catch (err) { if (document.cookie.match(/_wt.bdebug=true/i)) console.log(err); }
};
WT.ConversionPackage();
