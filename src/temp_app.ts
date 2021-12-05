// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * Generated with the TypeScript template
//  * https://github.com/react-native-community/react-native-template-typescript
//  *
//  * @format
//  */

//  import React, {useState, useRef, useMemo, useEffect} from 'react';
//  import {SafeAreaView, Animated, StyleSheet, Easing} from 'react-native';

//  import PyramidLoadingSplash from 'src/screens/splash-screens/PyramidLoadingSplash';
//  import {SafeAreaProvider} from 'react-native-safe-area-context';
//  import MainScreenNavigator from 'src/screens/MainScreenNavigator';
//  import {NavigationContainer} from '@react-navigation/native';
//  import {createNativeStackNavigator} from '@react-navigation/native-stack';
//  import BookingModal from 'src/modals/BookingModal';
//  import PushNotificationIOS from '@react-native-community/push-notification-ios';
//  import PushNotification from 'react-native-push-notification';
//  import auth from '@react-native-firebase/auth';
//  import AsyncStorage from '@react-native-async-storage/async-storage';
//  import {AuthContext} from 'src/config/AuthContext';
//  async function storeData(key: string, value: any) {
//    try {
//      await AsyncStorage.setItem(key, value);
//    } catch (e) {
//      // saving error
//    }
//  }

//  async function getData(key: string) {
//    try {
//      const value = await AsyncStorage.getItem(key);
//      console.log('the value is:');
//      console.log(value);
//      // console.log(value === null);
//      if (value !== null) {
//        console.log('i am in');
//        signInAnonymously();
//      }
//    } catch (e) {
//      // error reading value
//    }
//    return undefined;
//  }

//  async function signInAnonymously() {
//    await auth()
//      .signInAnonymously()
//      .then((user: any) => {
//        storeData('uid', user.uid);
//        // console.log(user);
//        // console.log('User signed in anonymously');
//      })
//      .catch(error => {
//        if (error.code === 'auth/operation-not-allowed') {
//          console.log('Enable anonymous in your firebase console.');
//        }
//        console.error(error);
//      });
//  }

//  console.log('getData()');

//  // if (!getData('uid')) {
//  //   signInAnonymously();
//  // }

//  PushNotification.configure({
//    onRegister: function (token: any) {
//      console.log('TOKEN:', token);
//    },

//    onNotification: function (notification: any) {
//      console.log('NOTIFICATION:', notification);
//      notification.finish(PushNotificationIOS.FetchResult.NoData);
//    },

//    onAction: function (notification: any) {
//      console.log('ACTION:', notification.action);
//      console.log('NOTIFICATION:', notification);
//    },

//    onRegistrationError: function (err: any) {
//      console.error(err.message, err);
//    },

//    permissions: {
//      alert: true,
//      badge: true,
//      sound: true,
//    },

//    popInitialNotification: true,

//    requestPermissions: true,
//  });

//  const App = () => {
//    const backgroundStyle = {
//      backgroundColor: '#fff',
//      flex: 1,
//    };
//    const [isSplashLoaded, setIsSplashLoaded] = useState(false);
//    const maninScreenOpacity = useRef(new Animated.Value(0)).current;
//    const splashScreenOpacity = useRef(new Animated.Value(1)).current;

//    const fadeIn = () => {
//      Animated.sequence([
//        Animated.timing(splashScreenOpacity, {
//          toValue: 0,
//          duration: 1000,
//          useNativeDriver: true,
//        }),
//        Animated.timing(maninScreenOpacity, {
//          toValue: 1,
//          duration: 1000,
//          useNativeDriver: true,
//          easing: Easing.inOut(Easing.ease),
//        }),
//      ]).start(() => {
//        // setIsSplashLoaded(prevValue => !prevValue);
//      });
//    };

//    const loginReducer = (prevState, action) => {
//      switch (action.type) {
//        case 'RETRIEVE_TOKEN':
//          return {
//            ...prevState,
//            userToken: action.token,
//            isLoading: false,
//          };
//        case 'LOGIN':
//          return {
//            ...prevState,
//            userName: action.id,
//            userToken: action.token,
//            isLoading: false,
//          };
//        case 'LOGOUT':
//          return {
//            ...prevState,
//            userName: null,
//            userToken: null,
//            isLoading: false,
//          };
//        case 'REGISTER':
//          return {
//            ...prevState,
//            userName: action.id,
//            userToken: action.token,
//            isLoading: false,
//          };
//      }
//    };
//    const initialLoginState = {
//      isLoading: true,
//      userName: null,
//      userToken: null,
//    };
//    const [loginState, dispatch] = React.useReducer(
//      loginReducer,
//      initialLoginState,
//    );

//    const authContext = React.useMemo(
//      () => ({
//        signIn: async (foundUser: any) => {
//          // setUserToken('fgkj');
//          // setIsLoading(false);
//          const userToken = String(foundUser[0].userToken);
//          const userName = foundUser[0].username;

//          try {
//            await AsyncStorage.setItem('userToken', userToken);
//          } catch (e) {
//            console.log(e);
//          }
//          // console.log('user token: ', userToken);
//          dispatch({type: 'LOGIN', id: userName, token: userToken});
//        },
//        signOut: async () => {
//          // setUserToken(null);
//          // setIsLoading(false);
//          try {
//            await AsyncStorage.removeItem('userToken');
//          } catch (e) {
//            console.log(e);
//          }
//          dispatch({type: 'LOGOUT'});
//        },
//        signUp: async () => {
//          // setUserToken('fgkj');
//          // setIsLoading(false);
//          await auth()
//            .signInAnonymously()
//            .then((user: any) => {
//              storeData('uid', user.uid);
//              // console.log(user);
//              // console.log('User signed in anonymously');
//            })
//            .catch(error => {
//              if (error.code === 'auth/operation-not-allowed') {
//                console.log('Enable anonymous in your firebase console.');
//              }
//              console.error(error);
//            });
//        },
//      }),
//      [],
//    );

//    useEffect(() => {
//      setTimeout(async () => {
//        // setIsLoading(false);
//        let userToken;
//        userToken = null;
//        try {
//          userToken = await AsyncStorage.getItem('userToken');
//        } catch (e) {
//          console.log(e);
//        }
//        // console.log('user token: ', userToken);
//        dispatch({type: 'RETRIEVE_TOKEN', token: userToken});
//      }, 1000);
//    }, []);
//    const Stack = createNativeStackNavigator();

//    const AppScreenNavigator = () => (
//      <AuthContext.Provider value={authContext}>
//        <Stack.Navigator
//        // screenOptions={{
//        //   presentation: 'modal',
//        // }}
//        >
//          <Stack.Screen
//            options={{
//              headerShown: false,
//            }}
//            name="MainScreen"
//            component={MainScreenNavigator}
//          />
//          <Stack.Screen
//            options={{
//              headerShown: false,
//              presentation: 'modal',
//              animation: 'slide_from_bottom',
//            }}
//            name="BookingModalScreen"
//            component={BookingModal}
//          />
//        </Stack.Navigator>
//      </AuthContext.Provider>
//    );

//    return (
//      <NavigationContainer>
//        <SafeAreaProvider>
//          <SafeAreaView style={backgroundStyle}>
//            {!={[styles.splashScreenView, {opacity: splashScreenOpacity}]}>
//                <PyramidLoadingSplash
//                  postSplashAction={() => {
//                    fadeIn();
//                  }}
//                />
//              </Animated.View>
//            )}
//            {/* <MainScreenNavigator /> */}

//            <Animated.View
//              style={[styles.mainScreenView, {opacity: maninScreenOpacity}]}>
//              <AppScreenNavigator />
//            </Animated.View>
//          </SafeAreaView>
//        </SafeAreaProvider>
//      </NavigationContainer>
//    );
//  };

//  const styles = StyleSheet.create({
//    splashScreenView: {
//      flex: 1,
//      position: 'absolute',
//    },
//    mainScreenView: {
//      flex: 1,
//    },
//  });

//  export default App;
