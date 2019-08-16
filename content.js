/*global chrome*/

function isSiiPage(){
  return $('.web-sii').length;
}

function isLoginPage(){
  return $('.identificacion-contribuyente').length;
}

$(document).ready(function(){
  if(window.location.href == "https://misiir.sii.cl/cgi_misii/siihome.cgi"){
    chrome.runtime.sendMessage({"message": "change_propuestaf"});
  } 

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "is_logged_in" ) {
        console.log("is_logged_in " + isLoginPage());
        chrome.runtime.sendMessage({"message": "is_logged_in", "isLoginPage": isLoginPage()});
      } else if( request.message === "login_with_credentials" ) {
        console.log("login_with_credentials");
        const user = $($('.panel_contents tbody tr .col-user')[0]).text();
        const pass = $($('.panel_contents tbody tr .col-password')[0]).text();
        chrome.storage.local.get(['user_contable', 'password_contable'], function(result) {
          $('#rutcntr').val(result.user_contable);
          $('#clave').val(result.password_contable);
          $(".identificacion-contribuyente button")[0].click()
        });
      } else if( request.message === "load_carpeta_tributaria" ) {
        console.log("load_carpeta_tributaria");
        var frameDocument = $('frame', top.document)[0].contentDocument;
        $(frameDocument).find("input[value*='36']").attr('checked',true);
        $(frameDocument).find("input[value*='Aceptar']").click();
      }
    }
  );


  const path = window.location.pathname.split('/')
  if( window.location.host == 'back-dev.contablest.com' && path[1] == 'admin' && path[2] == 'businesses' ){
    $('#titlebar_right .action_items').prepend('<span class="action_item"><a class="js--contable-button">Pagar</a></span>');
  }

  $('.js--contable-button').on('click', function(e){
    e.preventDefault();
    const user = $($('.panel_contents tbody tr .col-user')[0]).text();
    const pass = $($('.panel_contents tbody tr .col-password')[0]).text();
    chrome.storage.local.set({user_contable: user, password_contable: pass}, function() {
      chrome.runtime.sendMessage({"message": "is_sii_page", "sii_page": isSiiPage()});
    });
  });
})
