PayPub
======

A user-friendly implementation of the PayPub protocol for trustless
information publishing on Bitcoin.

## What is PayPub

PayPub is a protocol for revealing information upon a payment, in a way that
doesn't require much trust from either party.

Think of the classic briefcase swap scene from the movies. In this scenario,
it's very difficult to guarantee that both parties will deliver what they
agreed upon. Either one of these briefcases could turn out to be empty or
its contents unsatisfactory.

What if there was a way to link the payment to the reveal of the information?
Turns out there is! Think about this:  what does one have to reveal to spend
money in Bitcoin? For standard addresse it's a public key and signature
from the origin address. Until you spend funds for the first time from a
certain address, the public key remains hidden. We can use it then to generate
a symmetric secret and encrypt a file.

But public keys don't appear out of
nowhere. Each public key comes out of a corresponding private key. To keep
things deterministic (that is, to always map a file to the same address), we
can use the hash digest of the file to create our private key.

Now that we have a bunch of files encrypted with a secret derived from their corresponding public
key we can distribute the ciphertexts and accept payments for them. There is one
remaining problem: nobody can trust that we actually encrypted the files they
want, so we we will establish trust by commiting to reveal a certain portion
of the files that we don't know, based on the hash of a Bitcoin block in the
future. If the other person likes what they see, the can bid for the remaining
files later.

## Contribute

To build UI assets and watch changes:

		npm run watch

To start the application:

		npm start

To package the application into a platform-specific executable:

		npm run package


## Author

 * Federico Bond - @federicobond

## License

Code is licensed under MIT
