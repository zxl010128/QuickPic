
function addFriend(username) {

    const result = fetch(`http://localhost:5000/user/follow?username=${username}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Token " + document.cookie.split('=')[1],
        },
    }).then( data => {

        document.getElementById("popupWindow").style.display = "none";
        document.getElementById("addFriend").style.display = "none";
        document.getElementById("popupConfirm").removeEventListener('click', addFriend);
        document.getElementById("popupInput").value = "";

        if (data.status == 200) {
            document.getElementById("sidebarWindow").style.display = "none"
            document.getElementById("alert").innerHTML = "Successfully follow the user " + username + "!";
            document.getElementById("popupWindow").style.display = "block";
            loadFeed();

        } else if (data.status == 400) {
            document.getElementById("sidebarWindow").style.display = "none"
            document.getElementById("alert").innerHTML = "Sorry, you can't follow yourself!";
            document.getElementById("popupWindow").style.display = "block";
        
        } else if (data.status == 404) {
            document.getElementById("sidebarWindow").style.display = "none"
            document.getElementById("alert").innerHTML = "User not found! Please enter correct username!";
            document.getElementById("popupWindow").style.display = "block";
        }
    });

}

function loadFeed() {

    const result = fetch(`http://localhost:5000/user/feed?p=0&n=10`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Token " + document.cookie.split('=')[1],
        },
    }).then( data => {

        if (data.status == 200) {
            data.json().then( data => {

                removeAllChildNodes(document.getElementById('LoadFeedContainer'));
                let objectLength = data['posts'].length;
                
                if (objectLength == 0) {
                    document.getElementById("NoFeed").style.display = "block";
                
                } else {
                    document.getElementById("LoadFeed").style.display = "block";

                    for (let i = 0; i < objectLength; i++) {

                        let allInfo = data['posts'][i];

                        const postBox = document.createElement("div");
                        postBox.className = 'feedCard';
                        postBox.setAttribute('id', allInfo['id']);

                        const cardTitle = document.createElement("div");
                        cardTitle.className = 'cardTitle';

                        const cardAuthor = document.createElement("p");
                        cardAuthor.innerText = allInfo['meta']['author'];
                        cardAuthor.className = 'cardAuthor';

                        const cardTime = document.createElement("p");
                        cardTime.innerText = timeTranslation(allInfo['meta']['published']);
                        cardTime.className = 'cardTime';

                        cardTitle.appendChild(cardAuthor);
                        cardTitle.appendChild(cardTime);

                        const cardImage = document.createElement("img");
                        cardImage.setAttribute('src', `data:image/jpeg;base64,${allInfo['thumbnail']}`);
                        cardImage.className = 'cardImage';

                        const cardInfo = document.createElement("div");
                        cardInfo.className = 'cardInfo';

                        const cardDescription = document.createElement("p");
                        cardDescription.innerText = allInfo['meta']['description_text'];
                        cardDescription.className = 'cardDescription';

                        const LikeButton = document.createElement('button');
                        const CommentButton = document.createElement('button');
                        LikeButton.className = 'buttonLikeClick';
                        CommentButton.className = 'buttonCommentClick';
                        LikeButton.innerHTML = '&#128077;' + ' ' + 'Like';
                        CommentButton.innerHTML = '&#128172;' + ' ' + 'Comment';

                        const cardLikeNum = document.createElement("div");
                        const cardCommentNum = document.createElement("div");
                        const cardToggle = document.createElement("span");
                        cardLikeNum.className = 'cardLikeNum';
                        cardLikeNum.innerText = "Like: " + allInfo['meta']['likes'].length;
                        cardCommentNum.className = 'cardCommentNum';
                        cardCommentNum.innerText = "Comment: " + allInfo['comments'].length;
                        cardToggle.className = 'cardToggle';
                        cardToggle.innerHTML = 	'&equiv;';
                        cardToggle.addEventListener('click', function() {
                            showLikeandComment(allInfo['id']);
                        });

                        cardInfo.appendChild(LikeButton);
                        cardInfo.appendChild(CommentButton);
                        cardInfo.appendChild(cardDescription);
                        cardInfo.appendChild(cardLikeNum);
                        cardInfo.appendChild(cardCommentNum);
                        cardInfo.appendChild(cardToggle);
                        
                        postBox.appendChild(cardTitle);
                        postBox.appendChild(cardImage);
                        postBox.appendChild(cardInfo);

                        document.getElementById('LoadFeedContainer').appendChild(postBox);
                    }
                }

                document.getElementById("feedScreen").style.display = "block";

                console.log(data);
            }
           
        )}
        

    });
}

function showLikeandComment(id) {

    const result = fetch(`http://localhost:5000/post/?id=${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Token " + document.cookie.split('=')[1],
        },

    }).then( data => {

        if (data.status == 400) {
            document.getElementById("alert").innerHTML = "You are doing a Malformed Request!";
            document.getElementById("popupWindow").style.display = "block";
        
        } else if (data.status == 404) {
            document.getElementById("alert").innerHTML = "Page Not Found!";
            document.getElementById("popupWindow").style.display = "block";
        
        } else if (data.status == 200) {
            
            data.json().then( data => {
                
                let listLike = data['meta']['likes'];
                let listComment = data['comments'];

                console.log(listLike);
                console.log(listComment);
                const modal = document.createElement("div");
                modal.className = 'opacityWindow'
                modal.setAttribute('id', 'likeAndComment');
                
                const outer = document.createElement('div');
                outer.className = 'likeAndComment'
            
                const close = document.createElement('span');
                close.setAttribute('id', 'closeLikeandComment')
                close.innerHTML = '&times;'

                const Likediv = document.createElement('div');
                const Commentdiv = document.createElement('div');
                Likediv.className = "LikeOuter"
                Commentdiv.className = "CommentOuter"

                const LikeTitle = document.createElement('p');
                LikeTitle.innerText = 'Who Liked This Post';
                LikeTitle.className = 'boxTitle';

                const CommentTitle = document.createElement('p');
                CommentTitle.innerText = "Comments"
                CommentTitle.className = 'boxTitle';
    
                Likediv.appendChild(LikeTitle)
                Commentdiv.appendChild(CommentTitle)

                const Like = document.createElement('p');

                if (listLike.length == 0) {
                    
                    Like.innerText = 'No one Liked This Post';
                    Like.className = 'boxReminder';
                    Likediv.appendChild(Like);
                
                } else if (listLike.length >= 1) {

                    for (let i = 0; i < listLike.length; i++) {
                        
                        const name = document.createElement('span');
                        name.className = 'boxName';
    
                        givenIdtoUserName(listLike[i]).then(data => {
                            name.innerHTML = '&#128116;' + data['username'] + ' '
                        });

                        Like.appendChild(name);
                    }

                    const likeEnd = document.createElement('span');
                    likeEnd.innerText = 'liked this post.'

                    Like.appendChild(likeEnd);

                    Likediv.appendChild(Like);
                }


                if (listComment.length == 0) {
                    const Comment = document.createElement('p');
                    Comment.innerText = 'No Comments';
                    Comment.className = 'boxReminder';
                    Commentdiv.appendChild(Comment);
                
                } else if (listComment.length >= 1) {
                    
                    for (let i = 0; i < listComment.length; i++) {
                        
                        const name = document.createElement('div');
                        name.className = 'commentBox';

                        const cardAuthor = document.createElement("p");
                        cardAuthor.innerText = listComment[i]['author'];
                        cardAuthor.className = 'cardAuthor';
                        cardAuthor.style.width = '100%'

                        const cardTime = document.createElement("p");
                        cardTime.innerText = timeTranslation(listComment[i]['published']);
                        cardTime.className = 'cardTime';
                        cardTime.style.width = '100%'
                        cardTime.style.marginTop = '-15px'

                        const cardDescription = document.createElement("p");
                        cardDescription.innerText = listComment[i]['comment'];
                        cardDescription.className = 'commentContent';

                        name.appendChild(cardAuthor);
                        name.appendChild(cardTime);
                        name.appendChild(cardDescription)
    
                        Commentdiv.appendChild(name);
                    }

                }
            
                close.addEventListener('click', () => {
                    modal.style.display = 'none'
                    document.getElementsByTagName('main')[0].removeChild(modal);
                });
            
                outer.appendChild(close);
                outer.appendChild(Likediv);
                outer.appendChild(Commentdiv);
                
                modal.appendChild(outer);
                document.getElementsByTagName('main')[0].appendChild(modal);

                console.log(data)
            }
            
        )}

    });
    
}

function givenIdtoUserName(id) {

    return fetch(`http://localhost:5000/user/?id=${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Token " + document.cookie.split('=')[1],
        },

    }).then( data => {
        
        if (data.status == 400) {
            document.getElementById("alert").innerHTML = "You are doing a Malformed Request!";
            document.getElementById("popupWindow").style.display = "block";
        
        } else if (data.status == 404) {
            document.getElementById("alert").innerHTML = "Page Not Found!";
            document.getElementById("popupWindow").style.display = "block";
        
        } else if (data.status == 200) {
            return data.json()
        }

    });

}

function timeTranslation(timeStamp) {

    let time = new Date(timeStamp * 1000);

    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let day = time.getDate();
    let hour = time.getHours();
    let minute = time.getMinutes();
    let second = time.getSeconds();
    let fomattedTime = `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    return fomattedTime;

}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}