
// like a post by id
function likePost(id) {
    
    const result = fetch(`http://localhost:5000/post/like?id=${id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Token " + document.cookie.split('=')[1],
        },
    }).then(data => {
        
        if (data.status == 200) {
            updateLikeAndComment(id);
        }
    }).catch((error) => {
        console.log("Error: ", error);
    });

    let likeButton = document.getElementById(id.toString()).getElementsByClassName('buttonLikeClick')[0];
    likeButton.innerText = ' ' + 'Unlike';
    likeButton.insertAdjacentHTML("afterbegin", '&#128077;');
    likeButton.style.backgroundColor = 'red';
    likeButton.style.color = 'white'

    likeButton.addEventListener('click', UnlikePost.bind(this, id), {once:true});

}

// unlike a post by id
function UnlikePost(id) {

    const result = fetch(`http://localhost:5000/post/unlike?id=${id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Token " + document.cookie.split('=')[1],
        },
    }).then(data => {

        if (data.status == 200) {
            updateLikeAndComment(id);
        }
    }).catch((error) => {
        console.log("Error: ", error);
    });

    let likeButton = document.getElementById(id.toString()).getElementsByClassName('buttonLikeClick')[0];
    likeButton.innerText = ' ' + 'Like';
    likeButton.insertAdjacentHTML("afterbegin", '&#128077;');
    likeButton.style.backgroundColor = 'white';
    likeButton.style.color = 'red'

    likeButton.addEventListener('click', likePost.bind(this, id), {once:true});

}

// Live Update
// 2.6.2 without refresh page update Like and Comment count 
function updateLikeAndComment(id) {

    const result = fetch(`http://localhost:5000/post/?id=${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Token " + document.cookie.split('=')[1],
        },

    }).then( data => {

        if (data.status == 400) {
            document.getElementById("alert").innerText = "You are doing a Malformed Request!";
            document.getElementById("popupWindow").style.display = "block";
        
        } else if (data.status == 404) {
            document.getElementById("alert").innerText = "Page Not Found!";
            document.getElementById("popupWindow").style.display = "block";
        
        } else if (data.status == 200) {
            
            data.json().then( data => {
                document.getElementById(id.toString()).getElementsByClassName('cardLikeNum')[0].innerText = "Like: " + data['meta']['likes'].length;
                document.getElementById(id.toString()).getElementsByClassName('cardCommentNum')[0].innerText = "Comment: " + data['comments'].length;

            })
        }
    }).catch((error) => {
        console.log("Error: ", error);
    });

}

// Make Comment
function makeComment(id) {

    // A popup modal to ask the comment
    const modal = document.createElement("div");
    modal.className = 'opacityWindow';
    modal.setAttribute('id', 'updateComment');

    const outer = document.createElement('div');
    outer.className = 'likeAndComment';
    outer.setAttribute('id', 'commentOuter');

    const close = document.createElement('span');
    close.insertAdjacentHTML("afterbegin", '&times;');
    close.setAttribute('id', 'closeComment');

    close.addEventListener('click', () => {
        modal.style.display = 'none'
        document.getElementsByTagName('main')[0].removeChild(modal);
    });

    outer.appendChild(close);

    const title = document.createElement('p');
    title.innerText = 'Please enter your comment'
    outer.appendChild(title);

    const comment = document.createElement('input');

    outer.appendChild(comment);

    const confirm = document.createElement('button');
    confirm.innerText = 'Save';

    confirm.addEventListener('click', () => {

        // check comment length and fetch the url
        if (comment.value.length > 0) {
            data = {'comment': comment.value};

            fetch(`http://localhost:5000/post/comment?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Token " + document.cookie.split('=')[1],
                },
                body: JSON.stringify(data)
            
            }).then(data => {

                if (data.status == 400) {
                    document.getElementById("alert").innerText = "You are doing a Malformed Request!";
                    document.getElementById("popupWindow").style.display = "block";
                
                } else if (data.status == 404) {
                    document.getElementById("alert").innerText = "Post Not Found!";
                    document.getElementById("popupWindow").style.display = "block";
                
                } else if (data.status == 200) {
                    data.json().then(data => {
                        updateLikeAndComment(id);
                    })
                }

            }).catch((error) => {
                console.log("Error: ", error);
            });
        }

        modal.style.display = 'none'
        document.getElementsByTagName('main')[0].removeChild(modal);

    });
    

    outer.appendChild(confirm);

    modal.appendChild(outer);
    document.getElementsByTagName('main')[0].appendChild(modal);

}

// delete a post by ID
function deletePost(id) {

    fetch(`http://localhost:5000/post?id=${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Token " + document.cookie.split('=')[1],
        },
            
    }).then (data => {
        removeAllChildNodes(document.getElementById('profileScreen'));
        loadProfile('me')
    })
}

// update a post by ID
function updatePost(data, id) {
    fetch(`http://localhost:5000/post?id=${id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Token " + document.cookie.split('=')[1],
        },
        body: JSON.stringify(data)
            
    }).then (data => {
        removeAllChildNodes(document.getElementById('profileScreen'));
        loadProfile('me')
    })
}