import React, {useState} from 'react';
import HomeScreen from 'src/screens/home-screens/HomeScreen';
import ProfileScreen from 'src/screens/profile-screens/ProfileScreen';
import TitleCard from 'src/components/TitleCard';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, View, Image, Text, TouchableOpacity} from 'react-native';

export default function MainScreenNavigator() {
  const [modelOpen, setModelOpen] = useState(true);
  const Tab = createBottomTabNavigator();
  function toggleView() {
    setModelOpen(prevValue => !prevValue);
  }

  const EmptyComponent = (props: any) => (
    <View>
      <Text>No content. kindly go back</Text>
      {props}
    </View>
  );

  const CustomTabBarButton = ({children, onPress}: any) => (
    <TouchableOpacity
      style={[styles.touchableWrapper, styles.shadow]}
      onPress={onPress}>
      <View style={styles.buttonChildrenViewWrapper}>{children}</View>
    </TouchableOpacity>
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerTitle: () => <TitleCard />,
        tabBarShowLabel: false,
        tabBarStyle: [styles.tabBarStyle, styles.shadow],
      }}
      initialRouteName="HomeScreen">
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}: any) => (
            <View style={styles.commonIconImageViewWrapper}>
              <Image
                source={require('assets/pngs/home.png')}
                resizeMode="contain"
                style={[
                  styles.smallImage,
                  {tintColor: focused ? '#00790D' : '#748c94'},
                ]}
              />
              <Text style={{color: focused ? '#00790D' : '#748c94'}}>Home</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="BookingFormModalMS"
        component={EmptyComponent}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('assets/pngs/plus.png')}
              resizeMode="contain"
              style={styles.bigImage}
            />
          ),
          tabBarButton: (props: any) => <CustomTabBarButton {...props} />,
        }}
        listeners={({navigation}: any) => ({
          tabPress: (e: any) => {
            e.preventDefault();
            navigation.navigate('BookingFormModal', {
              previousScreen: 'MainScreen',
            });
          },
        })}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({focused}: any) => (
            <View style={styles.commonIconImageViewWrapper}>
              <Image
                source={require('assets/pngs/profile.png')}
                resizeMode="contain"
                style={[
                  styles.smallImage,
                  {tintColor: focused ? '#00790D' : '#748c94'},
                ]}
              />
              <Text style={{color: focused ? '#00790D' : '#748c94'}}>
                Profile
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  touchableWrapper: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonChildrenViewWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#00790D',
  },
  tabBarStyle: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    height: 90,
  },
  commonIconImageViewWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 10,
  },
  smallImage: {
    width: 25,
    height: 25,
  },
  bigImage: {
    width: 40,
    height: 40,
  },
});
