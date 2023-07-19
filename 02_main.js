(function (){
    let btnAddFolder = document.querySelector("#addFolder");
    let btnAddtextFile = document.querySelector("#addTextFile");
    let divBreadcrumb = document.querySelector("#Breadcrumb");

    let divApp = document.querySelector("#app");
    let divAppTitleBar = document.querySelector("#app-title-bar");
    let divAppTitle = document.querySelector("#app-title");
    let divAppMenuBar = document.querySelector("#app-menu-bar");
    let divAppBody = document.querySelector("#app-body");

    let aRootPath = divBreadcrumb.querySelector("a[purpose='Path']");
    let templates = document.querySelector("#templates");
    let divContainer = document.querySelector("#container");

    btnAddFolder.addEventListener("click",addFolder);
    btnAddtextFile.addEventListener("click",addTextFile);
    aRootPath.addEventListener("click",viewFolderFromPath);

    let resources = [];
    let cfid = -1;
    let rid = 0;

    //persist folder
    //validation-non blank,unique
    function addFolder(){
        let rname = prompt("Enter folder's name");
        if(rname != null){
        rname = rname.trim();
        }
        if(!rname){                                  //!rname means not valid or true
            alert("Empty name is not allowed");     //empty name check
            return;
        }
        
        let alreadyExists = resources.some(r => r.rname == rname && r.pid == cfid);
        if(alreadyExists==true){
            alert(rname + " already exists");          //unique name check
            return;
        }
        let rid = resources.length;
        let pid = cfid;
        rid++;
        addFolderHTML(rname,rid,pid);
        resources.push({
            rid:rid,
            rname:rname,
            rtype:"folder",
            pid:cfid
        })
        saveToStorage();
    }

    function addFolderHTML(rname,rid,pid){
        let divFolderTemplates = templates.content.querySelector(".folder"); //template of folder is created 
        let divFolder = document.importNode(divFolderTemplates,true);         //carbon copy of the folder

        let spanRename = divFolder.querySelector("[action=rename]");
        let spanDelete = divFolder.querySelector("[action=delete]");
        let spanView = divFolder.querySelector("[action=view]");

        

        spanRename.addEventListener("click",renameFolder);
        spanDelete.addEventListener("click",deleteFolder);
        spanView.addEventListener("click",viewFolder);

        let divName = divFolder.querySelector("[purpose=name]");
        divName.innerHTML = rname;
        divFolder.setAttribute("rid",rid);
        divFolder.setAttribute("pid",pid);

        divContainer.appendChild(divFolder);     //added the folder clone into the container
    }

    function addTextFileHTML(rname,rid,pid){
        let divTextFileTemplates = templates.content.querySelector(".text-file"); //template of folder is created 
        let divTextFile = document.importNode(divTextFileTemplates,true);         //carbon copy of the folder

        let spanRename = divTextFile.querySelector("[action=rename]");
        let spanDelete = divTextFile.querySelector("[action=delete]");
        let spanView = divTextFile.querySelector("[action=view]");
        let divName = divTextFile.querySelector("[purpose=name]");

        spanRename.addEventListener("click",renameTextFile);
        spanDelete.addEventListener("click",deleteTextFile);
        spanView.addEventListener("click",viewTextFile);
        divName.innerHTML = rname;
        divTextFile.setAttribute("rid",rid);
        divTextFile.setAttribute("pid",pid);

        divContainer.appendChild(divTextFile);     //added the folder clone into the container
    }

    function addTextFile(){
        let rname = prompt("Enter text-file's name");
        if(rname != null){
        rname = rname.trim();
        }
        if(!rname){                                  //!rname means not valid or true
            alert("Empty name is not allowed");     //empty name check
            return;
        }
        
        let alreadyExists = resources.some(r => r.rname == rname && r.pid == cfid);
        if(alreadyExists == true){
            alert(rname + " already exists");          //unique name check
            return;
        }
        let rid = resources.length;
        let pid = cfid;
        rid++;
        addTextFileHTML(rname,rid,pid);
        resources.push({
            rid:rid,
            rname:rname,
            rtype:"text-file",
            pid:cfid
        })
        saveToStorage();
    }

    function deleteFolder(){
        //Dlete from html
        //Find the cfid on which the dlete is clicked and then recursively delete the folders inside it

        let spanDelete = this;
        let divFolder = spanDelete.parentNode;//parent of the file which is going to be deleted
        let divName = divFolder.querySelector("[purpose = 'name']");

        let fidToBeDeleted= parseInt(divFolder.getAttribute("rid"));
        let fname = divName.innerHTML;

        let childrenExist = resources.some(r => r.pid == fidToBeDeleted);
        let sure = confirm(`Are you sure you want to delete  ${fname}`);
        if(!sure){
            return;
        }

        //Dlete from html
        divContainer.removeChild(divFolder);
        //Delete from RAM
        deleteHelper(fidToBeDeleted);

        //Storage
        saveToStorage();
    }

    function deleteHelper(fidToBeDeleted){
        let children = resources.filter(r => r.pid == fidToBeDeleted);
        for(let i = 0; i < children.length;i++){
            deleteHelper(children[i].rid);
        }
        let ridx = resources.findIndex(r => r.rid == fidToBeDeleted);
        console.log(resources[ridx].rname);        //
        resources.splice(ridx,1); //this line deletes the object from the array
    }

    function deleteTextFile(){
        let spanDelete = this;
        let divTextFile = spanDelete.parentNode;//parent of the file which is going to be deleted
        let divName = divTextFile.querySelector("[purpose = 'name']");

        let fidToBeDeleted= parseInt(divTextFile.getAttribute("rid"));
        let fname = divName.innerHTML;

        let sure = confirm(`Are you sure you want to delete  ${fname}`);
        if(!sure){
            return;
        }

        //Dlete from html
        divContainer.removeChild(divTextFile);
        //Delete from RAM
        deleteHelper(fidToBeDeleted);

        //Storage
        saveToStorage();
    }

    //rename ,empty old unique 3 validations
    function renameFolder(){
        let nrname = prompt("Enter folder's name");
        if(nrname != null){
            nrname = nrname.trim();
        }
        if(!nrname){                                  //!rname means not valid or true
            alert("Empty name is not allowed");     //empty name check
            return;
        }
        let spanRename = this;
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose=name]");
        let orname = divName.innerHTML;
        let ridTBU = parseInt(divFolder.getAttribute("rid")); 
        if(nrname == orname){
            alert("Please enter new name.");
            return;
        }
        let alreadyExists = resources.some(r => r.rname == nrname && r.pid == cfid);
        if(alreadyExists == true){
            alert(nrname+ " already exist");
            return;
        }
        //change html
        divName.innerHTML = nrname;
        //change ram
        let resource = resources.find(r => r.rid == ridTBU);
        resource.rname = nrname;
        
        //change storage
        saveToStorage();
    }

    //rename
    function renameTextFile(){
        let nrname = prompt("Enter file's name");
        if(nrname != null){
            nrname = nrname.trim();
        }
        if(!nrname){                                  //!rname means not valid or true
            alert("Empty name is not allowed");     //empty name check
            return;
        }
        let spanRename = this;
        let divTextFile = this.parentNode;
        let divName = divTextFile.querySelector("[purpose=name]");
        let orname = divName.innerHTML;
        let ridTBU = parseInt(divTextFile.getAttribute("rid")); 
        if(nrname == orname){
            alert("Please enter new name.");
            return;
        }
        let alreadyExists = resources.some(r => r.rname == nrname && r.pid == cfid);
        if(alreadyExists == true){
            alert(nrname+ " already exist");
            return;
        }
        //change html
        divName.innerHTML = nrname;
        //change ram
        let resource = resources.find(r => r.rid == ridTBU);
        resource.rname = nrname;
        
        //change storage
        saveToStorage();
    }
    function viewFolder(){
       let spanView = this;
       let divFolder = spanView.parentNode;
       let divName = divFolder.querySelector("[purpose='name']");

       let fname = divName.innerHTML;
       let fid = parseInt(divFolder.getAttribute("rid"));

       let aPathTemplate = templates.content.querySelector("a[purpose='Path']");
       let aPath = document.importNode(aPathTemplate,true);

       aPath.innerHTML = fname;
       aPath.setAttribute("rid",fid);
       aPath.addEventListener("click" , viewFolderFromPath);
       divBreadcrumb.appendChild(aPath);

       cfid = fid;
       divContainer.innerHTML="";
       for(let i = 0; i <resources.length;i++){
          if(resources[i].pid==cfid){
            if(resources[i].rtype == "folder"){
                addFolderHTML(resources[i].rname,resources[i].rid,resources[i].pid);
            }else if(resources[i].rtype == "text-file"){
                addTextFileHTML(resources[i].rname,resources[i].rid,resources[i].pid);
            }
            }
        }

    }

    function viewFolderFromPath(){
        let aPath = this;
        let fid = parseInt(aPath.getAttribute("rid"));

        //set the breadCrumb
        while(aPath.nextSibling ){
            aPath.parentNode.removeChild(aPath.nextSibling);
        }

        //set the container
        cfid = fid;
        divContainer.innerHTML = "";
        for(let i = 0; i <resources.length;i++){
            if(resources[i].pid==cfid){
                if(resources[i].rtype == "folder"){
                    addFolderHTML(resources[i].rname,resources[i].rid,resources[i].pid);
                }else if(resources[i].rtype == "text-file"){
                    addTextFileHTML(resources[i].rname,resources[i].rid,resources[i].pid);
                }
            }
        }
    }

    function viewTextFile(){
        let spanView = this;
        let divTextFile = spanView.parentNode;
        let divName = divTextFile.querySelector("[purpose = name]");
        let fname = divName.innerHTML;
        let fid = parseInt(divTextFile.getAttribute("rid"));

        let divNotepadMenuTemplate = templates.content.querySelector("[purpose = notepad-menu]");
        let divNotepadMenu = document.importNode(divNotepadMenuTemplate,true);
        divAppMenuBar.innerHTML= "";
        divAppMenuBar.appendChild(divNotepadMenu);

        let divNotepadBodyTemplate = templates.content.querySelector("[purpose=notepad-body]");
        let divNotepadBody = document.importNode(divNotepadBodyTemplate, true);
        divAppBody.innerHTML= "";
        divAppBody.appendChild(divNotepadBody);

        divAppTitle.innerHTML = fname;

        let spanSave = divAppMenuBar.querySelector("[action=save]");
        let spanBold = divAppMenuBar.querySelector("[action=bold]");
        let spanItalic = divAppMenuBar.querySelector("[action=italic]");
        let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
        let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
        let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
        let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
        let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");

        spanSave.addEventListener("click" , saveNotePad);
        spanBold.addEventListener("click" , makeNotePadBold);
        spanItalic.addEventListener("click" , makeNotePadItalic);
        spanUnderline.addEventListener("click" , makeNotePadUnderline);
        inputBGColor.addEventListener("click" , changeNotePadBGColor);
        inputTextColor.addEventListener("click" , changeNotePadTextColor);
        selectFontFamily.addEventListener("click" , changeNotePadFontFamily);
        selectFontSize.addEventListener("click" , changeNotePadFontSize);

    }

    function changeNotePadBGColor(){
        let color = this.value;
        let textArea = divAppBody.querySelector("textarea");
        textArea.style.backgroundColor = color;
    }
    function changeNotePadTextColor(){
        let color = this.value;
        let textArea = divAppBody.querySelector("textarea");
        textArea.style.color = color;
    }

    function makeNotePadBold(){
        let textArea = divAppBody.querySelector("textarea");
        let isPressed = this.getAttribute("pressed") == true;
        if(isPressed == false){
            this.setAttribute("pressed" , true);
            textArea.style.fontWeight = "bold";
        }else{
            this.setAttribute("pressed" , false);
            textArea.style.fontWeight = "normal";
        }
    }

    function makeNotePadItalic(){
        let textArea = divAppBody.querySelector("textarea");
        let isPressed = this.getAttribute("pressed") == true;
        if(isPressed == false){
            this.setAttribute("pressed" , true);
            textArea.style.fontStyle = "italic";
        }else{
            this.setAttribute("pressed" , false);
            textArea.style.fontStyle = "normal";
        }
    }

    function makeNotePadUnderline(){
        let textArea = divAppBody.querySelector("textarea");
        let isPressed = this.getAttribute("pressed") == true;
        if(isPressed == false){
            this.setAttribute("pressed" , true);
            textArea.style.textDecoration = "underline";
        }else{
            this.setAttribute("pressed" , false);
            textArea.style.textDecoration = "normal";
        }
    }


    function saveToStorage(){
        let rjson = JSON.stringify(resources);
        localStorage.setItem("data" , rjson);
        
    }
    function loadFromStorage(){
        let rjson = localStorage.getItem("data");
        if(!!rjson){
            resources = JSON.parse(rjson);
            for(let i = 0; i <resources.length;i++){
                if(resources[i].pid==cfid){
                    if(resources[i].rtype == "folder"){
                        addFolderHTML(resources[i].rname,resources[i].rid,resources[i].pid);
                    }else if(resources[i].rtype == "text-file"){
                        addTextFileHTML(resources[i].rname,resources[i].rid,resources[i].pid);
                    }
                }
                if(resources[i].rid > rid){
                    rid = resources[i].rid;
                }
            }

            
        }
    }
    loadFromStorage();
})(); 

//to prevent name space pollution
