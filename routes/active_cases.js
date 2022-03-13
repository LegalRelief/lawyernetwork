const { Router } = require('express');

const router = Router();

fbApp = require('../secrets/legalrelief-lawyer')

//firebase dependencies
const firebase = require("firebase");
require("firebase/firestore");
const db = firebase.firestore();

////////////////////////
/////////ACTIVE/////////
////////////////////////

router.get('/', (request, response, next) => {
  console.log("/active GET request received");
  const { id } = request.params;
  var ref = db.collection('active_cases');

  res_data = {}

  ref.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            res_data[doc.id] = doc.data();
        });
        response.send(res_data);
    });
});

router.get('/:id', (request, response, next) => {
  console.log("/active:id GET request received");
  const { id } = request.params;
  var ref = db.collection('active_cases').doc(id);

  var getDoc = ref.get().then(doc => {
    // if doc doesn't exist
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        // otherwise log the data
        console.log(doc.data());
        response.send(doc.data());
      }
    })
    //log any errors
    .catch(err => {
      console.log('Error getting document', err);
  });
});

router.post('/', (request, response, next) => {
  console.log("/active:doc POST request received");
  const inputs = request.body;
  console.log(inputs);

  var ref = db.collection('active_cases').doc();
  ref.set(inputs).then(function() {
      response.send("Document successfully written with id="+ref.id);
    });
});

router.delete('/:id', (request, response, next) => {
  console.log("/active:doc DELETE request received");
  var { id } = request.params;
  console.log(id);

  var ref = db.collection('active_cases').doc(id);
  ref.delete().then(function() {
      response.send("Document successfully deleted with id="+ref.id);
    });
});

module.exports = router;
