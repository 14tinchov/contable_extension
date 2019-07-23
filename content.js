function isLoginPage(){
  return $('.identificacion-contribuyente').length;
}

function isSiiPage(){
  return $('.web-sii').length;
}

var loadCarpetaTributaria = function(){
  console.log("ejecutando");
  $( "input[value*='36']" ).attr('checked',true)
  $( "input[value*='Aceptar']" ).click();
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "is_sii_page" ) {
      console.log("is_sii_page " + isSiiPage());
      chrome.runtime.sendMessage({"message": "is_sii_page", "sii_page": isSiiPage()});
    } else if( request.message === "is_logged_in" ) {
      console.log("is_logged_in " + isLoginPage());
      chrome.runtime.sendMessage({"message": "is_logged_in", "isLoginPage": isLoginPage()});
    } else if( request.message === "login_with_credentials" ) {
      console.log("login_with_credentials");
      $('#rutcntr').val(request.username);
      $('#clave').val(request.password);
      $(".identificacion-contribuyente button")[0].click()
    } else if( request.message === "load_carpeta_tributaria" ) {
      console.log("load_carpeta_tributaria");
      var frameDocument = $('frame', top.document)[0].contentDocument;
      $(frameDocument).find("input[value*='36']").attr('checked',true);
      $(frameDocument).find("input[value*='Aceptar']").click();
    }
  }
);

$(document).ready(function(){
  console.log(window.location.href);
  if(window.location.href == "https://misiir.sii.cl/cgi_misii/siihome.cgi"){
    chrome.runtime.sendMessage({"message": "change_page_to_zeus"});
  } else if(window.location.href == "https://zeus.sii.cl/dii_cgi/carpeta_tributaria/cte_carpeta_avanzada_00.cgi") {
    setTimeout(function() {
      var frameDocument = $('frame', top.document)[0].contentDocument;
      if ($(frameDocument).find('p')[4]){
        var dato = $(frameDocument).find('p')[4];
        var datoRecuperado = $(dato).text().replace(/<!--.*?-->/sg, "").trim()
        console.log(datoRecuperado);
        chrome.runtime.sendMessage({"message": "put_data", "dataSii": datoRecuperado});
      }
    } , 8000);
  }
})