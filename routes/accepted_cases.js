const { Router } = require('express');

const router = Router();

fbApp = require('../secrets/legalrelief-lawyer')

//firebase dependencies
const firebase = require("firebase");
require("firebase/firestore");
const db = firebase.firestore();

////////////////////////
///////ACCEPTED/////////
////////////////////////

router.get('/:id', (request, response, next) => {
  console.log("/accepted:id GET request received");
  const { id } = request.params;
  var ref = db.collection('accepted_cases').doc(id);

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
  console.log("/accepted:doc POST request received");
  const inputs = request.body;
  console.log(inputs);

  var ref = db.collection('accepted_cases').doc();
  ref.set(inputs).then(function() {
      response.send("Document successfully written with id="+ref.id);
    });
});

router.delete('/:id', (request, response, next) => {
  console.log("/accepted:doc DELETE request received");
  var { id } = request.params;
  console.log(id);

  var ref = db.collection('accepted_cases').doc(id);
  ref.delete().then(function() {
      response.send("Document successfully deleted with id="+ref.id);
    });
});

module.exports = router;
