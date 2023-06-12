(function () {
    let btn = document.querySelector("#myFirstButton");
    let divContainer = document.querySelector("#Container");
    let aRootPath = document.querySelector(".path");
    let myTemplates = document.querySelector("#myTemplate");
    let divBreadCrumb = document.querySelector("#breadCrumb");
    let fid = -1;
    let cfid = -1;                                               //current folder id
    let folders = [];
    let fjson = localStorage.getItem("data");

    btn.addEventListener("click", addFolder);

    aRootPath.addEventListener("click", navigateBreadcrumb);

    function addFolder() {
        let fname = prompt("Enter folder's name");
        if (!!fname) {
            let fidx = folders.some(f => f.name == fname);
            if (fidx == false) {
                fid++;
                folders.push({
                    id: fid,
                    name: fname,
                    pid: cfid
                });
                addFolderinHTML(fname, fid, cfid);
                persistFolders()
            } else {
                alert(fname + " already exist");
            }
        } else {
            alert("please enter name");
        }
    }

    function addFolderinHTML(fname, fid, pid) {
        let divFolderTemplate = myTemplates.content.querySelector(".folder");
        let divFolder = document.importNode(divFolderTemplate, true);                  //importNode create copy or clone of the template,,,,,true brings all the data in that div or span

        let divName = divFolder.querySelector("[purpose='name']");
        divName.innerHTML = fname;
        divFolder.setAttribute("fid", fid);
        divFolder.setAttribute("pid", pid);

        let spanDelete = divFolder.querySelector("span[action='delete']");
        spanDelete.addEventListener("click", deleteFolder);

        let spanView = divFolder.querySelector("span[action='View']");
        spanView.addEventListener("click", viewFolder);

        let spanEdit = divFolder.querySelector("span[action='edit']");
        spanEdit.addEventListener("click", editFolder);

        divContainer.appendChild(divFolder)
    }

    function navigateBreadcrumb() {
        let fname = this.innerHTML;
        cfid = parseInt(this.getAttribute("fid"));

        divContainer.innerHTML = "";
        folders.filter(f=>f.pid == cfid).forEach(f=>{
            addFolderinHTML(f.name,f.id,f.pid);
        });
        while(this.nextSibling){
            this.parentNode.removeChild(this.nextSibling);
        }
    }

    function viewFolder() {
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        cfid = parseInt(divFolder.getAttribute("fid"));

        let aPathTemplate = myTemplates.content.querySelector(".path");
        let aPath = document.importNode(aPathTemplate, true);

        aPath.innerHTML = divName.innerHTML;
        aPath.setAttribute("fid", cfid);
        aPath.addEventListener("click", navigateBreadcrumb);
        divBreadCrumb.appendChild(aPath);

        divContainer.innerHTML = "";
        folders.filter(f => f.pid == cfid).forEach(f => {
            addFolderinHTML(f.name, f.id, f.pid);
        })
    }

    function deleteFolder() {
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let fidtbd = divFolder.getAttribute("fid");
        let flag = confirm("Do you want to delete the folder " + divName.innerHTML);
        if (flag == true) {
            let exist = folders.some(f=>f.pid==fidtbd);
            if(exist==false){
            
            let fidx = folders.findIndex(f => f.id == fidtbd);
            folders.splice(fidx, 1);
            divContainer.removeChild(divFolder);
            persistFolders();
            }else{
                alert("Cant delete,folders inside.");
            }
        }
    }

    function editFolder() {
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let ofname = divName.innerHTML;
        let fname = prompt("Enter the new folder name" + ofname);
        if (!!fname) {
            if (fname != ofname) {
                let exist = folders.filter(f => f.pid == cfid).some(f => f.name == fname);
                if (exist == false) {
                    let folder = folders.filter(f => f.pid == cfid).find(f => f.name == fname);                      //f.id == parseInt(divFolder.getAttribute("fid"))
                    folder.name = fname;
                    divName.innerHTML = fname;
                    persistFolders();
                } else {
                    alert(fname + "already exist");
                }
            } else {
                alert("this is the old name enter new name");
            }
        } else {
            alert("please enter a name for the folder");
        }


    };

    function persistFolders() {
        console.log(folders);
        let fjson = JSON.stringify(folders);
        localStorage.setItem("data", fjson);
    };

    function loadFolderFromStorage() {
        let fjson = localStorage.getItem("data");
        if (!!fjson) {
            folders = JSON.parse(fjson);
            folders.forEach(f => {
                if (f.id > fid) {
                    fid = f.id;
                }
                if (f.pid == cfid) {
                    addFolderinHTML(f.name, f.id);
                }
            });
        }
    }

    loadFolderFromStorage();

})();
