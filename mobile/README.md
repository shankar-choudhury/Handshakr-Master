# Handshakr Mobile

The mobile front-end for the Handshakr encrypted deal-making platform.  

## Installation

1. [Download the APK from our website](https://handshakr.duckdns.org/handshakr_mobile.apk) to your android phone (API 31 or newer)
2. Open the file in your file explorer
3. Grant installation permissions

## Running

1. [Register an account on our website](https://handshakr.duckdns.org/register)
2. Open the app
3. Log in with your account from step 1
4. On your first login with the app, you will need to grant bluetooth permission
5. If bluetooth is not enabled, you will need to enable bluetooth
6. Use the slider to choose whether you are making an offer or receiving an offer
	A. If receiving, simply wait for a nearby user to make an offer then accept or reject
	B. If sending, fill out the form.  Then, select a nearby user to make your offer.

## Help

HTML Javadocs are [available in this repo.](https://github.com/shankar-choudhury/Handshakr-Master/tree/main/mobile/JavaDoc)

## Testing
Due to the limitations of Android Studio's emulator with respect to bluetooth, unit testing is fairly minimal.  Tests can be found [here](https://github.com/shankar-choudhury/Handshakr-Master/blob/main/mobile/app/src/test/java/com/sxa1508/handshakr/HandShakrTests.java)


