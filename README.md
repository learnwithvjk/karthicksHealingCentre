###### Karthick Heling centre

This is an android only supported application built in react native.
It can we used to view status, availability and Location of "Karthick's Clinic".
The App consists of 3 entities:

1. Visitor -> The person who is going to visit the clinic via online and offline
2. Slots -> Its completely hidden in background. It stores the information on which time the clinic is available
3. Bookings -> Every visitor can book their desired slot in which they can visit the clinic

#### Fire base set up (Backend)

1. Create firebase account and add a project
2. Associate an android app with the project and follow the steps mentioned in firebase website on pasting the google-service.json and linking with gradle files
3. Switch to Blaze Plan
4. Enable Anonymous authentication
5. Enable Firestore database ( choose DB based on your country )
6. Enable RealTime database
7. Enable Functions and install the dependencies in your project itself as mentioned in firebase website
8. login and give access from browser by `firebas login`
9. initialize application by `firebase init`
10. accept and install dependencies
11. Copy the contents in function/src/index.ts and paste in your project's function
12. Copy the contents in function/src/tsconfig.json and paste in your project's function
13. Copy the contents in function/src/eslintrc.js and paste in your project's function
14. Deploy firebase instance by `firebase deploy`
15. Once deployed, initialize the data by calling initializeDataBase method (url can be found in firebase functions)

##### React native Setup (Front End)

1. Install React native and its dependencies. [refer here](https://reactnative.dev/docs/environment-setup)
2. Clone the repository and `cd karthicksHealingCentre`
3. Install in-app dependencies `npx install`
4. Run the app using the command `npx react-native run-android`
5. This will run the application
