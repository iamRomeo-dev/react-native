import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import useBLE from './useBLE';

function App() {
  const {
    requestPermissions,
    connectToDevice,
    scanForDevices,
    disconnectFromDevice,
    previousMusicDisplayMusic,
    nextMusicDisplayMusic,
    playPauseDisplayMusic,
    volumePlusDisplayMusic,
    volumeMinusDisplayMusic,
    powerOffDisplay,
    swingOnDisplay,
    swingOffDisplay,
    swingSwitchOMode,
    swingSwitchUMode,
    swingSwitchMMode,
    swingSwitch8Mode,
    swingSwitchHMode,
    swingSwitchVMode,
    swingSwitchMixMode,
    allDevices,
    currentDevice,
    status,
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
      {/* ====== GENERAL ACTION ====== */}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            powerOffDisplay(allDevices[0]);
          }}
          style={styles.ctaOFFButton}>
          <Text style={styles.ctaButtonText}>Power Off</Text>
        </TouchableOpacity>
      )}
      {/* ====== MUSIC ====== */}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            previousMusicDisplayMusic(allDevices[0]);
          }}
          style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Previous music</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            nextMusicDisplayMusic(allDevices[0]);
          }}
          style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Next music</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            playPauseDisplayMusic(allDevices[0]);
          }}
          style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Play Stop music</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            volumePlusDisplayMusic(allDevices[0]);
          }}
          style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Volume +</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            volumeMinusDisplayMusic(allDevices[0]);
          }}
          style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Volume -</Text>
        </TouchableOpacity>
      )}
      {/* ====== MOVEMENT ====== */}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingOnDisplay(allDevices[0]);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Swing on or N</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingOffDisplay(allDevices[0]);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Swing off</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingSwitchOMode(allDevices[0]);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Swing switch O</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingSwitchUMode(allDevices[0]);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Swing switch U</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingSwitchMMode(allDevices[0]);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Swing switch M</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingSwitch8Mode(allDevices[0]);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Swing switch 8</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingSwitchHMode(allDevices[0]);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Swing switch H</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingSwitchVMode(allDevices[0]);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Swing switch V</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingSwitchMixMode(allDevices[0]);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Swing switch Mix</Text>
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
  ctaOFFButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaMovementButton: {
    backgroundColor: '#D79A2B',
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
