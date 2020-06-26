let items = [];
let currentMode = "all";
if (localStorage.getItem("items")) {
    items = JSON.parse(localStorage.getItem("items"));
}

document.getElementById("add-btn").onclick = function () {
    if (document.getElementById("new-item").value.length == 0) {
        return;
    } else {
        items.push({
            msg: document.getElementById("new-item").value,
            state: "active",
            id: items.length == 0? 0: Math.max(...items.map(item => item.id))+1
        });    
    }
    document.getElementById("new-item").value="";
    updateView(currentMode);
    updateStorage();
}

document.getElementById("show-all").onclick = function () {
    currentMode = "all";
    updateView(currentMode);
}

document.getElementById("show-active").onclick = function () {
    currentMode = "active";
    updateView(currentMode);
}

document.getElementById("show-archived").onclick = function () {
    currentMode = "archived";
    updateView(currentMode);
}
document.getElementById("clr-archived").onclick = function () {
    items = items.filter(item => item.state != "archived");
    updateView(currentMode);
    updateStorage();
}

document.getElementById("archived-all").onclick = function () {
    items.forEach(item => item.state = "archived");
    document.getElementById("archived-all").style.display = "none";
    document.getElementById("active-all").style.display = "flex";
    updateView(currentMode);
    updateStorage();
}

document.getElementById("active-all").onclick = function () {
    items.forEach(item => item.state = "active");
    document.getElementById("archived-all").style.display = "flex";
    document.getElementById("active-all").style.display = "none";
    updateView(currentMode);
    updateStorage();
}

updateView(currentMode);
function updateStorage() {
    localStorage.setItem("items", JSON.stringify(items));
}

function updateView(currentMode) {
    if (document.getElementsByClassName("selected").length) {
        Array.from(document.getElementsByClassName("selected")).forEach(element => element.classList.remove("selected"));
    }
    document.getElementById(`show-${currentMode}`).classList.add("selected");
    document.getElementById("show-item-number").innerHTML = `${items.filter(
        item => item.state == "active"
    ).length} active item(s) left`;
    if ("archived" == currentMode) {
        showItems(items.filter(item => item.state == "archived"));
    } else if ("active" == currentMode) {
        showItems(items.filter(item => item.state == "active"))
    } else {
        showItems(items);
    }
}

function showItems(items) {
    document.getElementById("items").innerHTML = "";
    for (item of items) {
        let uiState = {
            active: item.state == "active"? "": "style=display:none",
            archived: item.state == "archived"? "" : "style=display:none;"
        }
        let template = String.raw
            `<div id="item-container-active" class="flex space-around align-contents-end">
                <span class="flex">${item.msg}</span>
                <div class="ht-15"></div>
                <div class="flex justify-content-end align-contents-end" id=${item.id}>
                    <img class="icon active" src="asset/img/undo-solid.svg" ${uiState.archived}>
                    <img class="icon archive" src="asset/img/check-circle-regular.svg" ${uiState.active}>
                    <img class="icon delete"  src="asset/img/trash-solid.svg">
                </div>
            </div>
            <div class="ht-15"></div>`
        document.getElementById("items").innerHTML += template;
    }
    Array.from(document.getElementsByClassName("delete")).forEach(element => element.onclick = generator(element.parentElement.id, "delete"));
    Array.from(document.getElementsByClassName("active")).forEach(element => element.onclick = generator(element.parentElement.id, "active"));
    Array.from(document.getElementsByClassName("archive")).forEach(element => element.onclick = generator(element.parentElement.id, "archive"));
}
function generator(id, mode) {
    function deleteSingleItem() {
        items.splice(items.findIndex(element => element.id == id) ,1);
        updateView(currentMode);
        updateStorage();    
    }
    function activeSingleItem() {
        items.forEach(function(element){
            if (element.id == id) {
                element.state = "active";
                return element;
            }
            return element;
        });
        updateView(currentMode);
        updateStorage();
    }
    function archiveSingleItem() {
        items.forEach(function(element){
            if (element.id == id) {
                element.state = "archived";
            }
            return element;
        });
        updateView(currentMode);
        updateStorage();
    }
    if (mode == "delete") return deleteSingleItem;
    if (mode == "active") return activeSingleItem;
    return archiveSingleItem;
}
