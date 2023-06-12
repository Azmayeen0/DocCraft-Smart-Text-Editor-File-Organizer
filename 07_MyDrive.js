(function () {
     let buttonAddFolder = document.querySelector("#myFirstButton");
     let divContainer = document.querySelector("#Container");
     let pagetemplates = document.querySelector("#myTemplates");
     let fid = -1;
     let folders = [];
     //let fjson = localStorage.getItem("data");

     buttonAddFolder.addEventListener("click", addFolder);

     function addFolder() {
          let fname = prompt("Enter folder name");
          if (!!fname) {
               let fidx = folders.findIndex(f => f.name == fname);
               if (fidx == -1) {
                    fid++;
                    folders.push({
                         id: fid,
                         name: fname
                    });
                    addFolderHTML(fname, fid);
                    //Storage
                    saveToStorage();
               } else {
                    alert(fname + " already exists");
               }
          } else {
               alert("Please enter name of Folder");
          }
     }
     

     function addFolderHTML(fname, fid) {
          let divFoldertemplate = pagetemplates.content.querySelector(".folder");
          let divFolder = document.importNode(divFoldertemplate, true);                  //importNode create copy or clone of the template,,,,,true brings all the data in that div or span

          let divName = divFolder.querySelector("[purpose='name']");
          divName.innerHTML = fname;
          divFolder.setAttribute("fid", fid);
          let spanDelete = divFolder.querySelector("span[action='delete']");
          spanDelete.addEventListener("click", deleteFolder);
          let spanEdit = divFolder.querySelector("span[action='edit']");
          spanEdit.addEventListener("click", editFolder);
          divContainer.appendChild(divFolder)
     }
     
     function editFolder() {

     }
     function deleteFolder() {
          let divFolder = this.parentNode;
          let divName = divFolder.querySelector("[purpose='name']");
          let flag = confirm("Do you want to delete the folder " + divName.innerHTML + "?");
          if (flag == true) {
  
              divContainer.removeChild(divFolder);
              let idx = folders.findIndex(f => f.id == parseInt(divFolder.getAttribute("fid")));
              folders.splice(idx, 1);
              saveToStorage();
          }
     }

     function saveToStorage() {  
          console.log(folders);                   //save folders in storage so that when we close the window and starts the page again the folders will not disappear
          let fjson = JSON.stringify(folders);
          localStorage.setItem("data", fjson);                                      //or simply make the folders persist in storage 
     }
     function loadFromStorage() {                   //retrieves the folders already stored in page when we first starts the page
          let fjson = localStorage.getItem("data");
          if (!!fjson) {
               folders = JSON.parse(fjson);
               folders.forEach(f => {
                    if (f.id > fid) {
                         fid = f.id;
                    }
                    addFolderHTML(f.name, f.id);
               });
          }
     }

     loadFromStorage();
})();