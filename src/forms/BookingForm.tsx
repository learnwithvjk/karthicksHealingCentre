import React, {useState, useEffect, useContext} from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
// import PhoneInput from 'react-native-phone-number-input';
import {globalStyles} from 'src/styles/global';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {UserContext} from 'src/contexts/Context';
import Spinner from 'react-native-loading-spinner-overlay';
import {getVisitors} from 'src/api/Visitors';
import {getSlots} from 'src/api/Slots';
import {commonErrorHandler} from 'src/error-handling/commonErrorHanlders';
import OptionsModal from 'src/components/OptionsModal';
import {bookAppointment} from 'src/api/Bookings';
import RadioButtonGroup from 'src/components/RadioButtonGroup';
import {getClinicDetails} from 'src/api/HomeScreen';

let initialFormData = {
  visitor_id: '',
  cause: '',
  slot_date: '',
  slot_time: '',
  visit_type: '',
};
export default function BookingForm({navigation, route}: any) {
  // function handleChange(valueStr: string) {}
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [clinicDetails, setClinicDetails] = useState();
  const [isClinicDetailsLoading, setIsClinicDetailsLoading] = useState(true);

  const uid = useContext(UserContext);

  const [visitorData, setVisitorData] = useState([]);
  const [slotData, setSlotData] = useState([]);
  const {previousScreen} = route.params
    ? route.params
    : {previousScreen: undefined};

  async function reDirectToPreviousScreen(updatedContent = undefined) {
    console.log(previousScreen);
    console.log(updatedContent);
    if (previousScreen && updatedContent) {
      await navigation.navigate(previousScreen, {
        isNewBookingAdded: true,
        addedValue: updatedContent,
      });
    } else {
      console.log('back');
      // await navigation.navigate('BookingFormModal', {
      //   isUpdateForm: isUpdateForm,
      //   updatedValue: updatedContent,
      // });
      // if(previousScreen === 'MainScreen') {

      // }

      await navigation.goBack();
    }
  }
  async function submitForm(values: any) {
    console.log('submit pressed');
    console.log(values);
    setIsFormLoading(true);
    const payload = {
      bodyParams: {
        ...values,
        uid: uid,
      },
    };
    const postSubmitAction = async (appointment: any) => {
      Alert.alert("Bookings confirmed", undefined, [
        {text: 'OK', onPress: async () => await reDirectToPreviousScreen(appointment)},
      ]);
    };
    const setLoadingFalse = () => {
      setIsFormLoading(false);
    };
    const apiAction = async (apiMethod: Function) => {
      await apiMethod(payload)
        .then(postSubmitAction)
        .catch(commonErrorHandler)
        .finally(setLoadingFalse);
    };
    await apiAction(bookAppointment);

    setIsFormLoading(false);
    console.log('booking added');
  }

  const ruleForClinicVisit = Yup.object().shape({
    visitor_id: Yup.string().required('Required'),
    slot_date: Yup.string().required('Required'),
    slot_time: Yup.string().required('Required'),
    visit_type: Yup.string().required('Required'),
  });

  const ruleForOnlineVisit = Yup.object().shape({
    visitor_id: Yup.string().required('Required'),
    visit_type: Yup.string().required('Required'),
  });

  const [formRules, setFormRules] = useState(ruleForOnlineVisit);

  // const formRules = Yup.object().shape({
  //   visitor_id: Yup.string().required('Required'),
  //   //  cause: Yup.string().required('Required'),
  //   slot_date: Yup.string().required('Required'),
  //   slot_time: Yup.string().required('Required'),
  //   visit_type: Yup.string().required('Required'),
  // });

  const handleDateSelection = (
    selectedSlotIndex: number,
    setFormDateValue: Function,
    setFormSlotValue: Function,
  ) => {
    setFormSlotValue('');
    setSelectedDateIndex(selectedSlotIndex);
    setFormDateValue((slotData[selectedSlotIndex] as any).slot_date);
  };

  const handleTimeSelection = (value: string, setFormDateValue: Function) => {
    setFormDateValue(value);
  };

  useEffect(() => {
    console.log('VisitorListingScreen.tsx mounted');
    setIsFormLoading(true);
    const payload = {
      queryParams: {
        uid: uid,
      },
    };
    console.log('getting visitors');
    setIsClinicDetailsLoading(true);

    const getClinicDetail = getClinicDetails(payload).then(async clinics => {
      console.log('updating clinic to state');
      console.log(clinics);
      if (clinics[0]) {
        setClinicDetails(JSON.parse(JSON.stringify(clinics[0])));
      }
    });

    const getVisitorsInfo = getVisitors(payload).then(visitors => {
      console.log('visitor Data');
      console.log(visitors);
      setVisitorData(JSON.parse(JSON.stringify(visitors)));
    });

    const getSlotsInfo = getSlots().then(slots => {
      console.log('slot Data');
      console.log(slots);
      setSlotData(JSON.parse(JSON.stringify(slots)));
      initialFormData.slot_date = slots[0].slot_date;
    });

    Promise.all([getVisitorsInfo, getSlotsInfo, getClinicDetail])
      .catch(error => {
        console.log('visitorListingPageErr:' + error);
        commonErrorHandler(error);
      })
      .finally(() => {
        console.log('loading false');
        setIsFormLoading(false);
        setIsClinicDetailsLoading(false);
      });

    return () => {
      console.log('VisitorListingScreen.tsx initialized');
    };
  }, [uid]);
  useEffect(() => {
    console.log('reinit: BookingFormModal');
  }, [navigation, navigation.isUpdateForm]);

  const [isVisitorListVisible, setVisitorListVisibility] = useState(false);
  console.log('Init: BookingFormModal');
  console.log(isVisitorListVisible);
  async function navigateToVisitorsModal() {
    await navigation.navigate('MainScreen');
    await navigation.navigate('VisitorFormModal', {
      previousScreen: 'MainScreen',
    });
  }

  const dayArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  function handleVistorTypeSelection(
    selectedVisitType: string,
    setFormVisitType: Function,
  ) {
    if (selectedVisitType === 'online') {
      setFormRules(ruleForOnlineVisit);
    } else {
      setFormRules(ruleForClinicVisit);
    }
    console.log(selectedVisitType);
    setFormVisitType(selectedVisitType);
  }

  function getSelectedPhoneNumber(visitorId: string) {
    console.log(visitorData);
    console.log(visitorId);
    return visitorData.find((visitor: any) => visitorId === visitor.visitor_id)
      ?.phone_number;
  }

  return (
    <Modal onRequestClose={reDirectToPreviousScreen} visible={true}>
      <Spinner
        visible={isFormLoading}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
        cancelable
      />

      <TouchableOpacity
        style={styles.cancelImageWrapper}
        onPress={() => reDirectToPreviousScreen()}>
        <Image
          source={require('assets/pngs/cancel.png')}
          resizeMode="contain"
          // style={styles.cancelImage}
        />
      </TouchableOpacity>
      <View style={globalStyles.container}>
        <Formik
          validationSchema={formRules}
          initialValues={initialFormData}
          onSubmit={submitForm}>
          {({values, handleChange, handleSubmit, errors, touched}: any) => (
            <View style={styles.formContentWrapper}>
              <ScrollView style={styles.formInputsWrapper}>
                <TouchableOpacity
                  onPress={() => {
                    console.log('visitor clicked');
                    setVisitorListVisibility(true);
                  }}>
                  <Text
                    style={[
                      globalStyles.input,
                      values.visitor_id
                        ? styles.visitorSelectedText
                        : styles.placeHolder,
                      errors.visitor_id && touched.visitor_id
                        ? styles.textInputErr
                        : undefined,
                    ]}>
                    {values.visitor_id
                      ? `${
                          visitorData.find(
                            (visitor: any) =>
                              values.visitor_id === visitor.visitor_id,
                          )?.visitor_name
                        }`
                      : 'Visitor'}
                  </Text>
                  {errors.visitor_id && touched.visitor_id ? (
                    <Text style={styles.textErr}>{errors.visitor_id}</Text>
                  ) : null}
                </TouchableOpacity>
                {!isFormLoading && (
                  <OptionsModal
                    showMoal={isVisitorListVisible}
                    onClose={() => {
                      setVisitorListVisibility(false);
                    }}
                    options={visitorData}
                    optionLabel="visitor_name"
                    optionKey="visitor_id"
                    title="Select Visitors"
                    nodDataLabel="No visitors added yet"
                    addNewLabel="Add New Visitor"
                    onAddNew={() => {
                      setIsFormLoading(true);
                      setVisitorListVisibility(false);
                      navigateToVisitorsModal();
                    }}
                    // selectedValue={values.visitor_id}
                    onChange={handleChange('visitor_id')}
                  />
                )}

                <TextInput
                  style={[
                    globalStyles.input,
                    errors.cause && touched.cause
                      ? styles.textInputErr
                      : undefined,
                  ]}
                  multiline
                  placeholderTextColor="grey"
                  placeholder="Purpose of visit (optional)"
                  onChangeText={handleChange('cause')}
                  value={values.cause}
                />

                {errors.cause && touched.cause ? (
                  <Text style={styles.textErr}>{errors.cause}</Text>
                ) : null}

                <Text style={styles.inputHeader}>Visit Type:</Text>
                <RadioButtonGroup
                  options={[
                    {
                      label: 'Online Appointment',
                      optionKey: 'online',
                      color:
                        errors.visit_type && touched.visit_type
                          ? '#ff0000'
                          : undefined,
                    },
                    {
                      label: 'Clinic Appointment',
                      optionKey: 'clinic',
                      color:
                        errors.visit_type && touched.visit_type
                          ? '#ff0000'
                          : undefined,
                    },
                  ]}
                  value={values.visit_type}
                  onChange={selectedValue =>
                    handleVistorTypeSelection(
                      selectedValue,
                      handleChange('visit_type'),
                    )
                  }
                />
                {errors.visit_type && touched.visit_type ? (
                  <Text style={styles.textErr}>{errors.visit_type}</Text>
                ) : null}
                {values.visit_type === 'clinic' && (
                  <View>
                    <ScrollView horizontal={true}>
                      <View style={styles.availableDate}>
                        {slotData.map((date: any, index: number) => (
                          <TouchableOpacity
                            key={date.slot_date}
                            onPress={() =>
                              handleDateSelection(
                                index,
                                handleChange('slot_date'),
                                handleChange('slot_time'),
                              )
                            }
                            style={[
                              styles.dateWrapper,
                              values.slot_date === date.slot_date &&
                                styles.dateSelected,
                            ]}>
                            <Text
                              style={[
                                styles.dateText,
                                values.slot_date === date.slot_date &&
                                  styles.selectedDate,
                              ]}>
                              {new Date(date.slot_date).getDate()}
                            </Text>
                            <Text
                              style={[
                                styles.dateText,
                                values.slot_date === date.slot_date &&
                                  styles.selectedDate,
                              ]}>
                              {dayArr[new Date(date.slot_date).getDay()]}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>

                    <View style={styles.availableTime}>
                      {slotData &&
                        slotData.length !== 0 &&
                        (slotData[selectedDateIndex] as any).timings.map(
                          (timing: any) => (
                            <TouchableOpacity
                              key={timing.slot_time}
                              disabled={
                                (slotData[selectedDateIndex] as any)
                                  .is_holiday ||
                                timing.clinic_available_count <= 0
                              }
                              onPress={() =>
                                handleTimeSelection(
                                  timing.slot_time,
                                  handleChange('slot_time'),
                                )
                              }
                              style={[
                                styles.timingWrapper,
                                values.slot_time === timing.slot_time &&
                                  styles.selected,
                                ((slotData[selectedDateIndex] as any)
                                  .is_holiday ||
                                  timing.clinic_available_count <= 0) &&
                                  styles.notAvailableWrapper,
                              ]}>
                              <Text
                                style={[
                                  styles.timing,
                                  values.slot_time === timing.slot_time &&
                                    styles.selectedLabel,
                                  ((slotData[selectedDateIndex] as any)
                                    .is_holiday ||
                                    timing.clinic_available_count <= 0) &&
                                    styles.notAvailableLabel,
                                ]}>
                                {timing.slot_time}
                              </Text>

                              <Text
                                style={[
                                  styles.timingDesc,

                                  values.slot_time === timing.slot_time &&
                                    styles.selectedLabel,

                                  ((slotData[selectedDateIndex] as any)
                                    .is_holiday ||
                                    timing.clinic_available_count <= 0) &&
                                    styles.notAvailableDesc,

                                  values.slot_time === timing.slot_time &&
                                    styles.hidden,
                                ]}>
                                {values.slot_time === timing.slot_time
                                  ? ' '
                                  : (slotData[selectedDateIndex] as any)
                                      .is_holiday ||
                                    timing.clinic_available_count <= 0
                                  ? 'Not Available'
                                  : 'Available'}
                              </Text>
                            </TouchableOpacity>
                          ),
                        )}
                    </View>
                    {errors.slot_time && touched.slot_time ? (
                      <Text style={styles.textErr}>{errors.slot_time}</Text>
                    ) : null}
                  </View>
                )}
                {values.visit_type === 'online' && isClinicDetailsLoading && (
                  <ActivityIndicator size="large" color="#0000ff" />
                )}
                {values.visit_type === 'online' && !isClinicDetailsLoading && (
                  <View>
                    {!values.visitor_id && (
                      <Text style={styles.textErr}>Need to select visitor</Text>
                    )}
                    {!!values.visitor_id && (
                      <ScrollView>
                        <Text style={styles.onlineTitle}>
                          Follow the below steps for online booking:
                        </Text>
                        <Text style={styles.onlineDesc}>
                          {`1. Once you opted for a call we will get back to you at ${getSelectedPhoneNumber(
                            values.visitor_id,
                          )}`}
                        </Text>
                        <Text style={styles.onlineDesc}>
                          2. Schedule your date and time during this call
                        </Text>
                        <Text style={styles.onlineDesc}>
                          3. Make payment via any UPI service to confirm your
                          slot
                        </Text>
                        <Text style={styles.onlineDesc}>
                          4. Once confirmed, We will call you for healing
                        </Text>
                      </ScrollView>
                    )}
                  </View>
                )}
              </ScrollView>

              {/* {values.visit_type === 'clinic' && ( */}
              <View style={styles.submitButtonWrapper}>
                <TouchableOpacity
                  style={[styles.touchableWrapper, styles.shadow]}
                  onPress={handleSubmit}>
                  {values.visit_type === 'clinic' && (
                    <Text style={styles.submitButtonText}>Book now</Text>
                  )}
                  {values.visit_type === 'online' && (
                    <Text style={styles.submitButtonText}>Opt for Call</Text>
                  )}
                </TouchableOpacity>
              </View>
              {/* )} */}
            </View>
          )}
        </Formik>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  availableDate: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  availableTime: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    // maxWidth: 100,
  },
  timingWrapper: {
    // marginRight: 20,
    // marginBottom: 20,
    // marginTop: 20,
    // borderRadius: 5,
    // backgroundColor: '#c77373',
    // alignItems: 'center',
    // timingId: 'center',
    // width: '33%',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#f2fff2',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '48%',
    textAlign: 'center',
    borderWidth: 1,
  },
  dateWrapper: {
    marginRight: 10,
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 5,
    backgroundColor: '#fff', //#fff6f2
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 90,
  },
  timing: {
    // color: '#fff',
    // padding: 10,
    // timingId: 'center',
    // alignItems: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  dateText: {
    color: '#000',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '500',
  },
  submitButtonWrapper: {
    justifyContent: 'flex-end',
    marginTop: 30,
  },
  formInputsWrapper: {
    flex: 1,
  },
  formContentWrapper: {
    flex: 1,
  },
  selected: {
    backgroundColor: '#00790D',
    borderWidth: 0,
  },
  selectedLabel: {
    color: 'white',
  },
  dateSelected: {
    backgroundColor: '#ff4e0e',
    borderWidth: 0,
  },
  selectedDate: {
    color: 'white',
  },
  submitButtonText: {
    color: 'white',
    padding: 10,
    fontWeight: '500',
    fontSize: 24,
  },
  touchableWrapper: {
    backgroundColor: '#00790D',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
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
  inputHeader: {
    fontSize: 14,
    color: 'grey',
  },
  dateOfBirthWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dateField: {
    width: '100%',
  },
  cancelImage: {
    width: 40,
    height: 40,
  },
  cancelImageWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  label: {
    color: '#00790D',
    margin: 20,
    marginLeft: 0,
  },
  textErr: {
    color: '#ff0000',
  },
  textInputErr: {
    borderColor: '#ff0000',
  },
  phoneNumberContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#00790D',
    borderRadius: 5,
  },
  phoneNumberTextContainer: {
    borderLeftWidth: 0.5,
    backgroundColor: '#fff',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    padding: 0,
  },
  phoneNumberTextInput: {
    padding: 0,
  },
  phoneNumberCountryPicker: {
    padding: 0,
    margin: 0,
  },
  visitorSelectedText: {
    color: '#000',
  },
  timingDesc: {
    color: '#4abd5d',
  },
  hidden: {
    opacity: 0,
  },
  notAvailableWrapper: {
    backgroundColor: '#fff2f2',
    opacity: 0.5,
  },
  notAvailableDesc: {
    color: 'red',
  },
  onlineTitle: {
    color: '#ff4e0e',
    fontSize: 18,
    marginBottom: 10,
  },
  onlineDesc: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  placeHolder: {
    color: 'grey',
  },
});
