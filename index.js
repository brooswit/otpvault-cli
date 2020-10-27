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

rl.question('Enter your OTPV password: ', function(password) {
    console.log();
    rl.close();
    var simpleCrypto = new SimpleCrypto(password);

    const homedir = require('os').homedir();

    let action = process.argv[2];
    let newOtpName = process.argv[3];
    let newOtpSecret = process.argv[4];

    if (!fs.existsSync(`${homedir}/.otp`) || action === 'reset') {
        if (action === 'reset') console.log('Resetting OTPV...');
        console.warn('Initializing OTPV...');
        saveEncrypted({});
        return;
    }

    let encryptedContents = fs.readFileSync(`${homedir}/.otp`).toString();
    let otps = simpleCrypto.decrypt(encryptedContents);

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
        let raw = simpleCrypto.encrypt(JSON.stringify(data));
        fs.writeFileSync(`${homedir}/.otp`, raw);
    }
});

rl._writeToOutput = function _writeToOutput(stringToWrite) {
  if (rl.stdoutMuted)
    rl.output.write("*");
  else
    rl.output.write(stringToWrite);
};

