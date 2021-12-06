import React, {useState, useContext} from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
// import PhoneInput from 'react-native-phone-number-input';
import {globalStyles} from 'src/styles/global';
import {Formik} from 'formik';
import RadioButtonGroup from 'src/components/RadioButtonGroup';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import * as Yup from 'yup';
import Spinner from 'react-native-loading-spinner-overlay';
import {addVisitor, updateVisitor} from 'src/api/Visitors';
import {UserContext} from 'src/contexts/Context';
import {commonErrorHandler} from 'src/error-handling/commonErrorHanlders';

export default function VisitorForm({route, navigation}: any) {
  // function handleChange(valueStr: string) {}
  const {formData, previousScreen} = route.params
    ? route.params
    : {formData: undefined, previousScreen: undefined};
  const [isLoading, setIsLoading] = useState(false);
  const uid = useContext(UserContext);
  const isUpdateForm = !!formData;

  async function reDirectToPreviousScreen(updatedContent = undefined) {
    if (previousScreen && updatedContent) {
      await navigation.navigate(previousScreen, {
        isUpdateForm: isUpdateForm,
        updatedValue: updatedContent,
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
    setIsLoading(true);
    const payload = {
      bodyParams: {
        ...values,
        visitor_id: isUpdateForm ? formData.visitor_id : undefined,
        uid: uid,
      },
    };
    const postSubmitAction = async (visitor: any) => {
      Alert.alert("Visitor added", undefined, [
        {text: 'OK', onPress: async () => await reDirectToPreviousScreen(visitor)},
      ]);
    };
    const setLoadingFalse = () => {
      setIsLoading(false);
    };
    const apiAction = async (apiMethod: Function) => {
      await apiMethod(payload)
        .then(postSubmitAction)
        .catch(commonErrorHandler)
        .finally(setLoadingFalse);
    };
    if (isUpdateForm) {
      await apiAction(updateVisitor);
    } else {
      await apiAction(addVisitor);
    }
  }

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [tempDate, setTempdDate] = useState(
    formData
      ? new Date(formData.date_of_birth)
      : (undefined as unknown as Date),
  );

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date, setFormDateValue: Function) => {
    try {
      const newDate = moment(date.toISOString()).format('MM/DD/YYYY');
      setFormDateValue(newDate);
      setTempdDate(date);
      hideDatePicker();
    } catch (err) {
      console.log('error on date picker selection');
      console.log(err);
    }
  };

  const initialFormData = {
    phone_number:
      formData && formData!.phone_number ? formData!.phone_number : '',
    visitor_name:
      formData && formData!.visitor_name ? formData!.visitor_name : '',
    gender: formData && formData!.gender ? formData!.gender : '',
    date_of_birth:
      formData && formData!.date_of_birth
        ? formData!.date_of_birth
        : (undefined as unknown as Date),
  };
  const maxDate = new Date();
  // The below is for testing data
  // const initialFormData = {
  //   phone_number:
  //     formData && formData!.phone_number
  //       ? formData!.phone_number
  //       : '0000000000',
  //   visitor_name:
  //     formData && formData!.visitor_name ? formData!.visitor_name : 'ff',
  //   gender: formData && formData!.gender ? formData!.gender : 'm',
  //   date_of_birth:
  //     formData && formData!.date_of_birth
  //       ? formData!.date_of_birth
  //       : new Date(),
  // };

  const formRules = Yup.object().shape({
    visitor_name: Yup.string().required('Required'),
    date_of_birth: Yup.string().required('Required'),
    phone_number: Yup.string()
      .trim()
      .min(10, 'invalid phone number')
      .max(13, 'invalid phone number')
      // .matches(
      //   /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      //   'invalid phone number',
      // )
      .required('Required'),
    gender: Yup.string().required('Required'),
  });

  return (
    <Modal onRequestClose={() => reDirectToPreviousScreen()} visible={true}>
      <Spinner
        visible={isLoading}
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
      <ScrollView>
        <View style={globalStyles.container}>
          <Formik
            validationSchema={formRules}
            initialValues={initialFormData}
            onSubmit={submitForm}>
            {({values, handleChange, handleSubmit, errors, touched}: any) => (
              <View>
                <TextInput
                  style={[
                    globalStyles.input,
                    errors.visitor_name && touched.visitor_name
                      ? styles.textInputErr
                      : undefined,
                  ]}
                  placeholderTextColor="grey"
                  placeholder="Name"
                  onChangeText={handleChange('visitor_name')}
                  value={values.visitor_name}
                />
                {errors.visitor_name && touched.visitor_name ? (
                  <Text style={styles.textErr}>{errors.visitor_name}</Text>
                ) : null}

                <TextInput
                  style={[
                    globalStyles.input,
                    errors.phone_number && touched.phone_number
                      ? styles.textInputErr
                      : undefined,
                  ]}
                  multiline
                  placeholderTextColor="grey"
                  placeholder="Phone Number (Ex: +91XXXXXXXXXX)"
                  onChangeText={handleChange('phone_number')}
                  keyboardType="numeric"
                  value={values.phone_number}
                />
                {/* <PhoneInput
                  defaultValue={values.phone_number}
                  defaultCode="IN"
                  layout="first"
                  containerStyle={[
                    styles.phoneNumberContainer,
                    errors.phone_number && touched.phone_number
                      ? styles.textInputErr
                      : undefined,
                  ]}
                  textContainerStyle={styles.phoneNumberTextContainer}
                  textInputStyle={styles.phoneNumberTextInput}
                  countryPickerButtonStyle={styles.phoneNumberCountryPicker}
                  onChangeFormattedText={handleChange('phone_number')}
                /> */}

                {errors.phone_number && touched.phone_number ? (
                  <Text style={styles.textErr}>{errors.phone_number}</Text>
                ) : null}

                <TouchableWithoutFeedback onPress={showDatePicker}>
                  <Text
                    style={[
                      globalStyles.input,
                      values.date_of_birth
                        ? styles.dateSelectedText
                        : styles.placeHolder,
                      errors.date_of_birth && touched.date_of_birth
                        ? styles.textInputErr
                        : undefined,
                    ]}>
                    {values.date_of_birth
                      ? `${new Date(values.date_of_birth).getDate()}-${
                          new Date(values.date_of_birth).getMonth() + 1
                        }-${new Date(values.date_of_birth).getFullYear()}`
                      : 'Date of birth'}
                  </Text>
                </TouchableWithoutFeedback>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  maximumDate={maxDate}
                  date={tempDate}
                  onConfirm={(newDate: Date) =>
                    handleConfirm(newDate, handleChange('date_of_birth'))
                  }
                  onCancel={hideDatePicker}
                />
                {errors.date_of_birth && touched.date_of_birth ? (
                  <Text style={styles.textErr}>{errors.date_of_birth}</Text>
                ) : null}

                <Text style={styles.inputHeader}>Gender:</Text>
                <RadioButtonGroup
                  options={[
                    {
                      label: 'Male',
                      optionKey: 'm',
                      color:
                        errors.gender && touched.gender ? '#ff0000' : undefined,
                    },
                    {
                      label: 'Female',
                      optionKey: 'f',
                      color:
                        errors.gender && touched.gender ? '#ff0000' : undefined,
                    },
                    {
                      label: 'Others',
                      optionKey: 'o',
                      color:
                        errors.gender && touched.gender ? '#ff0000' : undefined,
                    },
                  ]}
                  value={values.gender}
                  onChange={handleChange('gender')}
                />
                {errors.gender && touched.gender ? (
                  <Text style={styles.textErr}>{errors.gender}</Text>
                ) : null}

                <View style={styles.submitButtonWrapper}>
                  <TouchableOpacity
                    style={[styles.touchableWrapper, styles.shadow]}
                    onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>
                      {isUpdateForm ? 'Update visitor' : 'Add visitor'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  availableDate: {
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
    backgroundColor: 'oldlace',
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '48%',
    textAlign: 'center',
  },
  dateWrapper: {
    marginRight: 10,
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 5,
    backgroundColor: '#fffeee',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 90,
  },
  timing: {
    // color: '#fff',
    // padding: 10,
    // timingId: 'center',
    // alignItems: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
  date: {
    color: '#000',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '500',
  },
  submitButtonWrapper: {
    justifyContent: 'flex-end',
    marginTop: 100,
  },
  selected: {
    backgroundColor: 'coral',
    borderWidth: 0,
  },
  selectedLabel: {
    color: 'white',
  },
  dateSelected: {
    backgroundColor: '#00790D',
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
  dateSelectedText: {
    color: '#000',
  },
  placeHolder: {
    color: 'grey',
  },
});
