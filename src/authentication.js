
// Pop Up window “X” setting
document.getElementById("close").addEventListener('click', () => {
    document.getElementById("popupWindow").style.display = "none"        
    document.getElementById("addFriend").style.display = "none";
    document.getElementById("popupInput").value = "";
    document.getElementById("popupConfirm").removeEventListener('click', addFriend);
})

// Login Button Setting
document.getElementById('loginButton').addEventListener('click', () => {
    
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let passwordconfirm = document.getElementById("passwordconfirm").value;

    // password and passwordconfirm must be same
    if (password != passwordconfirm) {
        document.getElementById("alert").innerText = "The password did not match the re-typed password! Please try again!";
        document.getElementById("popupWindow").style.display = "block";
    
    } else {
        const data = {"username": username, "password": password};
        const result = fetch('http://localhost:5000/auth/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        
        }).then((data) => {
    
            if (data.status == 403) {

                document.getElementById("alert").innerText = "Incorrect details!";
                document.getElementById("popupWindow").style.display = "block";
            

            } else if (data.status == 200) {
                data.json().then(result => {
                    document.cookie = 'token=' + result.token + '';
                    document.getElementById("loginScreen").style.display = "none";
                    removeAllChildNodes(document.getElementById('LoadFeedContainer'));
                    loadFeed();
                    document.getElementById("authorInfo").style.display = "none";
                    document.getElementById("sidebarButton").style.display = "block";
                });

            }

            console.log(data);
        }).catch((error) => {
            console.log("Error: ", error);
        });
    }

});

// SignUp Button Setting
document.getElementById('signupButton').addEventListener('click', () => {
    
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("signupScreen").style.display = "block";

});

// Back to Sign In Setting
document.getElementById('underlineSignIn').addEventListener('click', () => {
    
    document.getElementById("signupScreen").style.display = "none";
    document.getElementById("loginScreen").style.display = "block";

});

// Create Account Button Setting
document.getElementById('createAccount').addEventListener('click', () => {
    
    let username = document.getElementById("username-signup").value;
    let password = document.getElementById("password-signup").value;
    let passwordconfirm = document.getElementById("passwordconfirm-signup").value;
    let email = document.getElementById("email-signup").value;
    let name = document.getElementById("name-signup").value;

    // password and passwordconfirm must be same
    if (password != passwordconfirm) {
        document.getElementById("alert").innerText = "The password did not match the re-typed password! Please try again!";
        document.getElementById("popupWindow").style.display = "block";
    
    } else {
        const data = {"username": username, "password": password, "email": email, "name": name};
        const result = fetch('http://localhost:5000/auth/signup', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        
        }).then((data) => {
    
            if (data.status == 400) {
                document.getElementById("alert").innerText = "Missing Username/Password!";
                document.getElementById("popupWindow").style.display = "block";

            } else if (data.status == 409) {
                document.getElementById("alert").innerText = 'Username has been taken!';
                document.getElementById("popupWindow").style.display = "block";
            
            } else if (data.status == 200) {
                data.json().then(result => {
                    document.cookie = 'token=' + result.token + '';
                    document.getElementById("signupScreen").style.display = "none";
                    removeAllChildNodes(document.getElementById('LoadFeedContainer'));
                    loadFeed();
                    document.getElementById("authorInfo").style.display = "none";
                    document.getElementById("sidebarButton").style.display = "block";
                });
            }

            console.log(data);

        }).catch((error) => {
            console.log("Error: ", error);
        });
    }

});

// Log Out Button Setting
document.getElementById('LogOut').addEventListener('click', () => {

    document.getElementById('feedScreen').style.display = 'none';
    document.getElementById('profileScreen').style.display = 'none';
    document.getElementById('sidebarWindow').style.display = 'none';
    document.getElementById("authorInfo").style.display = "block";
    document.getElementById("sidebarButton").style.display = "none";
    removeAllChildNodes(document.getElementById('profileScreen'));
    removeAllChildNodes(document.getElementById('LoadFeedContainer'));
    document.getElementById('LoadFeed').style.display = 'none';
    document.getElementById('NoFeed').style.display = 'none';
    document.getElementById('FeedCheck').style.display = 'none';

    document.cookie = 'token=;';
    document.getElementById("loginScreen").style.display = "block";

});