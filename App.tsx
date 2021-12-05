/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState, useEffect, useRef} from 'react';
import {SafeAreaView, Animated, StyleSheet, Easing, Alert} from 'react-native';
import RNExitApp from 'react-native-exit-app';
import {commonErrorHandler} from 'src/error-handling/commonErrorHanlders';
import PyramidLoadingSplash from 'src/screens/splash-screens/PyramidLoadingSplash';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MainScreenNavigator from 'src/screens/MainScreenNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import BookingListingScreen from 'src/screens/profile-screens/BookingListingScreen';
import ReachUs from 'src/screens/profile-screens/ReachUs';
import VisitorsListingScreen from 'src/screens/profile-screens/VisitorsListingScreen';
import VisitorForm from 'src/forms/VisitorForm';
import BookingForm from 'src/forms/BookingForm';
import {UserContext} from 'src/contexts/Context';
// Must be outside of any component LifeCycle (such as `componentDidMount`).

const App = () => {
  const backgroundStyle = {
    backgroundColor: '#fff',
    flex: 1,
  };
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const maninScreenOpacity = useRef(new Animated.Value(0)).current;
  const splashScreenOpacity = useRef(new Animated.Value(1)).current;
  const fadeIn = () => {
    Animated.sequence([
      Animated.timing(splashScreenOpacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(maninScreenOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start(() => {
      // setIsSplashLoaded(prevValue => !prevValue);
    });
  };

  const [isSignInHandled, setIsSignInHandled] = useState(false);
  const [uidStr, setUidStr] = useState(auth().currentUser?.uid);

  useEffect(() => {
    console.log('App.tsx mounted');
  }, []);

  useEffect(() => {
    console.log('auth().currentUser?.uid' + auth().currentUser?.uid);
    console.log('handling signIn process');
    if (auth().currentUser?.isAnonymous) {
      console.log('auth().currentUser?.uid' + auth().currentUser?.uid);
      console.log('user is already signed in anonymously');
      setIsLoading(false);
    } else {
      console.log('going to sign in');
      auth()
        .signInAnonymously()
        .then((userInfo: any) => {
          console.log('auth().currentUser?.uid' + auth().currentUser?.uid);
          console.log('signed in successfully');
          setUidStr(userInfo.user.uid);
          console.log('uidStr:' + uidStr);
          console.log('User signed in anonymously');
          Alert.alert(
            'You are signed in anonymously',
            'Your bookings will be lost if you uninstall this app',
            [{text: 'OK', onPress: () => setIsLoading(false)}],
          );
        })
        .catch((error: any) => {
          console.log('error occured wile sing in' + error.code);
          setIsError(true);
          commonErrorHandler(error, RNExitApp.exitApp);
        });
    }
    return () => {
      console.log('sign in process Complete:');
      setIsSignInHandled(true);
    };
  }, [isSignInHandled, uidStr]);

  const Stack = createNativeStackNavigator();

  const AppScreenNavigator = () => (
    <UserContext.Provider value={uidStr}>
      <Stack.Navigator
      // screenOptions={{
      //   presentation: 'modal',
      // }}
      >
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="MainScreen"
          component={MainScreenNavigator}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
          name="BookingFormModal"
          component={BookingForm}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
          name="VisitorFormModal"
          component={VisitorForm}
        />
        <Stack.Screen
          options={{
            title: 'Visitors',
            headerLargeTitle: true,
            headerTintColor: '#00790D',
            headerTitleStyle: {
              color: '#00790D',
            },
          }}
          name="VisitorListingScreen"
          component={VisitorsListingScreen}
        />
        <Stack.Screen
          options={{
            title: 'Bookings',
            headerLargeTitle: true,
            headerTintColor: '#00790D',
            headerTitleStyle: {
              color: '#00790D',
            },
          }}
          name="BookingListingScreen"
          component={BookingListingScreen}
        />
        <Stack.Screen
          options={{
            title: 'Reach us',
            headerLargeTitle: true,
            headerTintColor: '#00790D',
            headerTitleStyle: {
              color: '#00790D',
            },
          }}
          name="ReachUs"
          component={ReachUs}
        />
      </Stack.Navigator>
    </UserContext.Provider>
  );

  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <SafeAreaView style={backgroundStyle}>
          <Animated.View
            style={[styles.splashScreenView, {opacity: splashScreenOpacity}]}>
            <PyramidLoadingSplash
              isError={isError}
              isLoading={isLoading}
              postSplashAction={() => {
                fadeIn();
              }}
            />
          </Animated.View>

          {/* <MainScreenNavigator /> */}
          {!isLoading && (
            <Animated.View
              style={[styles.mainScreenView, {opacity: maninScreenOpacity}]}>
              <AppScreenNavigator />
            </Animated.View>
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splashScreenView: {
    flex: 1,
    position: 'absolute',
  },
  mainScreenView: {
    flex: 1,
  },
});

export default App;
