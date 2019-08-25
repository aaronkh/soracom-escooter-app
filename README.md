# soracom-escooter-app
This app accompanies the tutorial for building an escooter app using SORACOM services (Link coming soon). Test it out by using one of the prebuilt apks from the releases tab above. Built with React native.

## Building and Running    
This app has **not** been tested or built for iOS. Follow these instructions to build for Android only.    

1. Add a Google Maps SDK Key
    - Install Android Studio to build React Native apps per [the Getting Started page](https://facebook.github.io/react-native/docs/getting-started#1-install-android-studio)
    - Follow [these instructions](https://developers.google.com/maps/documentation/android-sdk/start) to get an API key
    - In your `.gradle` folder, make a `gradle.properties` file if it does not already exist (this file is found under `/Users/{USERNAME}/` on Mac and Windows)
    - Add your API key as a variable by appending `GMAPS_SDK_KEY="{YOUR_API_KEY}"` onto the end of the file
2. Setup a server for the app to connect with
    - View and follow the setup directions for the [escooter server](https://github.com/DevinMui/soracom-escooter-server)
    - Clone this repository and open a terminal window at the root of the directory
    - Set environment variable `API_URL` to the URL of the server (run `export API_URL={YOUR_URL}` on Mac or `setx API_URL "{YOUR_URL}" on Windows`
3. Add your Stripe key for payments
    - Using the same account from the [server instructions](https://github.com/DevinMui/soracom-escooter-server), open up your [Stripe API Keys page](https://dashboard.stripe.com/test/apikeys).
    - Copy the publishable key under the table marked "Standard keys"
    - Set environment variable `STRIPE_KEY` to the URL of the server (run `export STRIPE_KEY={YOUR_KEY}` on Mac or `setx STRIPE_KEY "{YOUR_KEY}" on Windows`
    - Keep in mind that this **will enable credit card payments through the app.** If you would like to test out payment functionality without charging an actual card, use card number `4242 4242 4242 4242` when prompted instead.
4. Run the app using React Native
    - Install the required dependencies with `npm i` in the same terminal as step 2
    - Install a development version of the app using `react-native run-android` in the terminal (Note that you can also run a release version without the debug menu with `react-native run-android --variant=release`)
  
**Congratulations!** Your escooter app is ready.

## Contributing    
This app is missing a lot of features, most notably proper error handling and navigation. iOS support is also missing. Feel free to fork and leave a pull request!

  
