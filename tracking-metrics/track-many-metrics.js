// This uses delegation to handle times where the element isn't available all the time.
// Based on the page https://www.webtrends-optimize.com/google-optimize-sunset/

let list = {
  // 'metric name': 'selector'
  
  'Click_MobileNav_Launch': '#toggle-mobile-menu',
  'Click_RequestDemo_All': 'a.launch-lightboxform',
  // ...
};
let testAlias = "ta_something";

document.body.addEventListener("click", e => {

  for(let conversionPoint in list){
    let selector = list[cp];
    
    if(e.target.closest(selector)){
      // track metric 

      WT.click({ testAlias, conversionPoint });
    }
  }
  
});
