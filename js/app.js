window.addEventListener('load',function(){
  //add firebase auth observer
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(user);
      toggleOverlayVisibility('hide');
    }
    else{
      //hide the logout button
      document.getElementById('logout').style.display='none';
      //show the login form
      toggleOverlayVisibility('show');
    }
  });
  document.getElementById('signup-link').addEventListener('click',showForm);
  document.getElementById('login-link').addEventListener('click',showForm);
});
function showForm(evt){
  var id = evt.target.id;
  console.log(id);
  if(id=='signup-link'){
    document.getElementById('signup').style.visibility='hidden';
    document.getElementById('login').style.visibility='visible';
  }
  if(id=='login-link'){
    document.getElementById('login').style.visibility='visible';
    document.getElementById('signup').style.visibility='hidden';
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
