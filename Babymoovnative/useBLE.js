import {useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {BleManager, Device} from 'react-native-ble-plx';
import {btoa, atob} from 'react-native-quick-base64';

const bleManager = new BleManager();

// SERVICE DEVICE
const PRIMARY_SERVICE_AE00_UUID = '0000ae00-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_AE01_WRITE_WITHOUT_RESPONSE_UUID =
  '0000ae01-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_AE04_NOTIFY_UUID = '0000ae04-0000-1000-8000-00805f9b34fb';

// SWING GENERAL ACTION
const POWER_OFF = '55E1900000000000000000BB';

// MUSIC ACTION
const PLAY_PAUSE_MUSIC = '55E0A00000000000000000BB';
const PREVIOUS_MUSIC = '55E0A11000000000000000BB';
const NEXT_MUSIC = '55E0A10000000000000000BB';
const VOLUME_MINUS_MUSIC = '55E0A31000000000000000BB';
const VOLUME_PLUS_MUSIC = '55E0A30000000000000000BB';

//MOVEMENT ACTION
const SWING_ON = '55E1910100000000000000BB';
const SWING_OFF = '55E1910000000000000000BB';
const SWING_MODE_O = '55E1910101000000000000BB';
const SWING_MODE_U = '55E1910102000000000000BB';
const SWING_MODE_M = '55E1910103000000000000BB';
const SWING_MODE_8 = '55E1910104000000000000BB';
const SWING_MODE_H = '55E1910105000000000000BB';
const SWING_MODE_V = '55E1910106000000000000BB';
const SWING_MODE_MIX = '55E1910107000000000000BB';

export default function useBLE() {
  const [allDevices, setAllDevices] = useState([]);
  const [currentDevice, setConnectedDevice] = useState(null);
  const [status, setStatus] = useState('');

  const requestPermissions = async callback => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Bluetooth Low Energy requires Location',
          buttonNeutral: 'Ask Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      callback(granted === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      callback(true);
    }
  };

  const isDuplicteDevice = (devices, nextDevice) =>
    devices.findIndex(device => nextDevice.id === device.id) > -1;

  const scanForDevices = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('scanForDeviceserror');
        console.log(error);
      }
      if (device && device.name?.includes('BABYMOOV(BLE')) {
        setAllDevices(prevState => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });
  };

  const connectToDevice = async device => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      startStreamingData(deviceConnection);

      setStatus('CONNECT');
      console.log('Connecté');
    } catch (e) {
      setStatus('FAILED TO CONNECT');
      console.log('FAILED TO CONNECT', e);
    }
  };

  const disconnectFromDevice = () => {
    if (currentDevice) {
      bleManager.cancelDeviceConnection(currentDevice.id);
      setConnectedDevice(null);

      setStatus('DISCONNECT');
      console.log('Déconnecté');
    }
  };

  // ====== CONVERT FUNCTION FROM Base64 TO Hex ======
  const base64ToHex = str => {
    const raw = atob(str);
    let result = '';
    for (let i = 0; i < raw.length; i++) {
      const hex = raw.charCodeAt(i).toString(16);
      result += hex.length === 2 ? hex : '0' + hex;
    }
    return result.toUpperCase();
  };

  // ====== CONVERT FUNCTION FROM Hex TO Base64 ======
  const hexToBase64 = str => {
    return btoa(
      String.fromCharCode.apply(
        null,
        str
          .replace(/\r|\n/g, '')
          .replace(/([\da-fA-F]{2}) ?/g, '0x$1 ')
          .replace(/ +$/, '')
          .split(' '),
      ),
    );
  };

  // ====== GET DATA FROM THE DEVICE ======
  const startStreamingData = async device => {
    if (device) {
      device.monitorCharacteristicForService(
        PRIMARY_SERVICE_AE00_UUID,
        CHARACTERISTIC_AE04_NOTIFY_UUID,
        (error, characteristic) => onByteDevice(error, characteristic),
      );
    }
  };

  const onByteDevice = (error, characteristic) => {
    if (error) {
      console.log('error onHeartRateUpdate');
      console.log(error);
      return;
    } else if (!characteristic?.value) {
      console.log('No Data was recieved');
      return;
    }

    console.log(base64ToHex(characteristic.value));
  };

  // ====== WRITE_WITHOUT_RESPONSE MUSIC TO CONTROL THE DEVICE ======
  const previousMusicDisplayMusic = async device => {
    try {
      await bleManager.writeCharacteristicWithoutResponseForDevice(
        device.id,
        PRIMARY_SERVICE_AE00_UUID,
        CHARACTERISTIC_AE01_WRITE_WITHOUT_RESPONSE_UUID,
        hexToBase64(PREVIOUS_MUSIC),
      );
    } catch (e) {
      console.log('previousMusicDisplayMusic', e);
    }
  };

  const nextMusicDisplayMusic = async device => {
    try {
      await bleManager.writeCharacteristicWithoutResponseForDevice(
        device.id,
        PRIMARY_SERVICE_AE00_UUID,
        CHARACTERISTIC_AE01_WRITE_WITHOUT_RESPONSE_UUID,
        hexToBase64(NEXT_MUSIC),
      );
    } catch (e) {
      console.log('nextMusicDisplayMusic', e);
    }
  };

  const playPauseDisplayMusic = async device => {
    try {
      await bleManager.writeCharacteristicWithoutResponseForDevice(
        device.id,
        PRIMARY_SERVICE_AE00_UUID,
        CHARACTERISTIC_AE01_WRITE_WITHOUT_RESPONSE_UUID,
        hexToBase64(PLAY_PAUSE_MUSIC),
      );
    } catch (e) {
      console.log('playPauseDisplayMusic', e);
    }
  };

  const volumePlusDisplayMusic = async device => {
    try {
      await bleManager.writeCharacteristicWithoutResponseForDevice(
        device.id,
        PRIMARY_SERVICE_AE00_UUID,
        CHARACTERISTIC_AE01_WRITE_WITHOUT_RESPONSE_UUID,
        hexToBase64(VOLUME_PLUS_MUSIC),
      );
    } catch (e) {
      console.log('volumePlusDisplayMusic', e);
    }
  };

  const volumeMinusDisplayMusic = async device => {
    try {
      await bleManager.writeCharacteristicWithoutResponseForDevice(
        device.id,
        PRIMARY_SERVICE_AE00_UUID,
        CHARACTERISTIC_AE01_WRITE_WITHOUT_RESPONSE_UUID,
        hexToBase64(VOLUME_MINUS_MUSIC),
      );
    } catch (e) {
      console.log('volumeMinusDisplayMusic', e);
    }
  };

  // ====== WRITE_WITHOUT_RESPONSE GENERAL ACTION TO CONTROL THE DEVICE ======
  const powerOffDisplay = async device => {
    try {
      await bleManager.writeCharacteristicWithoutResponseForDevice(
        device.id,
        PRIMARY_SERVICE_AE00_UUID,
        CHARACTERISTIC_AE01_WRITE_WITHOUT_RESPONSE_UUID,
        hexToBase64(POWER_OFF),
      );
    } catch (e) {
      console.log('powerOffDisplay', e);
    }
  };

  // ====== WRITE_WITHOUT_RESPONSE MOVEMENT TO CONTROL THE DEVICE ======
  const swingOnDisplay = async device => {
    try {
      await bleManager.writeCharacteristicWithoutResponseForDevice(
        device.id,
        PRIMARY_SERVICE_AE00_UUID,
        CHARACTERISTIC_AE01_WRITE_WITHOUT_RESPONSE_UUID,
        hexToBase64(SWING_ON),
      );
    } catch (e) {
      console.log('swingOnDisplay', e);
    }
  };

  const swingOffDisplay = async device => {
    try {
      await bleManager.writeCharacteristicWithoutResponseForDevice(
        device.id,
        PRIMARY_SERVICE_AE00_UUID,
        CHARACTERISTIC_AE01_WRITE_WITHOUT_RESPONSE_UUID,
        hexToBase64(SWING_OFF),
      );
    } catch (e) {
      console.log('swingOffDisplay', e);
    }
  };

  const swingSwitchOMode = async device => {
    try {
      await bleManager.writeCharacteristicWithoutResponseForDevice(
        device.id,
        PRIMARY_SERVICE_AE00_UUID,
        CHARACTERISTIC_AE01_WRITE_WITHOUT_RESPONSE_UUID,
        hexToBase64(SWING_MODE_O),
      );
    } catch (e) {
      console.log('swingSwitchOMode', e);
    }
  };

  const swingSwitchUMode = async device => {
    try {
      await bleManager.writeCharacteristicWithoutResponseForDevice(
        device.id,
        PRIMARY_SERVICE_AE00_UUID,
        CHARACTERISTIC_AE01_WRITE_WITHOUT_RESPONSE_UUID,
        hexToBase64(SWING_MODE_U),
      );
    } catch (e) {
      console.log('swingSwitchUMode', e);
    }
  };

  const swingSwitchMMode = async device => {
    try {
      await bleManager.writeCharacteristicWithoutResponseForDevice(
        device.id,
        PRIMARY_SERVICE_AE00_UUID,
        CHARACTERISTIC_AE01_WRITE_WITHOUT_RESPONSE_UUID,
        hexToBase64(SWING_MODE_M),
      );
    } catch (e) {
      console.log('swingSwitchMMode', e);
    }
  };

  const swingSwitch8Mode = async device => {
    try {
      await bleManager.writeCharacteristicWithoutResponseForDevice(
        device.id,
        PRIMARY_SERVICE_AE00_UUID,
        CHARACTERISTIC_AE01_WRITE_WITHOUT_RESPONSE_UUID,
        hexToBase64(SWING_MODE_8),
      );
    } catch (e) {
      console.log('swingSwitch8Mode', e);
    }
  };

  const swingSwitchHMode = async device => {
    try {
      await bleManager.writeCharacteristicWithoutResponseForDevice(
        device.id,
        PRIMARY_SERVICE_AE00_UUID,
        CHARACTERISTIC_AE01_WRITE_WITHOUT_RESPONSE_UUID,
        hexToBase64(SWING_MODE_H),
      );
    } catch (e) {
      console.log('swingSwitchHMode', e);
    }
  };

  const swingSwitchVMode = async device => {
    try {
      await bleManager.writeCharacteristicWithoutResponseForDevice(
        device.id,
        PRIMARY_SERVICE_AE00_UUID,
        CHARACTERISTIC_AE01_WRITE_WITHOUT_RESPONSE_UUID,
        hexToBase64(SWING_MODE_V),
      );
    } catch (e) {
      console.log('swingSwitchVMode', e);
    }
  };

  const swingSwitchMixMode = async device => {
    try {
      await bleManager.writeCharacteristicWithoutResponseForDevice(
        device.id,
        PRIMARY_SERVICE_AE00_UUID,
        CHARACTERISTIC_AE01_WRITE_WITHOUT_RESPONSE_UUID,
        hexToBase64(SWING_MODE_MIX),
      );
    } catch (e) {
      console.log('swingSwitchMixMode', e);
    }
  };

  return {
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
  };
}
