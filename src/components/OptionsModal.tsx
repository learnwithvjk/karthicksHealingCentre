import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import NoDataComponent from 'src/components/NoDataComponent';

export default function OptionsModal({
  showMoal,
  onClose,
  options,
  optionLabel,
  title,
  addNewLabel,
  onChange,
  onAddNew,
  optionKey,
  nodDataLabel,
}: any) {
  const ItemView = ({item, key, index}: any) => {
    console.log(key);
    return (
      <TouchableOpacity
        onPress={() => {
          console.log(options[index][optionKey]);
          onChange(options[index][optionKey]);
          onClose();
        }}>
        <View style={styles.labelWrapper}>
          <Text ellipsizeMode="tail" style={styles.label}>
            {item[optionLabel]}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal onRequestClose={onClose} transparent visible={showMoal}>
      <View style={styles.optionsListWrapper}>
        <TouchableOpacity
          onPress={() => {
            onClose();
          }}>
          <Image
            source={require('assets/pngs/cancel.png')}
            resizeMode="contain"
            // style={styles.cancelImage}
          />
        </TouchableOpacity>

        <View style={styles.optionsListContainer}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}> {title} </Text>
          </View>
          <View style={styles.listingWrapper}>
            {options && options.length ? (
              <FlatList
                data={options}
                renderItem={ItemView}
                extraData={ItemView}
                initialNumToRender={0}
                keyExtractor={item => item.visitor_id}
              />
            ) : (
              <NoDataComponent label={nodDataLabel} />
            )}
          </View>
          <TouchableOpacity
            onPress={() => {
              onAddNew();
            }}
            style={styles.addNewButtonWrapper}>
            <Text style={styles.addNewLabel}> {addNewLabel} </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  titleWrapper: {
    alignItems: 'center',
    padding: 20,
    borderBottomColor: '#00790D',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00790D',
  },
  optionsListWrapper: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    maxHeight: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsListContainer: {
    justifyContent: 'flex-start',
    display: 'flex',
    flex: 1,
    width: '80%',
    height: '70%',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 20,
    maxHeight: Dimensions.get('window').height / 1.5,
  },
  listingWrapper: {
    flex: 1,
    marginTop: 10,
  },
  labelWrapper: {
    paddingVertical: 10,
    borderBottomColor: '#00790D',
    borderBottomWidth: 1,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 18,
    color: '#444',
  },
  addNewButtonWrapper: {
    backgroundColor: '#00790D',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewLabel: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
});
