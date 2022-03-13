// Initialize Firebase
  var config = {
    apiKey: "AIzaSyACjaBsosNRp0FtyXwd1bchNBObYkXbyfA",
    authDomain: "pay-it-forward-204215.firebaseapp.com",
    databaseURL: "https://pay-it-forward-204215.firebaseio.com",
    projectId: "pay-it-forward-204215",
    storageBucket: "pay-it-forward-204215.appspot.com",
    messagingSenderId: "213594224449"
  };
  firebase.initializeApp(config);

var auth=firebase.auth();
var user= auth.currentUser;
var name, email, photoUrl, uID, emailVerified;
var ref=firebase.database().ref();

var fname;
var lname;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";

	user.sendEmailVerification().then(function() {
		  // Email sent.
		}).catch(function(error) {
		  // An error happened.
		});

    if (user!=null){
		email = user.email;
		//console.log(uID);	console.log(name); console.log(emailVerified);
    	document.getElementById("user_para").innerHTML = "Welcome user, you are now logged in as: " + email;
	}
	//ENABLE BELOW TO SEND USERDATA TO FIREBASE
  } else {
    // No user is signed in.

    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";
  }
});

function login()
{
	var userEmail = document.getElementById("email_field").value;
	var userPass = document.getElementById("password_field").value;

	firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) 
	{
  		// Handle Errors here.
  		var errorCode = error.code;
  		console.log(errorCode);
  		var errorMessage = error.message;

 		 window.alert("Error : " + errorMessage);
  		// ...
	});
}

function logout()
{
	firebase.auth().signOut();
}

$('#password_field, #confirm_password').on('keyup', function () {
  if ($('#password_field').val() == $('#confirm_password').val()) {
    $('#message').html('Matching').css('color', 'green');
  } else 
    $('#message').html('Not Matching').css('color', 'red');
});

	

btnsignup.addEventListener("click",e =>
{
	var email=getInput("email_field");
	var pass=getInput("password_field");

	fname=getInput("fname_field");
	lname=getInput("lname_field");
	console.log(fname,lname);
	
	const signup=auth.createUserWithEmailAndPassword(email,pass);
	signup.catch(e=>window.alert(e.message));
	
	user= auth.currentUser;
	
	firebase.auth().onAuthStateChanged(function(user) {
		if (user){
			uID=auth.currentUser.uid;
			console.log(uID);
			var userdata = ref.child('users/'+uID);	
			userdata.set({
				firstname: fname,
				lastname: lname
		});
		}else{
			//User's Null
		}
	});
});

function getInput(id)
{
	return document.getElementById(id).value;
}