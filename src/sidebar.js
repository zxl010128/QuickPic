
// sidebar window “X” setting
document.getElementById("closeSidebar").addEventListener('click', () => {
    document.getElementById("sidebarWindow").style.display = "none"
})

// sidebar toggle button window setting
document.getElementById("sidebarButton").addEventListener('click', () => {
    document.getElementById("sidebarWindow").style.display = "block"
})

// sidebar add friend module
document.getElementById("searchFriend").addEventListener('click', () => {
    searchFriend()
});

// sidebar unfollow friend module
document.getElementById("unfollowFriend").addEventListener('click', () => {
    unfollowFriend()
});

function searchFriend() {
    document.getElementById("sidebarWindow").style.display = "none"
    document.getElementById("alert").innerText = "Please Enter the username you are looking for:";
    document.getElementById("addFriend").style.display = "block";
    document.getElementById("popupWindow").style.display = "block";
    document.getElementById("popupConfirm").addEventListener('click', function(){
        addFriend(document.getElementById("popupInput").value);
    }, {once:true});
}

function unfollowFriend() {
    document.getElementById("sidebarWindow").style.display = "none"
    document.getElementById("alert").innerText = "Please Enter the username you want to unfollow:";
    document.getElementById("addFriend").style.display = "block";
    document.getElementById("popupWindow").style.display = "block";
    document.getElementById("popupConfirm").addEventListener('click', function(){
        unfollowfriend(document.getElementById("popupInput").value);
    }, {once:true});
}

// sidebar my profile module
document.getElementById('myProfile').addEventListener('click', () => {

    removeAllChildNodes(document.getElementById('profileScreen'))
    removeAllChildNodes(document.getElementById('LoadFeedContainer'));
    document.getElementById("sidebarWindow").style.display = "none"
    document.getElementById('feedScreen').style.display = 'none'
    loadProfile('me');
});

// sidebar post new post module
document.getElementById('NewPost').addEventListener('click', () => {

    // A modal popup to get post input
    const modal = document.createElement("div");
    modal.className = 'opacityWindow';
    modal.setAttribute('id', 'newPost');

    const outer = document.createElement('div');
    outer.className = 'likeAndComment';

    const close = document.createElement('span');
    close.insertAdjacentHTML("afterbegin", '&times;');
    close.setAttribute('id', 'closenewPost');

    close.addEventListener('click', () => {
        modal.style.display = 'none'
        document.getElementsByTagName('main')[0].removeChild(modal);
    });

    outer.appendChild(close);

    const title = document.createElement('h1');
    title.innerText = 'New Post'
    outer.appendChild(title);

    const PostContent = document.createElement('p');
    PostContent.innerText = 'Content';
    const content = document.createElement('input');

    const picUrl = document.createElement('p');
    picUrl.innerText = 'Picture';
    const url = document.createElement('input');
    url.type = 'file';

    outer.appendChild(PostContent);
    outer.appendChild(content);
    outer.appendChild(picUrl);
    outer.appendChild(url);

    const confirm = document.createElement('button');
    confirm.innerText = 'Post';

    confirm.addEventListener('click', () => {

        // when the inputs are not correct
        if (content.value.length == 0 || url.value.length == 0) {
            modal.style.display = 'none'
            document.getElementById('sidebarWindow').style.display = 'none';
            document.getElementsByTagName('main')[0].removeChild(modal);
            document.getElementById("alert").innerText = "Your must provide both pic and content";
            document.getElementById("popupWindow").style.display = "block";

        } else {

            let postContent = content.value;
            fileToDataUrl(url.files[0]).then(data => {

                let body = {};

                body['description_text'] = content.value;
                body['src'] = data.substring(22);

                // fetch new post url
                fetch(`http://localhost:5000/post`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': "Token " + document.cookie.split('=')[1],
                    },
                    body: JSON.stringify(body)
                }).then(data => {
    
                    if (data.status == 400) {
                        document.getElementById("alert").innerText = "You are doing a Malformed Request!";
                        document.getElementById("popupWindow").style.display = "block";
                    }

                }).catch((error) => {
                    console.log("Error: ", error);
                });
    
                modal.style.display = 'none'
                document.getElementById('sidebarWindow').style.display = 'none';
                document.getElementsByTagName('main')[0].removeChild(modal);
        
            });

        }


    });

    outer.appendChild(confirm);

    modal.appendChild(outer);
    document.getElementsByTagName('main')[0].appendChild(modal);
});