const fs = require('fs')
const otplib = require('otplib')

const homedir = require('os').homedir();

let action = process.argv[2]
let newOtpName = process.argv[3]
let newOtpSecret = process.argv[4]

if (!fs.existsSync(`${homedir}/.otp`)) {
    console.warn('initializing')
    fs.writeFileSync(`${homedir}/.otp`,'{}')
}

let contents = fs.readFileSync(`${homedir}/.otp`);
let otps = JSON.parse(contents);

if (!action) {
    console.warn('- OTPs -------------------------------------------------------------------------')
    for(let otpName in otps) {
        let otpSecret = otps[otpName]
        let otpToken = otplib.authenticator.generate(otpSecret)
        console.log(`- ${otpName}: ${otpToken}`)
    }
    console.warn('--------------------------------------------------------------------------------')
} else if (action === 'add') {
    console.warn(`Added ${newOtpName}`)
    otps[newOtpName] = newOtpSecret
    fs.writeFileSync(`${homedir}/.otp`,JSON.stringify(otps))
} else if (action === 'remove') {
    console.warn(`Removed ${newOtpName}`)
    delete otps[newOtpName]
    fs.writeFileSync(`${homedir}/.otp`,JSON.stringify(otps))
} else {
    console.error(`ERROR unknown action ${action}`)
}