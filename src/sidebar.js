
// sidebar window “X” setting
document.getElementById("closeSidebar").addEventListener('click', () => {
    document.getElementById("sidebarWindow").style.display = "none"
})

document.getElementById("sidebarButton").addEventListener('click', () => {
    document.getElementById("sidebarWindow").style.display = "block"
})

document.getElementById("searchFriend").addEventListener('click', searchFriend);

function searchFriend() {
    document.getElementById("sidebarWindow").style.display = "none"
    document.getElementById("alert").innerHTML = "Please Enter the username you are looking for:";
    document.getElementById("addFriend").style.display = "block";
    document.getElementById("popupWindow").style.display = "block";
    document.getElementById("popupConfirm").addEventListener('click', function(){
        addFriend(document.getElementById("popupInput").value);
    });
}

