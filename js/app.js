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

  //sign up user
  document.getElementById('signup-form').addEventListener('submit',getFormData);
  document.getElementById('login-form').addEventListener('submit',getFormData);
  document.getElementById('chat-form').addEventListener('submit',getChatInput);
  //add listeners to main navigation functions
  //--logout
  document.getElementById('user-logout').addEventListener('click',signOutUser);
});
//navigation controller
function changeNavigationStatus(){
  if(app.userstatus == 1){
      //show logout and profile
    document.getElementById('user-logout').style.display = 'flex';
    document.getElementById('user-profile').style.display = 'flex';
  }
  else{
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
function getChatInput(e){
  e.preventDefault();
}
function getFormData(e){
  e.preventDefault();
  //get id from target
  console.log(e);
  var id = e.target.id;
  //get data from the form
  var formData = new FormData(document.getElementById(id));
  //check which form has been submitted
  if(id=='signup-form'){
    //pass form email and password to signUpUser()
    signUpUser(formData.get('email'),formData.get('password'));
    var username = formData.get('username');
    //generate image
    var img = generateProfileImage(username);
    //write user to database
    console.log(app.userid);
    //writeUserData(userId, name, email, imageData);
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
    //write users
  });
  var user = firebase.auth().currentUser;
  console.log(user);
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

function writeUserData(userId, name, email, imageData) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageData
  });
}

function generateProfileImage(username){
  var letter = username.charAt(0);
  canvas = document.createElement('CANVAS');
  var context = canvas.getContext('2d');
  context.canvas.width = 100;
  context.canvas.height = 100;
  context.beginPath();
  context.arc(50,50,50,0,2*Math.PI);
  //create random color using hsv
  var rnum = Math.random()*360;
  var rcol = 'hsl('+rnum+',50%,70%)';
  context.fillStyle = rcol;
  context.fill();
  context.font = "80px arial";
  context.fillStyle = "white";
  context.textAlign = 'center';
  context.fillText(letter,50,75);
  imagedata = context.canvas.toDataURL();
  return imagedata;
}

function checkUserName(){
  //find duplicates in the database
}