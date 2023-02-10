import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import useBLE, {
  CRY_DETECTION_SWITCH,
  NEXT_MUSIC,
  PLAY_PAUSE_MUSIC,
  POWER_OFF,
  PREVIOUS_MUSIC,
  SPEED_1,
  SPEED_2,
  SPEED_3,
  SPEED_4,
  SPEED_5,
  SWING_MODE_8,
  SWING_MODE_H,
  SWING_MODE_M,
  SWING_MODE_MIX,
  SWING_MODE_O,
  SWING_MODE_U,
  SWING_MODE_V,
  SWING_OFF,
  SWING_ON,
  TIMER_10_MIN,
  TIMER_20_MIN,
  TIMER_30_MIN,
  TIMER_NONE,
  VOLUME_MINUS_MUSIC,
  VOLUME_PLUS_MUSIC,
} from './useBLE';

function App() {
  const {
    requestPermissions,
    connectToDevice,
    scanForDevices,
    disconnectFromDevice,
    swingActionDisplay,
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
      {/* {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], POWER_OFF);
          }}
          style={styles.ctaOFFButton}>
          <Text style={styles.ctaButtonText}>Power Off</Text>
        </TouchableOpacity>
      )} */}
      {/* ====== MUSIC ====== */}
      {/* {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], PREVIOUS_MUSIC);
          }}
          style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Previous music</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], NEXT_MUSIC);
          }}
          style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Next music</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], PLAY_PAUSE_MUSIC);
          }}
          style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Play Pause music</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], VOLUME_PLUS_MUSIC);
          }}
          style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Volume +</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], VOLUME_MINUS_MUSIC);
          }}
          style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Volume -</Text>
        </TouchableOpacity>
      )} */}
      {/* ====== MOVEMENT ====== */}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], SWING_ON);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Swing on or N</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], SWING_OFF);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Swing off</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], SWING_MODE_O);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Swing switch O</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], SWING_MODE_U);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Swing switch U</Text>
        </TouchableOpacity>
      )}
      {/* {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], SWING_MODE_M);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Swing switch M</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], SWING_MODE_8);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Swing switch 8</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], SWING_MODE_H);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Swing switch H</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], SWING_MODE_V);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Swing switch V</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], SWING_MODE_MIX);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Swing switch Mix</Text>
        </TouchableOpacity>
      )} */}
      {/* ====== SPEED ====== */}
      {/* {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], SPEED_1);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Swing speed 1</Text>
        </TouchableOpacity>
      )} 

      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], SPEED_2);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Swing speed 2</Text>
        </TouchableOpacity>
      )}

      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], SPEED_3);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Swing speed 3</Text>
        </TouchableOpacity>
      )}

      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], SPEED_4);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Swing speed 4</Text>
        </TouchableOpacity>
      )}

      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], SPEED_5);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Swing speed 5</Text>
        </TouchableOpacity>
      )} */}
      {/* ====== TIMER ====== */}
      {/* {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], TIMER_NONE);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Timer none</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], TIMER_10_MIN);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Timer 10</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], TIMER_20_MIN);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Timer 20</Text>
        </TouchableOpacity>
      )}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], TIMER_30_MIN);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Timer 30</Text>
        </TouchableOpacity>
      )} */}
      {/* ====== CRY DETECTION SWITCH ====== */}
      {allDevices.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            swingActionDisplay(allDevices[0], CRY_DETECTION_SWITCH);
          }}
          style={styles.ctaMovementButton}>
          <Text style={styles.ctaButtonText}>Cry detection button</Text>
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
