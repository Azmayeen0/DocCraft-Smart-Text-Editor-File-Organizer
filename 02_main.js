(function () {
    let btn = document.querySelector("#myButton");
    let h1 = document.querySelector("h1");

    btn.addEventListener("click",function(){
        h1.style.color="green";
    });

    btn.addEventListener("mouseover",function(){
        h1.style.color="red";
    });

    btn.addEventListener("mouseout",function(){
        h1.style.color="yellow";
    });

})();


