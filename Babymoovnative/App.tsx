/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import {Device} from 'react-native-ble-plx';

import DeviceModal from './DeviceConnectionModal';
import useBLE from './useBLE';

function App(): JSX.Element {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const {
    requestPermissions,
    connectToDevice,
    scanForDevices,
    disconnectFromDevice,
    allDevices,
    currentDevice,
    heartRate,
  } = useBLE();

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    requestPermissions((isGranted: boolean) => {
      if (isGranted) {
        scanForDevices();
        setIsModalVisible(true);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heartRateTitleWrapper}>
        {currentDevice ? (
          <Text style={styles.heartRateTitleText}>Connected</Text>
        ) : (
          <Text style={styles.heartRateTitleText}>
            Please connectto the baby swing
          </Text>
        )}
        {/* {allDevices.map((device: Device) => (
          <Text>{device.name}</Text>
        ))} */}
      </View>
      <TouchableOpacity
        onPress={currentDevice ? disconnectFromDevice : openModal}
        style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>
          {currentDevice ? 'Disconnect' : 'Connect'}
        </Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
    color: 'black',
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
  ctaButton: {
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default App;
