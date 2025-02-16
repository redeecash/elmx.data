function Export2HTML(contents, filename = '') {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contents));
    element.setAttribute('download', filename);
      
    element.style.display = 'none';
    document.body.appendChild(element);
      
    element.click();
      
    document.body.removeChild(element);
}

function Export2Doc(contents, filename = ''){
    var html = contents;

    var blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });
    
    // Specify link url
    var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
      
    // Create download link element
    var downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob ){
        navigator.msSaveOrOpenBlob(blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = url;
        
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
    
    document.body.removeChild(downloadLink);
}


var $ = function (selector) {
    return document.querySelector(selector);
  }
  function id(element_id) {
    return document.getElementById(element_id);
  }
  function listener(element_id,action,callback) {
    if (id(element_id)) {
      id(element_id).addEventListener(action,callback);
    } else {
      console.log("Element does not exist in the HTML: " + element_id);
    }
  }
  function show(element_id) {
    id(element_id).style.display = "block";
  }
  function hide(element_id) {
    id(element_id).style.display = "none";
  }
  function showParent(element_id) {
    id(element_id).parentNode.style.display = "block";
  }
  function hideParent(element_id) {
    id(element_id).parentNode.style.display = "none";
  }
  function showAlert(page, title, message, callback=null) {
    id(page + "-dialog-title").innerHTML = title;
    id(page + "-dialog-message").innerHTML = message;
    id(page + "-dialog").style.display = "block";
  
    if (callback) {
      listener(page + "-dialog-ok","click",function(e){
        hide(page + "-dialog");
        callback();
      });
    } else {
      listener(page + "-dialog-ok","click",function(e){
        hide(page + "-dialog");
      });
    }
  }
  /**
   * Confirm Dialog
   */
  function showConfirm(title, message, callback) {
    id("confirm-dialog-title").innerHTML = title;
    id("confirm-dialog-message").innerHTML = message;
    id("confirm-dialog").style.display = "block";
  
    listener("confirm-dialog-yes","click",function(e){
      hide("confirm-dialog");
      callback();
    });
  
    listener("confirm-dialog-no","click",function(e){
      hide("confirm-dialog");
    });
  }
  function editable(element_id, edit) {
    if (edit) {
      id(element_id).removeAttribute("readonly");
      id(element_id).classList.value = "w3-input w3-block w3-pale-yellow";
    } else {
      id(element_id).setAttribute("readonly","readonly");
      id(element_id).classList.value = "w3-input w3-block w3-light-grey";
    }
  }
  //
  // Implementing an Ajax for WordPress in pure JavaScript
  // url: http://{host}/wp-admin/admin-ajax.php
  //
  function wp_ajax(url, action, params, callback) {
      var args = "";
      for(var key in params) {
          args += "&" + key + "=" + params[key];
      }
      fetch(url,{
          method: 'post',
          headers: {
              "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
          },
          body: 'action='+action+args
      })
      .then((resp)=>resp.json())
      .then(function(data){
          callback(data);
      })
      .catch(function(err){
          throw err;
      });
  }
  window.api.receive("error",function(channel, event, error){
    showAlert("error","Error",error);
  });
  function SendIPC(channel,params,callback) {
    window.api.receive(channel, function(channel, event, data){
      callback(channel, event, data);
    });
    window.api.send(channel, params);
  }
// Function to convert JavaScript object to XML
function convertToXml(obj, indent = '') {
  var xml = '';
  for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
      if (typeof obj[prop] === 'object') {
          xml += `${indent}<${prop}>\n${convertToXml(obj[prop], indent + '  ')}${indent}</${prop}>\n`;
      } else {
          xml += `${indent}<${prop}>${obj[prop]}</${prop}>\n`;
      }
      }
  }
  return xml;
}   
function download(content,filename) {
  // Create a Blob from the content
  var blob = new Blob([content], { type: "application/xml" });

  // Create a URL for the Blob
  var blobUrl = URL.createObjectURL(blob);

  // Create a download link
  var downloadLink = document.createElement("a");
  downloadLink.href = blobUrl;
  downloadLink.download = filename; // File name
  downloadLink.textContent = "Download File";

  // Append the link to the document
  document.body.appendChild(downloadLink);

  // Simulate a click event on the link to trigger the download
  downloadLink.click();

  // Clean up by revoking the Blob URL
  URL.revokeObjectURL(blobUrl);                
}         
