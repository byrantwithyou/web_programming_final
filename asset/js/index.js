let items = [{
    msg: "hello",
    state: "active"
}];
let currentMode = "all";
if (localStorage.getItem("items")) {
    items = JSON.parse(localStorage.getItem("items"));
}
updateView(currentMode);
function updateView(currentMode) {
    document.getElementById("show-number-item").innerHTML = `${items.filter(
        item => item.state == "active"
    ).length} active items left`;
    if ("archived" == currentMode) {
        showItems(items.filter(item => item.state = "archived"));
    } else if ("active" == currentMode) {
        showItems(items.filter(item => item.state == "active"))
    } else {
        showItems(items);
    }
}

function showItems(items) {
    for (item of items) {
        let ui_state = {
            active: item.state == "active"? "": "style=display:none",
            archived: item.state == "archived"? "" : "style=display:none;"
        }
        let template = String.raw
            `<div id="item-container-active" class="flex spc-arnd align-end">
                <span class="flex">${item.msg}</span>
                <div class="hght-15"></div>
                <div class="flex flex-end align-end">
                    <img class="icon" src="asset/img/undo-solid.svg" ${ui_state.archived}>
                    <img class="icon" src="asset/img/check-circle-regular.svg" ${ui_state.active}>
                    <img class="icon"  src="asset/img/trash-solid.svg">
                </div>
            </div>
            <div class="hght-15"></div>`
        document.getElementById("items").innerHTML += template;
    }
}