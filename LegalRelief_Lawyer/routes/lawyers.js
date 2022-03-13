const { Router } = require('express');

const router = Router();

fbApp = require('../secrets/legalrelief-lawyer')

//firebase dependencies
const firebase = require("firebase");
require("firebase/firestore");
const db = firebase.firestore();

////////////////////////
////////LAWYERS/////////
////////////////////////

router.get('/:doc', (request, response, next) => {
  console.log("/lawyers:doc GET request received");
  const { doc } = request.params;
  console.log(doc);
  var ref = db.collection('Lawyers').doc(doc);

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

router.post('/:doc', (request, response, next) => {
  console.log("/lawyers:doc POST request received");
  var { doc } = request.params;
  const inputs = request.body;
  console.log(doc);
  console.log(inputs);

  var ref = db.collection('Lawyers').doc(doc);
  ref.set(inputs).then(function() {
      response.send("Document successfully written with id="+ref.id);
    });
});

router.put('/:doc', (request, response, next) => {
  console.log("/lawyers:doc PUT request received");
  var { doc } = request.params;
  const inputs = request.body;
  console.log(doc);
  console.log(inputs);

  var ref = db.collection('Lawyers').doc(doc);
  ref.update(inputs).then(function() {
      response.send("Document successfully updated with id="+ref.id);
    });
});

module.exports = router;
