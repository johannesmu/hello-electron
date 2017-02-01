var app = {
  currentuser:0,
  userstatus:0,
  userdata:"",
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
      app.userid = user.uid;
      app.user = user;
      changeNavigationStatus();
      toggleOverlayVisibility('hide');
      //populate user data
      readUserData(user.uid);
    }
    else{
      //user is logged out
      changeNavigationStatus();
      //show the login form
      toggleOverlayVisibility('show');
      destroyUserData();
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
  if(app.user){
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

//authentication form
var rotator = document.getElementById('form-header');
rotator.addEventListener("click",handleClick);

function handleClick(e){
  e.preventDefault();
  //list of children
  var listitems = rotator.children;
  var len = listitems.length;
  for(i=0;i<len;i++){
    listitems[i].classList.remove("active");
  }
  var link = e.target;
  link.parentElement.classList.add("active");
  //get forms
  changeForms(link.href);
}

function changeForms(link){
  //get forms
  var forms = document.getElementsByClassName('form');
  //number of forms
  var len = forms.length;
  for(i=0;i<len;i++){
    forms[i].classList.remove('active');
  }
  linkname = link.substring(link.indexOf("#")+1);
  document.getElementById(linkname).classList.add('active');
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
  }
  if(status=='hide'){
    document.getElementById('overlay').style.visibility='hidden';
  }
}
function getChatInput(e){
  e.preventDefault();
}
function getFormData(e){
  e.preventDefault();
  //get id from target
  var id = e.target.id;
  //reset the form
  //get data from the form
  var formData = new FormData(document.getElementById(id));
  e.target.reset();
  //check which form has been submitted
  if(id=='signup-form'){
    //pass form email and password to signUpUser()
    username = formData.get('username');
    var img = generateProfileImage(username);
    signUpUser(formData.get('email'),formData.get('password'),username,img);
  }
  if(id=='login-form'){
    //pass form email and password to signInUser()
    signInUser(formData.get('email'),formData.get('password'));
  }
}
//sign up user
function signUpUser(email,password,username,userimage){
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(function(user){
    app.userid = user.uid;
    writeUserData(app.userid, username, user.email, userimage);
  })
  .catch(function(error) {
  // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(error);
  });
  
}
//sign user in
function signInUser(email,password){
  firebase.auth().signInWithEmailAndPassword(email, password)
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    //console.log(error);
    // use the uid to write to database
  });
}
function signOutUser(){
  firebase.auth().signOut().then(function() {
  // Sign-out successful
  //set app.user property to null
  destroyUserData();
  showUserData();
  changeNavigationStatus();
  toggleOverlayVisibility('show');
  }, function(error) {
    // An error happened.
    console.log(error);
  });
}
//destroy user data from app object
function destroyUserData(){
  app.user='';
  app.userdata='';
  app.userstatus = 0;
  //remove user data elements
  document.getElementById('username').innerHTML='';
  document.getElementById('userimage').innerHTML='';
}

//write user data to users branch
function writeUserData(userId, name, email, imageData,date) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageData,
    created:created
  })
  .then(function(result){console.log(result)});
}
//read user data
function readUserData(id){
  firebase.database().ref('/users/' + id).once('value')
  .then(function(snapshot){
    var username = snapshot.val().username;
    var profile_image = snapshot.val().profile_picture;
    var authuser = {name:username,image:profile_image};
    app.userdata = authuser;
    showUserData();
  })
  .catch(function(error){
    console.log(error);
  });
}
function showUserData(){
  var img = document.getElementById('userimage');
  var name = document.getElementById('username');
    //create user image element
    var userimg = document.createElement('IMG');
    userimg.setAttribute('src',app.userdata.image);
    userimg.setAttribute('id','profileimage');
    img.appendChild(userimg);
    var username = document.createTextNode('Hello '+app.userdata.name);
    name.appendChild(username);
}
//generate a simple profile image from username's first letter
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
  //delete the canvas
  var elem = document.getElementsByTagName('canvas');
  if(elem.length){
    elem[0].remove();
  }
  //return the image data as dataurl
  return imagedata;
}

