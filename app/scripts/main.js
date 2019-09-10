var te = new TextEncoder();
var salt = te.encode(12345);


function setupDatabase()
{
  var db = new Dexie('EncryptionDB');

  db.version(1).stores({
    encrypted: '++id, data, iv'
  });

  return db;
}



function importKey(password)
{
  var enc = new TextEncoder();
  var encoded = enc.encode(password);

  return window.crypto.subtle.importKey(
    'raw',
    encoded,
    {
      name: 'PBKDF2'
    },
    false,
    ['deriveKey']
  )
}



function generateKey(key, salt)
{
  return window.crypto.subtle.deriveKey(
    {
      'name': 'PBKDF2',
      salt: salt,
      'iterations': 100000,
      'hash': 'SHA-256'
    },
    key,
    {
      'name': 'AES-GCM',
      'length': 256,
    },
    false, //don't allow extracting the key
    ['encrypt', 'decrypt']);
}




function encryptData(text, key, ivValue) {
  return window.crypto.subtle.encrypt(
      {
          name: 'AES-GCM',
          iv: ivValue,
      },
      key,
      text
  );
}




function decryptData(encryptedData, key, ivValue) {
  return window.crypto.subtle.decrypt(
      {
          name: 'AES-GCM',
          iv: ivValue,
      },
      key,
      encryptedData
  )
}



$('#encryptData').click(function(e) {
  e.preventDefault();

  var enc = new TextEncoder();
  var encoded = enc.encode($('#data').val());
  var ivValue = window.crypto.getRandomValues(new Uint8Array(12));
  var password = $('#password').val();


  importKey(password)
  .then(function (key) {
    generateKey(key, salt)
    .then (function (derivedKey) {
      encryptData(encoded, derivedKey, ivValue)
      .then (function(encryptedData) {
        db.encrypted.add({data: encryptedData, iv: ivValue})
        .then (function(id) {
          alert(id);
        });
      });
    });
  });
});



$('#decryptData').click(function(e) {
  e.preventDefault();

  var dec = new TextDecoder();
  var password = $('#password').val();
  var id = $('#decryptid').val();
  var intId = parseInt(id);

  var dataFromDb = db.encrypted.get(intId)
  .then(function(obj) {
    importKey(password)
    .then(function(key) {
      generateKey(key, salt)
      .then(function(derivedKey) {
        decryptData(obj.data, derivedKey, obj.iv)
        .then (function(text) {
          alert(dec.decode(text));
        });
      });
    });
  });
});




var db = setupDatabase();







