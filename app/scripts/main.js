var enc = new TextEncoder();
var encoded = enc.encode('wibble');
console.log(encoded);

var ivValue = window.crypto.getRandomValues(new Uint8Array(12));


window.crypto.subtle.generateKey(
    {
        name: 'AES-GCM',
        length: 256,
    },
    false,
    ['encrypt', 'decrypt']
)
.then(function(key){
    encrypt(encoded, key);
})
.catch(function(err) {
    console.error(err);
});

function encrypt(text, key) {
    window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: ivValue,
        },
        key,
        text
    )
    .then(function(encrypted) {
        decrypt(encrypted, key);
    })
    .catch(function(err) {
        console.error(err);
    });
}

function decrypt(enc, key) {
    window.crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: ivValue,
        },
        key,
        enc
    )
    .then(function(decrypted) {
        var dec = new TextDecoder('utf-8');
        var decText = dec.decode(decrypted);
        console.log(decText);
    })
    .catch(function(err){
        console.error(err);
    });
}
