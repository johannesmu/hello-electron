window.addEventListener('load',function(){
  //add firebase auth observer
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      //user is logged in
      //hide the overlay
      toggleOverlayVisibility('hide');
      //hide menu items
      document.getElementById('user-login').style.display='none';
      document.getElementById('user-signup').style.display='none';
      document.getElementById('user-profile').style.display='flex';
      document.getElementById('user-logout').style.display='flex';
    }
    else{
      //user is logged out
      //hide the logout button
      document.getElementById('user-logout').style.display='none';
      document.getElementById('user-profile').style.display='none';
      //show the sign up and login button
      document.getElementById('user-signup').style.display='flex';
      document.getElementById('user-login').style.display='flex';
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
  var id = e.target.id;
  var formData = new FormData(document.getElementById(id));
  if(id=='signup-form'){
    signUpUser(formData.get('email'),formData.get('password'));
  }
  if(id=='login-form'){
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
    // ...
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
