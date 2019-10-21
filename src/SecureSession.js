const NaCl = require('libsodium-wrappers');

let serverPublicKey, serverPrivateKey, clientPublicKey;
let rx, tx;

async function Init() {
    await NaCl.ready;
    const keypair = NaCl.crypto_kx_keypair();
    serverPrivateKey = keypair.privateKey;
    serverPublicKey = keypair.publicKey;
}

module.exports.serverPublicKey = async function ServerPublicKey(){
    await Init();
    return serverPublicKey;
}

module.exports.setClientPublicKey =  function SetClientPublicKey(key){
        if(key != null && (typeof(clientPublicKey) == 'undefined' || clientPublicKey == null || clientPublicKey == key ) )
            clientPublicKey = key;
        else
            throw "client public key already set";
}

module.exports.decrypt =  function decrypt(ciphertext, nonce) {
    const sharedKeys = NaCl.crypto_kx_server_session_keys(serverPublicKey, serverPrivateKey, clientPublicKey);
    return NaCl.crypto_secretbox_open_easy(ciphertext,nonce,sharedKeys.sharedRx);
}

module.exports.encrypt =  function encrypt(msg) {
    const sharedKeys = NaCl.crypto_kx_server_session_keys(serverPublicKey, serverPrivateKey, clientPublicKey);
    var nonce =  NaCl.randombytes_buf(NaCl.crypto_secretbox_NONCEBYTES);
    var ciphertext = NaCl.crypto_secretbox_easy(msg,nonce,sharedKeys.sharedTx);
    return {ciphertext, nonce};
}