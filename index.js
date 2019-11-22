const readline = require('readline');
const fs = require('fs')
const otplib = require('otplib')
const SimpleCrypto = require("simple-crypto-js").default;
/* ask for password */

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.stdoutMuted = true;

rl.question('Password: ', function(password) {
    console.log();
  rl.close();
    var simpleCrypto = new SimpleCrypto(password);

    const homedir = require('os').homedir();

    let action = process.argv[2];
    let newOtpName = process.argv[3];
    let newOtpSecret = process.argv[4];

    if (!fs.existsSync(`${homedir}/.otp`) || action === 'reset') {
        console.warn('initializing');
        saveEncrypted({});
        if (action === 'reset') return console.log('otp reset');
    }

    let encryptedContents = fs.readFileSync(`${homedir}/.otp`).toString();
    let contents = simpleCrypto.decrypt(encryptedContents);
    let otps = {};
    try {
        otps = JSON.parse(contents);
    } catch(e) {
        return console.log("decryption failed");
    }

    if (!action) {
        console.warn('- OTPs -------------------------------------------------------------------------')
        for(let otpName in otps) {
            let otpSecret = otps[otpName];
            let otpToken = otplib.authenticator.generate(otpSecret);
            console.log(`  ${otpName}: ${otpToken}`);
        }
        console.warn('--------------------------------------------------------------------------------')
    } else if (action === 'add') {
        console.warn(`Added ${newOtpName}`)
        otps[newOtpName] = newOtpSecret;
        saveEncrypted(otps);
    } else if (action === 'remove') {
        console.warn(`Removed ${newOtpName}`)
        delete otps[newOtpName];
        saveEncrypted(otps);
    } else {
        console.error(`ERROR unknown action ${action}`);
    }
    function saveEncrypted(data) {
        fs.writeFileSync(`${homedir}/.otp`,simpleCrypto.encrypt(JSON.stringify(data)));
    }
});

rl._writeToOutput = function _writeToOutput(stringToWrite) {
  if (rl.stdoutMuted)
    rl.output.write("*");
  else
    rl.output.write(stringToWrite);
};

