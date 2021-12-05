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
import {getVisitors, deleteVisitor} from 'src/api/Visitors';
import LottieView from 'lottie-react-native';
import {UserContext} from 'src/contexts/Context';
import {commonErrorHandler} from 'src/error-handling/commonErrorHanlders';

export default function VisitorsListingScreen({route, navigation}: any) {
  const [isLoading, setIsLoading] = useState(true);

  const [visitorData, setVisitorData] = useState([]);

  const uid = useContext(UserContext);

  function addNewVisitorButton() {
    return (
      <Button
        onPress={() => navigateToVisitorsModal()}
        title="Add Visitor"
        color="#00790D"
      />
    );
  }

  const [isComponentMounted, setIsComponentMounted] = useState(false);

  useEffect(() => {
    console.log('VisitorListingScreen.tsx mounted');
    setIsLoading(true);
    const payload = {
      queryParams: {
        uid: uid,
      },
    };
    console.log('getting visitors');
    getVisitors(payload)
      .then(visitors => {
        console.log('updating visitors to state');
        setVisitorData(JSON.parse(JSON.stringify(visitors)));
        console.log('setting loading false');
      })
      .catch(error => {
        console.log('visitorListingPageErr:' + error);
        commonErrorHandler(error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      console.log('VisitorListingScreen.tsx initialized');
    };
  }, [uid]);

  useEffect(() => {
    setIsComponentMounted(true);
    if (isComponentMounted && route.params?.isUpdateForm !== undefined) {
      const updatedVisitor = route.params?.updatedValue;
      console.log(updatedVisitor);
      if (route.params.isUpdateForm) {
        console.log('update content called');
        const updatedVisitorIndex = visitorData.findIndex(
          (visitor: any) => updatedVisitor.visitor_id === visitor.visitor_id,
        );
        setVisitorData((prevValue: any) => {
          prevValue[updatedVisitorIndex] = updatedVisitor;
          return prevValue;
        });
      } else {
        console.log('add content called');
        setVisitorData((prevValue: any) => {
          prevValue.push(updatedVisitor);
          return prevValue;
        });
      }
      navigation.setParams({
        isUpdateForm: undefined,
      });
    }

    return () => {
      setIsComponentMounted(false);
    };
  }, [
    isComponentMounted,
    visitorData,
    navigation,
    route.params?.onFirstLoad,
    route.params?.isUpdateForm,
    route.params?.updatedValue,
  ]);

  useLayoutEffect(() => {
    if (visitorData && visitorData.length) {
      navigation.setOptions({
        headerRight: addNewVisitorButton,
      });
    }
  });

  async function doDeleteVisitor(visitorId: number) {
    const payload = {
      queryParams: {
        uid: uid,
        visitor_id: visitorId,
      },
    };
    setIsLoading(true);
    deleteVisitor(payload)
      .then(() => {
        setVisitorData(() => {
          const nonDeletedVisitors = visitorData.filter(
            (visitor: any) => visitor.visitor_id !== visitorId,
          );
          return nonDeletedVisitors;
        });
      })
      .catch(error => {
        console.log('visitorListingPageErr:' + error);
        commonErrorHandler(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function confirmationAlert(visitorId: number) {
    Alert.alert(
      'Are you sure you want to delete Visitor ?',
      'this action cannot be reverted',
      [
        {text: 'OK', onPress: () => doDeleteVisitor(visitorId)},
        {text: 'cancel', onPress: () => console.log('OK Pressed')},
      ],
    );
  }

  function navigateToVisitorsModal(
    visitorIndex: number | undefined = undefined,
  ) {
    navigation.navigate('VisitorFormModal', {
      previousScreen: 'VisitorListingScreen',
      formData:
        visitorIndex !== undefined ? visitorData[visitorIndex] : undefined,
    });
    setIsComponentMounted(false);
  }

  function visitorCard({item, index}: any) {
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.cardLhs}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
              {item.visitor_name}
            </Text>
            <View style={styles.moreInfo}>
              <Text style={styles.age}>{item.age}</Text>
              <Text style={styles.seperator}>|</Text>
              <Text style={styles.gender}>{item.gender.toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.cardRhs}>
            <TouchableOpacity onPress={() => navigateToVisitorsModal(index)}>
              <Image
                source={require('assets/pngs/edit.png')}
                resizeMode="contain"
                style={[styles.editImage]}
              />
            </TouchableOpacity>
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

      {!isLoading && visitorData && visitorData.length ? (
        <FlatList
          data={visitorData}
          renderItem={visitorCard}
          extraData={visitorCard}
          initialNumToRender={0}
          keyExtractor={item => item.visitor_id}
        />
      ) : (
        !isLoading && (
          <NoDataComponent label="No visitors added yet">
            {addNewVisitorButton()}
          </NoDataComponent>
        )
      )}
      {/* {visitorData.map((visitor: any, index: number) => (

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
  name: {
    fontWeight: '500',
    color: '#000',
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
  age: {
    color: 'grey',
  },
  seperator: {
    marginHorizontal: 10,
    color: 'grey',
  },
  gender: {
    color: 'grey',
  },
  lottieWrapper: {
    width: '100%',
    height: '100%',
  },
});
