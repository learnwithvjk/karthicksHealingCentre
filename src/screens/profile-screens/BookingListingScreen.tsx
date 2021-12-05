import React, {useState, useLayoutEffect, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Button,
  FlatList,
} from 'react-native';
import NoDataComponent from 'src/components/NoDataComponent';
import {getBookings} from 'src/api/Bookings';
import LottieView from 'lottie-react-native';
import {UserContext} from 'src/contexts/Context';
import {commonErrorHandler} from 'src/error-handling/commonErrorHanlders';

export default function BookingListingScreen({route, navigation}: any) {
  const [isLoading, setIsLoading] = useState(true);

  const [bookingData, setBookingData] = useState([]);

  const uid = useContext(UserContext);

  function addNewBookingsButton() {
    return (
      <Button
        onPress={() => navigateTobookingsModal()}
        title="Book Appointment"
        color="#00790D"
      />
    );
  }

  const [isComponentMounted, setIsComponentMounted] = useState(false);

  useEffect(() => {
    console.log('bookingListingScreen.tsx mounted');
    setIsLoading(true);
    const payload = {
      queryParams: {
        uid: uid,
      },
    };
    console.log('getting bookings');
    getBookings(payload)
      .then(bookings => {
        console.log('updating bookings to state');
        console.log(bookings);
        setBookingData(JSON.parse(JSON.stringify(bookings)));
        console.log('setting loading false');
      })
      .catch(error => {
        console.log('bookingListingPageErr:' + error);
        commonErrorHandler(error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      console.log('bookingListingScreen.tsx initialized');
    };
  }, [uid]);

  useEffect(() => {
    setIsComponentMounted(true);
    if (isComponentMounted && route.params?.isNewBookingAdded !== undefined) {
      const addedAppointment = route.params?.addedValue;
      console.log(addedAppointment);
      console.log('add content called');
      setBookingData((prevValue: any) => {
        prevValue.push(addedAppointment);
        return prevValue;
      });
      navigation.setParams({
        isNewBookingAdded: undefined,
      });
    }

    return () => {
      setIsComponentMounted(false);
    };
  }, [
    isComponentMounted,
    navigation,
    route.params?.isNewBookingAdded,
    route.params?.addedValue,
  ]);

  useLayoutEffect(() => {
    if (bookingData && bookingData.length) {
      navigation.setOptions({
        headerRight: addNewBookingsButton,
      });
    }
  });

  function navigateTobookingsModal(
    visitorIndex: number | undefined = undefined,
  ) {
    navigation.navigate('BookingFormModal', {
      previousScreen: 'BookingListingScreen',
      formData:
        visitorIndex !== undefined ? bookingData[visitorIndex] : undefined,
    });
    setIsComponentMounted(false);
  }

  function visitorCard({item, index}: any) {
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.cardLhs}>
            {item.visit_type === 'clinic' && (
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.slot}>
                {item.slot_date} at {item.slot_time}
              </Text>
            )}
            {item.visit_type === 'online' && (
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.slot}>
                Online Booking
              </Text>
            )}

            <View style={styles.moreInfo}>
              <Text style={styles.name}>{item.visitor_name}</Text>
              {item.cause && <Text style={styles.seperator}>|</Text>}
              {item.cause && <Text style={styles.cause}>{item.cause}</Text>}
            </View>
          </View>
          <View style={styles.cardRhs}>
            {/* <TouchableOpacity onPress={() => navigateTobookingsModal(index)}>
              <Image
                source={require('assets/pngs/edit.png')}
                resizeMode="contain"
                style={[styles.editImage]}
              />
            </TouchableOpacity> */}
            {/* <TouchableOpacity
              onPress={() => confirmationAlert(item.visitor_id)}>
              <Image
                source={require('assets/pngs/delete-2.png')}
                resizeMode="contain"
                style={[styles.deleteImage]}
              />
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.cardsWrapper}>
      {isLoading && (
        <View style={styles.lottieWrapper}>
          <LottieView
            source={require('assets/lotties/list-loading.json')}
            autoPlay
            speed={1}
          />
        </View>
      )}

      {!isLoading && bookingData && bookingData.length ? (
        <FlatList
          data={bookingData}
          renderItem={visitorCard}
          extraData={visitorCard}
          initialNumToRender={0}
          keyExtractor={item => item.booking_id}
        />
      ) : (
        !isLoading && (
          <NoDataComponent label="No bookings made yet">
            {addNewBookingsButton()}
          </NoDataComponent>
        )
      )}
      {/* {bookingData.map((visitor: any, index: number) => (

      ))} */}
    </View>
  );
}

const styles = StyleSheet.create({
  cardsWrapper: {
    flex: 1,
    margin: 20,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  card: {
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  cardLhs: {
    flex: 7,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  cardRhs: {
    flex: 3,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  moreInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 10,
    paddingBottom: 20,
  },
  slot: {
    fontWeight: '500',
    color: '#000',
  },
  name: {
    color: 'grey',
  },
  cause: {
    color: 'grey',
  },
  deleteImage: {
    width: 35,
    height: 30,
    marginLeft: 10,
  },
  editImage: {
    top: 4,
    width: 35,
    height: 30,
  },
  seperator: {
    marginHorizontal: 10,
  },
  lottieWrapper: {
    width: '100%',
    height: '100%',
  },
});
