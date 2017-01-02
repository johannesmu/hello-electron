firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log(user);
  } else {
    //hide the logout button
    document.getElementById('logout').style.display='none';
  }
});

showLoginForm(){
  
}
