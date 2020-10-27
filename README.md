# otpvault-cli

A secure command-line based one-time password tool. To install:

```
npm install -g https://github.com/brooswit/otpvault-cli
```

OTPV keeps your OTP codes encrypted at rest. Every time you run OTPV it asks you for a password. The first time you run OTPV it accepts any password. This will be your password moving forward.

If you forget your password, you can restart by using the rest command:

```
otpv reset
```

To add a new secret:

```
otpv add SECRET_NAME SECRET
```

to remove a secret:

```
otpv remove SECRET_NAME
```

to list your OTP codes:

```
otpv
```
