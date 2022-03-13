//initialize firebase
const config = {
	apiKey: "AIzaSyCG5by6yatRfG5Bae7J5NS8ZXaCvSlKaDM",
	authDomain: "legalrelief-lawyer.firebaseapp.com",
	databaseURL: "https://legalrelief-lawyer-default-rtdb.firebaseio.com/",
	projectId: "legalrelief-lawyer",
	storageBucket: "legalrelief-lawyer.appspot.com",
	messagingSenderId: "55759515991",
	appId: "1:55759515991:web:16e5a1d55a4093b44bce12",
	measurementId: "G-0MC6CVWQL8"
  };
  firebase.initializeApp(config);

//initialize firebase references
var storageRef= firebase.storage().ref();  
var ref=firebase.database().ref();
const db = firebase.firestore();
var auth=firebase.auth();
var user = auth.currentUser;
var name, email, photoUrl, uID, emailVerified;
	
//VERY VERY BAD CODE, needs to be merged into signup and login functions
 firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
	
	uID = user.uid;
	//have the logged in section appear if the user's logged in
    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";
	
	//we have to check if the user's null in case the user immediately logs out after signing in 
	if (user!=null){
			var email=user.email;
			document.getElementById("user_para").innerHTML = "Welcome user, you are now logged in as: " + email;
	}

  } else {
    // No user is signed in.
	console.log("signed out");
	//go back to the login page after completion
    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";
  }
});

btnsignup.addEventListener("click",e =>
{
	var email=getInputVal("email_field");
	var pass=getInputVal("password_field");

	var name=getInputVal("name_field");
	
	const signup=auth.createUserWithEmailAndPassword(email,pass);
	signup.catch(e=>window.alert(e.message));
	
	user= auth.currentUser;
	
	firebase.auth().onAuthStateChanged(function(user) {
		if (user){
			uID=auth.currentUser.uid;
			console.log(uID);
			db.collection("Lawyers").doc(uID).set({
				name: name,
				state: null,
				city: null,
				field: null,
				experience: null
			})
		}else{
			//User's Null
		}
	});
});

btnFormSub.addEventListener('click',e=>
{
	e.preventDefault();
	//get values
	console.log("Pressed");
	var name=getInputVal("name");
	var state=getInputVal("state");
	var city = getInputVal("city");
	var field = getInputVal("company");
	var experience = getInputVal("exp");
		
	uID= auth.currentUser.uid;
		
	//ENABLE BELOW TO SEND USERDATA TO FIREBASE
	db.collection("Lawyers").doc(uID).set({
		name: name,
        state: state,
        city: city,
		field: field,
		experience: experience
    }).then(() => {
        console.log("Successfully created lawyer document");
    }).catch(error => {
        console.error("Error adding lawyer document: ", error);
    });

	// show alert
	document.querySelector(".alert").style.display = "block";
	//hide alert after 3 seconds

	setTimeout(function()
	{
		document.querySelector(".alert").style.display = "none";	
	}, 3000);
	document.getElementById("contactForm").reset();
});

// function to get form values
function getInputVal(id)
{
	return document.getElementById(id).value;
}

function login()
{
	var userEmail = document.getElementById("email_field").value;
	var userPass = document.getElementById("password_field").value;
	
	const auth=firebase.auth();
	const promise= auth.signInWithEmailAndPassword(userEmail,userPass);
	promise.catch(e => window.alert(e.message));
}

function logout()
{
	firebase.auth().signOut();
}

$('#password, #confirm_password').on('keyup', function () {
  if ($('#password').val() == $('#confirm_password').val()) {
    $('#message').html('Matching').css('color', 'green');
  } else 
    $('#message').html('Not Matching').css('color', 'red');
});

function populateLawyerInfo()
{
  auth.onAuthStateChanged(function(user){
      if (user){
        uID=user.uid;
		console.log(uID)
		const lawyerQuery = db.collection('Lawyers').doc(uID)
		lawyerQuery.get().then((doc) => {
			console.log(doc.id);
			document.getElementById('name').value = doc.data()['name']
			document.getElementById('company').value = doc.data()['field']
			document.getElementById('state').value = doc.data()['state']
			document.getElementById('city').value = doc.data()['city']
		});
    }
    else{
      //user null
    }
  });
}

function populateActiveCases()
{
  auth.onAuthStateChanged(function(user){
      if (user){
        uID=user.uid;
		db.collection('active_cases').get().then((querySnapshot) => {
			all_cases = "<h1 class=\"brand\"><span>Legal Relief</span></h1>"
			querySnapshot.forEach((doc) => {
				console.log(doc.id, " => ", doc.data());
				case_desc = doc.data()['desc']
				case_status = doc.data()['status']
				case_funding = doc.data()['funding']
				all_cases = all_cases + "<h5>Desc: "+ case_desc + ",  Status: " + case_status + ",  Funding: $" + case_funding + "</h5>"
			});
			document.getElementById('active_cases_div').innerHTML = all_cases
		});
    }
    else{
      //user null
    }
  });
}

function populateAcceptedCases()
{
  auth.onAuthStateChanged(function(user){
      if (user){
        uID=user.uid;
		const acceptedQuery = db.collection('accepted_cases').where("userId", "==", uID)
		acceptedQuery.get().then((querySnapshot) => {
			all_cases = "<h1 class=\"brand\"><span>Legal Relief</span></h1>"
			querySnapshot.forEach((doc) => {
				console.log(doc.id, " => ", doc.data());
				data = db.collection('active_cases').doc(doc.data()['caseId']).get().then((doc) => {
					case_desc = doc.data()['desc']
					case_status = doc.data()['status']
					case_funding = doc.data()['funding']
					all_cases = all_cases + "<h5>Desc: "+ case_desc + ",  Status: " + case_status + ",  Funding: $" + case_funding + "</h5>"
					document.getElementById('accepted_cases_div').innerHTML = all_cases
				})

			});
		});
    }
    else{
      //user null
    }
  });
}
