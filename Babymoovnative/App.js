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
import {Toto} from './Toto';
import useBLE from './useBLE';

function App() {
  const {
    requestPermissions,
    connectToDevice,
    scanForDevices,
    disconnectFromDevice,
    startDisplayMusic,
    allDevices,
    currentDevice,
    status,
    heartRate,
  } = useBLE();

  const openModal = async () => {
    requestPermissions(isGranted => {
      if (isGranted) {
        scanForDevices();
      }
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heartRateTitleWrapper}>
        {currentDevice ? (
          <Text style={styles.heartRateTitleText}>{status}</Text>
        ) : (
          <Text style={styles.heartRateTitleText}>
            Please connect to the baby swing
          </Text>
        )}
      </View>
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            connectToDevice(allDevices[0]);
          }}
          style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>
            {allDevices[0]?.name} {currentDevice && ' - connecté'}
          </Text>
        </TouchableOpacity>
      )}

      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            startDisplayMusic(allDevices[0]);
          }}
          style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Play music</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={currentDevice ? disconnectFromDevice : openModal}
        style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>
          {currentDevice ? 'Disconnect' : 'Scan'}
        </Text>
      </TouchableOpacity>
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
