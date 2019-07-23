'use strict';

$(document).ready(function(){
  $('#js-contable-button').on('click', function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {"message": "is_sii_page"});
    });
  });
})

//Returns messages
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "is_sii_page" ) {
      if(!request.sii_page){
        chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
          chrome.tabs.update(tab.id, { url: "https://misiir.sii.cl/cgi_misii/siihome.cgi"}, function(tab1){
            // add listener so callback executes only if page loaded. otherwise calls instantly
            var listener = function(tabId, changeInfo, tab) {
              if (tabId == tab1.id && changeInfo.status === 'complete') {
                  chrome.tabs.onUpdated.removeListener(listener);
                  chrome.tabs.sendMessage(tab1.id, {"message": "is_logged_in"});
                  // remove listener, so only run once
              }
            }
            chrome.tabs.onUpdated.addListener(listener);
          });
        });
      } else {
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
          var activeTab = tabs[0];
          chrome.tabs.sendMessage(activeTab.id, {"message": "is_logged_in"});
        });
      }
    } else if( request.message === "is_logged_in" ) {
      if(request.isLoginPage){
        console.log("!request.isLoginPage");
        var siiUsername = $("#js-contable-username").val();
        var siiPassword = $("#js-contable-password").val();
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
          var activeTab = tabs[0];
          chrome.tabs.sendMessage(activeTab.id, {"message": "login_with_credentials", "username": siiUsername, "password": siiPassword});
        });
      }
    } else if( request.message === "change_page_to_zeus" ) {
      console.log("change_page_to_zeus");
      chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
        chrome.tabs.update(tab.id, { url: "https://zeus.sii.cl/dii_cgi/carpeta_tributaria/cte_carpeta_avanzada_00.cgi"}, function(tab1){
          var listener = function(tabId, changeInfo, tab) {
            if (tabId == tab1.id && changeInfo.status === 'complete') {
              chrome.tabs.onUpdated.removeListener(listener);
              chrome.tabs.sendMessage(tab1.id, {"message": "load_carpeta_tributaria"});
            }
          }
          chrome.tabs.onUpdated.addListener(listener);
        });
      });
    } else if( request.message === "put_data" ) {
      $('body').append('<p> Dato recuperado: ' + request.dataSii + '</p>')
    }
  }
);
