app = {
  userstatus:0,
  userid:"",
  database:firebase.database()
}
//things to do when window loads
window.addEventListener('load',function(){
  //add firebase auth observer
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      //user is logged in
      //set the global user status to 1 (logged in)
      app.userstatus = 1;
      app.userid = user.uid;
      changeNavigationStatus();
      toggleOverlayVisibility('hide');
      //hide menu items
    }
    else{
      //user is logged out
      app.userstatus = 0;
      changeNavigationStatus();
      //show the login form
      toggleOverlayVisibility('show');
    }
  });

  //listeners for form switcher
  document.getElementById('signup-link').addEventListener('click',showForm);
  document.getElementById('login-link').addEventListener('click',showForm);
  //sign up user
  document.getElementById('signup-form').addEventListener('submit',getData);
  document.getElementById('login-form').addEventListener('submit',getData);
  //add listeners to main navigation functions
  //--logout
  document.getElementById('user-logout').addEventListener('click',signOutUser);
});
//navigation controller
function changeNavigationStatus(){
  if(app.userstatus == 1){
    //hide signup and login
    document.getElementById('user-signup').style.display = 'none';
    document.getElementById('user-login').style.display = 'none';
    //show logout and profile
    document.getElementById('user-logout').style.display = 'flex';
    document.getElementById('user-profile').style.display = 'flex';
  }
  else{
    //show signup and login
    document.getElementById('user-signup').style.display = 'flex';
    document.getElementById('user-login').style.display = 'flex';
    //hide logout and profile
    document.getElementById('user-logout').style.display = 'none';
    document.getElementById('user-profile').style.display = 'none';
  }
}

function showForm(evt){
  evt.preventDefault();
  var id = evt.target.id;
  if(id==='signup-link'){
    var hideelm = document.getElementById('login');
    hideelm.style.visibility='hidden';
    hideelm.style.height=0;
    var showelm = document.getElementById('signup');
    showelm.style.visibility='visible';
    showelm.style.height='auto';
  }
  if(id==='login-link'){
    var hideelm = document.getElementById('signup');
    hideelm.style.visibility='hidden';
    hideelm.style.height=0;
    var showelm = document.getElementById('login');
    showelm.style.visibility='visible';
    showelm.style.height='auto';
  }
}

function toggleOverlayVisibility(status){
  if(status=='show'){
    document.getElementById('overlay').style.visibility='visible';
    document.getElementById('login').style.visibility = 'visible';
    document.getElementById('signup').style.visibility = 'hidden';
  }
  if(status=='hide'){
    document.getElementById('overlay').style.visibility='hidden';
    document.getElementById('login').style.visibility = 'hidden';
    document.getElementById('signup').style.visibility = 'hidden';
  }
}
function getData(e){
  e.preventDefault();
  //get id from target
  var id = e.target.id;
  //get data from the form
  var formData = new FormData(document.getElementById(id));
  //check which form has been submitted
  if(id=='signup-form'){
    //pass form email and password to signUpUser()
    signUpUser(formData.get('email'),formData.get('password'));
  }
  if(id=='login-form'){
    //pass form email and password to signInUser()
    signInUser(formData.get('email'),formData.get('password'));
  }
}

function signUpUser(email,password){
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .catch(function(error) {
  // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(error);
  });
}
function signInUser(email,password){
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(error);
    // use the uid to write to database
  });
}
function signOutUser(){
  firebase.auth().signOut().then(function() {
  // Sign-out successful
    toggleOverlayVisibility('show');
  }, function(error) {
    // An error happened.
  });
}

function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}

function checkUserName(){
  //find duplicates in the database
}
