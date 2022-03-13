//initialize firebase
  var config = {
    apiKey: "AIzaSyACjaBsosNRp0FtyXwd1bchNBObYkXbyfA",
    authDomain: "pay-it-forward-204215.firebaseapp.com",
    databaseURL: "https://pay-it-forward-204215.firebaseio.com",
    projectId: "pay-it-forward-204215",
    storageBucket: "pay-it-forward-204215.appspot.com",
    messagingSenderId: "213594224449"
  };
  firebase.initializeApp(config);
//basic authorization initializations
  var auth=firebase.auth();
  var user= auth.currentUser;
  var name, email, photoUrl, uID, emailVerified;
  var ref=firebase.database().ref();


function login()
{
  //take in user input by the field where they enter the email and pw
  var email = document.getElementById("email_field").value;
  var pass = document.getElementById("password_field").value;
  
  //begin initialization, i did this again because of paranoia
  auth=firebase.auth();
  //sign in
  const login= auth.signInWithEmailAndPassword(email,pass);
  //console.log("mans signed in");
  //window alert any errors that arise
  login.catch(e => window.alert(e.message));
}

function signup()
{
  //get parameters from field inputs
  var email=document.getElementById("email_field").value;
  var pass=document.getElementById("password_field").value;

  fname=document.getElementById("fname_field").value;
  lname=document.getElementById("lname_field").value;
  //console.log(fname,lname);
  
  auth=firebase.auth();
  //signup
  const signup=auth.createUserWithEmailAndPassword(email,pass);
  //catch any erros
  signup.catch(e=>window.alert(e.message));
  
  //get current user info, this is used in order to store their first and last name for future use
  user= auth.currentUser;
  firebase.auth().onAuthStateChanged(function(user) {
   //if the current user is valid,
    if (user){
      //get current user's user id
      uID=auth.currentUser.uid;
      //console.log(uID);
      //reference for where to store the user's user id on firebase realtime storage
      var userdata = ref.child('users/'+uID); 
      userdata.set({
        //store the user's name in firebase using the userdata reference
        firstname: fname,
        lastname: lname
    });
    }else{
      //User's Null, no error checks in place right now
    }
  });
}

function populateActiveCases()
{
  auth.onAuthStateChanged(function(user){
      if (user){
        uID=user.uid;
      // return ref.child("/users/"+uID).once("value").then(function(snapshot) {
      //   var fname= (snapshot.val() && snapshot.val().firstname);
      //   var lname= (snapshot.val() && snapshot.val().lastname);
      //   var fullname=fname+" "+lname;
      //   //console.log(fname, lname, fullname);
      //   var nameplace1=document.getElementById("title1");
      //   var nameplace2=document.getElementById("title2");

      //   nameplace1.innerHTML=fullname;
      //   nameplace2.innerHTML=fullname;
      // });
      fetch('localhost:3000/active').then(response =>{
          return response.json();
      }).then(data =>{
          console.log(data);
      })
    }
    else{
      //user null
    }
  });
}

// function to get form values
function getInputVal(id)
{
  return document.getElementById(id).value;
}

function searchUsers() 
{
    //define the database
    const database = firebase.database();
    const ref = database.ref('users').orderByChild('lastname');
    $("#namelist").empty();
    //check the reference's value, then take a snapshot to see what's at that reference at that point in time
    ref.once("value").then(function(snapshot){
      //for each user id that is in the database, take a child snapshot for each userid
      snapshot.forEach(function(childSnapshot) {
        //get the user's userid from there
        //this is the user we're trading to whose user id we pull
        var key = childSnapshot.key;
        //get all the data stored under that userid
        var childData = childSnapshot.val();

        //get the user's name from the data under their id
        var fname=childData.firstname;
        var lname=childData.lastname;

        var cost=getInputVal('tokencost');

        //Im so sorry for those of you coming next for having to read this
        //add a row to the namelist for each user id, consisting of their name and a test link to go to google
        //essentially, I used jquery to add an item to a list, and the append function allows me to essentially write HTML using
        //Javascript, so I write the code for a button that when clicked, will call the tradeTokens function to trade 10
        //tokens between the user currently logged in, and the user who's identified by their key.
        //I bolded the name just out of adding more confusion
        //the backslashes are there as escape characters for the quotes that need to surround the userids since they're passed in as strings
        //The success function is there to tell the user that the payment was functional
        
        $("#namelist").append("<b>"+fname+" "+lname+"</b>"+"  "+
          "<button onclick=\"tradeTokens("+cost+",\'"+uID+"\',\'"+key+"\'); success(); \">Press this to transfer "+cost+" tokens </button><br>");
    });
  });
}

//filler function for payment success.
function success()
{
  window.alert("Payment Successful!");
}

//Trade Tokens function
function tradeTokens(amountTraded, uid1, uid2)
{
    //define references for the users to trade tokens with
    const database = firebase.database();
    const user1 = database.ref('users/'+uid1);
    const user2 = database.ref('users/'+uid2);

    //initialize the tokens variable for each user
    var tokens1;
    var tokens2;

    //check the value of each user and take a snapshot of it
    user1.once('value').then(function (snapshot)
    {
        //get the current amount of tokens the user has
        tokens1=snapshot.child('tokens').val();
        //compare this console log to the tokens corresponding to that account to confirm if a trade occured
        console.log(tokens1);
        //deduct the amount of tokens to the balance as dictated in the amountTraded variable
        //we deduct because user1 pays user2
        tokens1-=amountTraded;
        
        //update the user's token count
        user1.child('tokens').set(tokens1);
    });

    //same as above for user2
    user2.once('value').then(function (snapshot)
    {
        tokens2=snapshot.child('tokens').val();
        console.log(tokens2);
        tokens2+=amountTraded;
        
        user2.child('tokens').set(tokens2);
    });
}