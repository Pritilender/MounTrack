# MounTrack

MounTrack is a simple Ionic mobile application developed for MOSIS (Mobile systems and services) homework.
It's used for tracking places of interest on your hiking trips.

# Running

## Without Ionic/Cordova

If you don't have Ionic installed, you should install it over `npm` globally, along with Cordova CLI:

`npm install -g cordova ionic`

## With Ionic

First install all dependancies with `npm install` and `cordova prepare`.
This will install Android platform and all necessary plugins.

If iOS platform is needed, then run `cordova platform add ios` which will setup iOS platform and install all necessary plugins.

For the best experience, we suggest running `npm run android:device` or `npm run ios:device`, with a connected device.

If you don't have device at your disposal, then start the Android emulator with `npm run android:emulator` (we hope that you have **Nexus_5X_API_25_x86** as AVD) and then, in another terminal run `npm run android:run` for a single run, or `npm run android:live` for livereload session with `console.log` outputs.

For iOS, you need to start the simulator first, and then use analog commands: `npm run ios:run` or `npm run android:live`.

Running in browser with `ionic serve` is **not advised** due to the fact that some plugins (like `cordova-sqlite-storage`) have no browser support.

## Known bugs

+ SQLite failure on iOS simulator -- this should be tested on a real device.
+ Geolocation not working on Android device in livereload session.
