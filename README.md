# Web Cryptography API Demo

This code is a very simple demonstration of using the Web Cryptography API to store encrypted data in IndexedDB. 

The key is derived from a password that the user has to enter when storing and retrieving data, to simulate the PWA/SPA style app that doesn't keep the encryption key locally, and relies upon the user's password.

All the interesting stuff happens in app/scripts/main.js
