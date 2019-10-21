const nacl = require('libsodium-wrappers');
let keypair = null;
let loadLibsodium = async () => await nacl.ready;

(async () => {
    await loadLibsodium();
    keypair = nacl.crypto_sign_keypair();
})();

module.exports.verifyingKey = async function verifyingKey(){
    await loadLibsodium();
    return keypair.publicKey;
}

module.exports.sign = async function sign(msg){
    return nacl.crypto_sign(msg, keypair.privateKey);
}