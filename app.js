//Authentication to GCLOUD
//https://stackoverflow.com/questions/42043611/could-not-load-the-default-credentials-node-js-google-compute-engine-tutorial

//Firestore collection
//https://console.firebase.google.com/u/0/project/centered-sight-95110/firestore/databases/testdb/data/~2Ftestcollection

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const collectionName = "testcollection";
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_DOMAIN.firebaseapp.com",
    projectId: "centered-sight-95110",
    storageBucket: "centered-sight-95110.appspot.com",
    messagingSenderId: "XYZ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, 'testdb');

// Reading data
getCollectionData().then((collectionSize) => {  
  // Adding data
  addDocument(collectionSize, 3).then((newCollectionSize) => {
    // Deleting data
    debugger; // to see the changes in db
    deleteDocument(newCollectionSize).then((newCollectionSize) => {
      // Updating data
      debugger; // to see the changes in db
      updateDocument(newCollectionSize);
    });
  });  
});


async function getCollectionData() {
  const ref = await db.collection(collectionName).get();
  console.log("Current " + ref.size + "document(s) in collection:");
  ref.forEach((doc) => {
    console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
  });
  return ref.size;
}

async function getDocument(index) {
  console.log("Looking for document with index " + index + " in collenction");
  return await db.collection(collectionName).where('index', '==', index).limit(1).get() 
    .then((ref) => {
      if (!ref.empty) {
        const doc = ref.docs[0];
        console.log("Found document with index" + index + ". Document ID: " + doc.id);
        console.log("Document Data:" + JSON.stringify(doc.data()));
        return doc.id;
      } else {
        console.log('No document found with index: ' + index);
        return null;
      }
  })
  .catch((error) => {
    console.error("Error getting document: ", error);
  });
}

async function addDocument(collectionSize, amount) {
  try {
    console.log("Adding " + amount + " documents to collection");
    for (let index = collectionSize + 1; index <= (collectionSize + amount); index++) {
      const ref = await db.collection(collectionName).add({
        createdAt: new Date(),
        index: index,
        key: "testkey" + index, 
        value: "testvalue" + index});
      console.log("Document written with ID: ", ref.id);
    }
    return collectionSize + amount;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function deleteDocument(collectionSize) {
  const docIndexToDelete = Math.floor(Math.random() * collectionSize) + 1;
  return getDocument(docIndexToDelete).then((docId) => {
    try {
      db.collection(collectionName).doc(docId).delete();
      console.log("Deleted document with id " + docId + " from collection");
      return collectionSize - 1;
    } catch (error) {
      console.error("Error removing document with id: " + docId + ":", error);
    }
  });  
}
  
async function updateDocument(collectionSize) {
  const docIndexToDelete = Math.floor(Math.random() * collectionSize) + 1;
  getDocument(docIndexToDelete).then((docId) => {
    try {
      db.collection(collectionName).doc(docId).update({
        updatedAt: new Date()
      });
      console.log("Updated document with id " + docId + " from collection");
      return collectionSize - 1;
    } catch (error) {
      console.error("Error updating document with id: " + docId + ":", error);
    }
  });
}
  
  

