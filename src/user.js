// 2.6.1 Infinite Scroll
document.body.addEventListener('scroll', () => {

    if (document.getElementById('feedScreen').style.display == 'block' && document.getElementById('FeedCheck').style.display == 'none' && document.getElementById('LoadFeed').style.display == 'block') {
        if(document.body.scrollTop + document.body.clientHeight == document.body.scrollHeight) {
            loadFeed()
            console.log('ReachEnd')
        }
    }
})

// Follow a frient with the given user name
function addFriend(username) {

    const result = fetch(`http://localhost:5000/user/follow?username=${username}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Token " + document.cookie.split('=')[1],
        },
    }).then(data => {

        document.getElementById("popupWindow").style.display = "none";
        document.getElementById("addFriend").style.display = "none";
        document.getElementById("popupConfirm").removeEventListener('click', addFriend);
        document.getElementById("popupInput").value = "";

        if (data.status == 200) {
            document.getElementById("sidebarWindow").style.display = "none";
            document.getElementById('profileScreen').style.display = 'none';
            removeAllChildNodes(document.getElementById('profileScreen'));
            document.getElementById("alert").innerText = "Successfully follow the user " + username + "!";
            document.getElementById("popupWindow").style.display = "block";
            removeAllChildNodes(document.getElementById('LoadFeedContainer'));
            loadFeed();

        } else if (data.status == 400) {
            document.getElementById("sidebarWindow").style.display = "none"
            document.getElementById("alert").innerText = "Sorry, your format is wrong";
            document.getElementById("popupWindow").style.display = "block";

        } else if (data.status == 404) {
            document.getElementById("sidebarWindow").style.display = "none"
            document.getElementById("alert").innerText = "User not found! Please enter correct username!";
            document.getElementById("popupWindow").style.display = "block";
        }
    }).catch((error) => {
        console.log("Error: ", error);
    });

}

// unFollow a frient with the given user name
function unfollowfriend(username) {

    const result = fetch(`http://localhost:5000/user/unfollow?username=${username}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Token " + document.cookie.split('=')[1],
        },
    }).then(data => {

        document.getElementById("popupWindow").style.display = "none";
        document.getElementById("addFriend").style.display = "none";
        document.getElementById("popupConfirm").removeEventListener('click', addFriend);
        document.getElementById("popupInput").value = "";

        if (data.status == 200) {
            document.getElementById("sidebarWindow").style.display = "none";
            document.getElementById('profileScreen').style.display = 'none';
            removeAllChildNodes(document.getElementById('profileScreen'));
            document.getElementById("alert").innerText = "Successfully unfollow the user " + username + "!";
            document.getElementById("popupWindow").style.display = "block";
            removeAllChildNodes(document.getElementById('LoadFeedContainer'));
            loadFeed();

        } else if (data.status == 400) {
            document.getElementById("sidebarWindow").style.display = "none"
            document.getElementById("alert").innerText = "Sorry, your format is wrong";
            document.getElementById("popupWindow").style.display = "block";

        } else if (data.status == 404) {
            document.getElementById("sidebarWindow").style.display = "none"
            document.getElementById("alert").innerText = "User not found! Please enter correct username!";
            document.getElementById("popupWindow").style.display = "block";
        }
    }).catch((error) => {
        console.log("Error: ", error);
    });

}

// Load 10 Feed 
function loadFeed() {

    let p = document.getElementById('LoadFeedContainer').childNodes.length;

    const result = fetch(`http://localhost:5000/user/feed?p=${p}&n=10`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Token " + document.cookie.split('=')[1],
        },
    }).then(data => {

        if (data.status == 200) {
            data.json().then(data => {

                let objectLength = data['posts'].length;

                // situation when there is less than 10 feed at first
                if (objectLength < 10 && objectLength >= 1 && document.getElementById('LoadFeedContainer').childNodes.length == 0) {
                    document.getElementById("NoFeed").style.display = "none";
                    document.getElementById("LoadFeed").style.display = "block";
                    document.getElementById('FeedCheck').style.display = 'block';

                    // create 
                    userList = data['posts'].sort((a, b) => (a.meta.published > b.meta.published));

                    for (let i = 0; i < objectLength; i++) {
                        let allInfo = userList[i];
                        postBox = posterCreate(allInfo);
                        document.getElementById('LoadFeedContainer').appendChild(postBox);
                    }
                
                // Situation when there is no feed
                } else if (objectLength == 0 && document.getElementById('LoadFeedContainer').childNodes.length == 0) {
                    document.getElementById("NoFeed").style.display = "block";
                    document.getElementById("LoadFeed").style.display = "none";
                    document.getElementById('FeedCheck').style.display = 'none';

                // Situation when there is no new feed
                } else if (objectLength == 0 && document.getElementById('LoadFeedContainer').childNodes.length != 0) {
                    document.getElementById('FeedCheck').style.display = 'block';

                } else {
                    document.getElementById("LoadFeed").style.display = "block";
                    document.getElementById("NoFeed").style.display = "none";
                    document.getElementById('FeedCheck').style.display = 'none';

                    // create 
                    userList = data['posts'].sort((a, b) => (a.meta.published > b.meta.published));

                    for (let i = 0; i < objectLength; i++) {
                        let allInfo = userList[i];
                        postBox = posterCreate(allInfo);
                        document.getElementById('LoadFeedContainer').appendChild(postBox);
                    }

                }
                document.getElementById("feedScreen").style.display = "block";
            }
            )
        }
    });
        
}

// click toggle button to show all likes and comments
function showLikeandComment(id) {

    const result = fetch(`http://localhost:5000/post/?id=${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Token " + document.cookie.split('=')[1],
        },

    }).then(data => {

        if (data.status == 400) {
            document.getElementById("alert").innerText = "You are doing a Malformed Request!";
            document.getElementById("popupWindow").style.display = "block";

        } else if (data.status == 404) {
            document.getElementById("alert").innerText = "Page Not Found!";
            document.getElementById("popupWindow").style.display = "block";

        } else if (data.status == 200) {

            // A modal to show the likelist and comments
            data.json().then(data => {

                let listLike = data['meta']['likes'];
                let listComment = data['comments'];

                // console.log(listLike);
                // console.log(listComment);

                const modal = document.createElement("div");
                modal.className = 'opacityWindow'
                modal.setAttribute('id', 'likeAndComment');

                const outer = document.createElement('div');
                outer.className = 'likeAndComment'

                const close = document.createElement('span');
                close.setAttribute('id', 'closeLikeandComment')
                close.insertAdjacentHTML("afterbegin", '&times;');

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

                // add a Like div containing all the username
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
                            name.innerText = data['username'] + ' ';
                            name.insertAdjacentHTML("afterbegin", '&#128116;');
                            name.addEventListener('click', () => {
                                removeAllChildNodes(document.getElementById('profileScreen'));
                                modal.style.display = 'none'
                                document.getElementsByTagName('main')[0].removeChild(modal);
                                document.getElementById('feedScreen').style.display = 'none'
                                removeAllChildNodes(document.getElementById('LoadFeedContainer'));
                                loadProfile(data['username'])
                            });
                        });

                        Like.appendChild(name);
                    }

                    const likeEnd = document.createElement('span');
                    likeEnd.innerText = 'liked this post.'

                    Like.appendChild(likeEnd);

                    Likediv.appendChild(Like);
                }

                // add a Comment div containing all the comments
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

                        cardAuthor.addEventListener('click', () => {
                            removeAllChildNodes(document.getElementById('profileScreen'));
                            modal.style.display = 'none'
                            document.getElementsByTagName('main')[0].removeChild(modal);
                            document.getElementById('feedScreen').style.display = 'none'
                            removeAllChildNodes(document.getElementById('LoadFeedContainer'));
                            loadProfile(listComment[i]['author'])
                        });

                        const cardTime = document.createElement("p");
                        cardTime.innerText = timeTranslation(listComment[i]['published']);
                        cardTime.className = 'cardTime';
                        cardTime.style.width = '100%'
                        cardTime.style.marginTop = '-15px'
                        cardTime.style.paddingRight = '20px';

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

            )
        }

    }).catch((error) => {
        console.log("Error: ", error);
    });

}

// load Profile by user 
function loadProfile(user) {

    if (user == 'me') {

        const result = fetch(`http://localhost:5000/user/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Token " + document.cookie.split('=')[1],
            },

        }).then(data => {

            if (data.status == 400) {
                document.getElementById("alert").innerText = "You are doing a Malformed Request!";
                document.getElementById("popupWindow").style.display = "block";

            } else if (data.status == 404) {
                document.getElementById("alert").innerText = "Page Not Found!";
                document.getElementById("popupWindow").style.display = "block";

            } else if (data.status == 200) {
                return data.json()
            }

        });

        result.then(data => {
            profileCreate(data, user);
            console.log(data)
        })

    } else {

        const result = fetch(`http://localhost:5000/user?username=${user}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Token " + document.cookie.split('=')[1],
            },

        }).then(data => {

            if (data.status == 400) {
                document.getElementById("alert").innerText = "You are doing a Malformed Request!";
                document.getElementById("popupWindow").style.display = "block";

            } else if (data.status == 404) {
                document.getElementById("alert").innerText = "Page Not Found!";
                document.getElementById("popupWindow").style.display = "block";

            } else if (data.status == 200) {
                return data.json()
            }

        });

        result.then(data => {
            profileCreate(data, user);
            console.log(data)
        });

    }

}

// Create the profile page
function profileCreate(userInfo, user) {

    const profileScreen = document.getElementById('profileScreen');
    profileScreen.style.display = 'block'

    const profile = document.createElement('div');
    profile.className = 'profile';

    const img = document.createElement('img');
    img.className = 'userIcon'
    img.src = "src/userIcon.png";

    const profileBorder = document.createElement('div')
    profileBorder.className = 'profileBorder';

    const userid = document.createElement('p');
    userid.innerText = 'UserId: ' + userInfo['id'];
    userid.insertAdjacentHTML("afterbegin", '&#128681;');

    const userName = document.createElement('p');
    userName.innerText = 'UserName: ' + userInfo['username'];
    userName.insertAdjacentHTML("afterbegin", '&#128125;');

    const userEmail = document.createElement('p');

    if (userInfo['email'] == '') {
        userEmail.innerText = 'Email: none';
        userEmail.insertAdjacentHTML("afterbegin", '&#128233;');
    } else {
        userEmail.innerText = 'Email: ' + userInfo['email'];
        userEmail.insertAdjacentHTML("afterbegin", '&#128233;');
    }

    const userRealName = document.createElement('p');

    if (userInfo['name'] == '') {
        userRealName.innerText = 'Name: none'
        userRealName.insertAdjacentHTML("afterbegin", '&#128129;');
    } else {
        userRealName.innerText = 'Name: ' + userInfo['name'];
        userRealName.insertAdjacentHTML("afterbegin", '&#128129;');
    }

    const followid = document.createElement('p');
    followid.innerText = 'Follow: ' + userInfo['following'].length.toString();
    followid.insertAdjacentHTML("afterbegin", '&#128099;');

    const followerid = document.createElement('p');
    followerid.innerText = 'Follower: ' + userInfo['followed_num'];
    followerid.insertAdjacentHTML("afterbegin", '&#128101;');

    profileBorder.appendChild(userid);
    profileBorder.appendChild(userName);
    profileBorder.appendChild(userEmail);
    profileBorder.appendChild(userRealName);
    profileBorder.appendChild(followid);
    profileBorder.appendChild(followerid);

    profile.appendChild(img);
    profile.appendChild(profileBorder)


    const close = document.createElement('span');
    close.setAttribute('id', 'closeProfile')
    close.insertAdjacentHTML("afterbegin", '&times;');

    close.addEventListener('click', () => {
        profileScreen.style.display = 'none';
        removeAllChildNodes(document.getElementById('profileScreen'));
        removeAllChildNodes(document.getElementById('LoadFeedContainer'));
        loadFeed();
    })

    const newButton = document.createElement('button')
    newButton.className = 'profileButton';

    // if it is my profile, there should be a update info button
    // if it is other's profile, according to the following list, show follow/unfollow button
    myId().then(data =>{

        if (user == 'me' || data['id'] == userInfo['id']) {
            newButton.innerText = 'Update'
            newButton.addEventListener('click', () => {
                profileUpdate();
            })
    
        } else {

            if (data['following'].includes(userInfo['id'])){
                newButton.innerText = 'Unfollow';
                newButton.addEventListener('click', () => {
                    unfollowfriend(userInfo['username']);
                });
            } else {
                newButton.innerText = 'Follow';
                newButton.addEventListener('click', () => {
                    addFriend(userInfo['username']);
                });
            }
            
        }
    }).catch((error) => {
        console.log("Error: ", error);
    });
    

    const followContainer = document.createElement('div');
    followContainer.className = 'FollowContainer';

    const Follow = document.createElement('p');

    if (userInfo['following'].length == 0) {

        Follow.innerText = 'There is no follows.';
        Follow.className = 'boxReminder';
        followContainer.appendChild(Follow);

    } else if (userInfo['following'].length >= 1) {

        for (let i = 0; i < userInfo['following'].length; i++) {

            const name = document.createElement('span');
            name.className = 'boxName';

            givenIdtoUserName(userInfo['following'][i]).then(data => {
                name.innerText = data['username'] + ' ';
                name.insertAdjacentHTML("afterbegin", '&#128116;');
                name.addEventListener('click', () => {
                    removeAllChildNodes(document.getElementById('profileScreen'));
                    removeAllChildNodes(document.getElementById('LoadFeedContainer'));
                    loadProfile(data['username'])
                });
            });

            Follow.appendChild(name);
        }
        const FollowEnd = document.createElement('span');
        FollowEnd.innerText = 'are this user\'\s follows'

        Follow.appendChild(FollowEnd);
    }

    Follow.style.paddingLeft = '20px';
    Follow.style.paddingRight = '20px';

    followContainer.appendChild(Follow);

    const feedContainer = document.createElement("div");
    feedContainer.className = 'FeedContainer';

    userList = userInfo['posts'];

    if (userList.length > 0) {

        for (let i = 0; i < userList.length; i++) {
            givenIdtoPost(userList[i]).then(data => {
                console.log(data)
                postBox = posterCreate(data);
                return postBox;

            }).then((postBox) => {

                // ADD to new button to remove and update the post
                myId().then(res =>{

                    if (user == 'me' || res['id'] == userInfo['id']) {
                        postBox.childNodes[2].childNodes[3].style.width = '80px'
                        postBox.childNodes[2].childNodes[4].style.width = '110px'
                        postBox.childNodes[2].childNodes[4].style.margin = '0'
                        
                        const cardToggle1 = document.createElement("span");
                        cardToggle1.className = 'cardToggle';
                        cardToggle1.insertAdjacentHTML("afterbegin", '&reg;');
                        cardToggle1.style.fontSize = '25px'

                        cardToggle1.addEventListener('click', function () {

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
                            title.innerText = 'Please enter your updated content'
                            outer.appendChild(title);

                            const comment = document.createElement('input');
                            outer.appendChild(comment);

                            const confirm = document.createElement('button');
                            confirm.innerText = 'Save';

                            confirm.addEventListener('click', () => {

                                if (comment.value.length > 0) {
                                    data = {'description_text': comment.value};
                                    updatePost(data, postBox.id);
                                }

                                modal.style.display = 'none'
                                document.getElementsByTagName('main')[0].removeChild(modal);

                            });

                            outer.appendChild(confirm);

                            modal.appendChild(outer);
                            document.getElementsByTagName('main')[0].appendChild(modal);
                        });

                        const cardToggle2 = document.createElement("span");
                        cardToggle2.className = 'cardToggle';
                        cardToggle2.insertAdjacentHTML("afterbegin", '&otimes;');
                        cardToggle2.style.fontSize = '30px'
                        cardToggle2.addEventListener('click', function () {
                            deletePost(postBox.id);
                        });

                        postBox.childNodes[2].appendChild(cardToggle1);
                        postBox.childNodes[2].appendChild(cardToggle2);

                    }
                
                });
                feedContainer.appendChild(postBox);
            });
        }

    } else {
        const noFeed = document.createElement('p')
        noFeed.innerText = 'This user does not have any posts.'
        feedContainer.appendChild(noFeed);
    }


    profileScreen.appendChild(close);
    profileScreen.appendChild(profile);
    profileScreen.appendChild(newButton);
    profileScreen.appendChild(followContainer);
    profileScreen.appendChild(feedContainer);

}

// postcard create function
function posterCreate(allInfo) {

    const postBox = document.createElement("div");
    postBox.className = 'feedCard';
    postBox.setAttribute('id', allInfo['id']);

    const cardTitle = document.createElement("div");
    cardTitle.className = 'cardTitle';

    const cardAuthor = document.createElement("p");
    cardAuthor.innerText = allInfo['meta']['author'];
    cardAuthor.className = 'cardAuthor';
    cardAuthor.addEventListener('click', () => {
        removeAllChildNodes(document.getElementById('profileScreen'));
        document.getElementById('feedScreen').style.display = 'none'
        removeAllChildNodes(document.getElementById('LoadFeedContainer'));
        loadProfile(allInfo['meta']['author'])
    });

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

    myId().then(data => {

        if (allInfo['meta']['likes'].includes(data['id'])) {

            LikeButton.innerText = ' ' + 'Unlike';
            LikeButton.insertAdjacentHTML("afterbegin", '&#128077;');
            LikeButton.style.backgroundColor = 'red';
            LikeButton.style.color = 'white'

            LikeButton.addEventListener('click', UnlikePost.bind(this, allInfo['id']), { once: true });

        } else {

            LikeButton.innerText = ' ' + 'Like';
            LikeButton.insertAdjacentHTML("afterbegin", '&#128077;');
            LikeButton.style.backgroundColor = 'white';
            LikeButton.style.color = 'red'

            LikeButton.addEventListener('click', likePost.bind(this, allInfo['id']), { once: true });

        }
    }).catch((error) => {
        console.log("Error: ", error);
    });

    CommentButton.innerText = ' ' + 'Comment';
    CommentButton.insertAdjacentHTML("afterbegin", '&#128172;');

    CommentButton.addEventListener('click', () => {
        makeComment(allInfo['id']);
    });

    const cardLikeNum = document.createElement("div");
    const cardCommentNum = document.createElement("div");
    const cardToggle = document.createElement("span");
    cardLikeNum.className = 'cardLikeNum';
    cardLikeNum.innerText = "Like: " + allInfo['meta']['likes'].length;
    cardCommentNum.className = 'cardCommentNum';
    cardCommentNum.innerText = "Comment: " + allInfo['comments'].length;
    cardToggle.className = 'cardToggle';
    cardToggle.insertAdjacentHTML("afterbegin", '&equiv;');
    cardToggle.addEventListener('click', function () {
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

    return postBox;

}

// Update the profile modal
function profileUpdate() {

    const modal = document.createElement("div");
    modal.className = 'opacityWindow';
    modal.setAttribute('id', 'updateScreen');

    const outer = document.createElement('div');
    outer.className = 'likeAndComment';

    const close = document.createElement('span');
    close.insertAdjacentHTML("afterbegin", '&times;');
    close.setAttribute('id', 'closeUpdate');

    close.addEventListener('click', () => {
        modal.style.display = 'none'
        document.getElementsByTagName('main')[0].removeChild(modal);
    });

    outer.appendChild(close);

    const title = document.createElement('p');
    title.innerText = 'Please enter the update information, do not enter anything if no change.'
    outer.appendChild(title);
    const EmailTag = document.createElement('p');
    EmailTag.innerText = 'Update Email';
    const updateEmail = document.createElement('input');

    const PasswordTag = document.createElement('p');
    PasswordTag.innerText = 'Update Password'
    const updatePassword = document.createElement('input');

    const NameTag = document.createElement('p');
    NameTag.innerText = 'Update Name'
    const updateName = document.createElement('input');

    outer.appendChild(EmailTag);
    outer.appendChild(updateEmail);
    outer.appendChild(PasswordTag);
    outer.appendChild(updatePassword);
    outer.appendChild(NameTag);
    outer.appendChild(updateName);

    const confirm = document.createElement('button');
    confirm.innerText = 'Save';

    confirm.addEventListener('click', () => {

        if (updateEmail.value.length == 0 && updateName.value.length == 0 && updatePassword.value.length == 0) {
            modal.style.display = 'none'
            document.getElementsByTagName('main')[0].removeChild(modal);

        } else {

            let data = {};

            if (updateEmail.value.length != 0) {
                data['email'] = updateEmail.value;
            }

            if (updateName.value.length != 0) {
                data['name'] = updateName.value;
            }

            if (updatePassword.value.length != 0) {
                data['password'] = updatePassword.value;
            }

            console.log(data);

            fetch(`http://localhost:5000/user`, {
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
                }
            }).catch((error) => {
                console.log("Error: ", error);
            });

            modal.style.display = 'none'
            document.getElementsByTagName('main')[0].removeChild(modal);
    
            removeAllChildNodes(document.getElementById('profileScreen'));
            loadProfile('me');
        }


    });

    outer.appendChild(confirm);

    modal.appendChild(outer);
    document.getElementsByTagName('main')[0].appendChild(modal);
}

// Given a user id, fetch /user, return the response data
function givenIdtoUserName(id) {

    return fetch(`http://localhost:5000/user/?id=${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Token " + document.cookie.split('=')[1],
        },

    }).then(data => {

        if (data.status == 400) {
            document.getElementById("alert").innerText = "You are doing a Malformed Request!";
            document.getElementById("popupWindow").style.display = "block";

        } else if (data.status == 404) {
            document.getElementById("alert").innerText = "Page Not Found!";
            document.getElementById("popupWindow").style.display = "block";

        } else if (data.status == 200) {
            return data.json()
        }

    }).catch((error) => {
        console.log("Error: ", error);
    });

}

// Given a post id, fetch /post, return the response data
function givenIdtoPost(id) {

    return fetch(`http://localhost:5000/post/?id=${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Token " + document.cookie.split('=')[1],
        },

    }).then(data => {

        if (data.status == 400) {
            document.getElementById("alert").innerText = "You are doing a Malformed Request!";
            document.getElementById("popupWindow").style.display = "block";

        } else if (data.status == 404) {
            document.getElementById("alert").innerText = "Page Not Found!";
            document.getElementById("popupWindow").style.display = "block";

        } else if (data.status == 200) {
            return data.json()
        }

    }).catch((error) => {
        console.log("Error: ", error);
    });

}

// fetch /user, return the my info
function myId() {

    return fetch(`http://localhost:5000/user/`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Token " + document.cookie.split('=')[1],
        },

    }).then(data => {

        if (data.status == 400) {
            document.getElementById("alert").innerText = "You are doing a Malformed Request!";
            document.getElementById("popupWindow").style.display = "block";

        } else if (data.status == 404) {
            document.getElementById("alert").innerText = "Page Not Found!";
            document.getElementById("popupWindow").style.display = "block";

        } else if (data.status == 200) {
            return data.json()
        }

    }).catch((error) => {
        console.log("Error: ", error);
    });

}

// given a timestamp return the format in day/month/year hour:minute:second
function timeTranslation(timeStamp) {

    let time = new Date(timeStamp * 1000);

    let year = time.getFullYear();
    let month = '0' + (time.getMonth() + 1).toString();
    let day = '0' + time.getDate();
    let hour = '0' + time.getHours();
    let minute = '0' + time.getMinutes();
    let second = '0' + time.getSeconds();
    let fomattedTime = `${day.substr(-2)}/${month.substr(-2)}/${year} ${hour.substr(-2)}:${minute.substr(-2)}:${second.substr(-2)}`;
    return fomattedTime;

}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}