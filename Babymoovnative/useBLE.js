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
export const POWER_OFF = '55E1900000000000000000BB';

// MUSIC ACTION
export const PLAY_PAUSE_MUSIC = '55E0A00000000000000000BB';
export const PREVIOUS_MUSIC = '55E0A11000000000000000BB';
export const NEXT_MUSIC = '55E0A10000000000000000BB';
export const VOLUME_MINUS_MUSIC = '55E0A31000000000000000BB';
export const VOLUME_PLUS_MUSIC = '55E0A30000000000000000BB';

//MOVEMENT ACTION
export const SWING_ON = '55E1910100000000000000BB';
export const SWING_OFF = '55E1910000000000000000BB';
export const SWING_MODE_O = '55E1910101000000000000BB';
export const SWING_MODE_U = '55E1910102000000000000BB';
export const SWING_MODE_M = '55E1910103000000000000BB';
export const SWING_MODE_8 = '55E1910104000000000000BB';
export const SWING_MODE_H = '55E1910105000000000000BB';
export const SWING_MODE_V = '55E1910106000000000000BB';
export const SWING_MODE_MIX = '55E1910107000000000000BB';

//MOVEMENT SPEED
export const SPEED_OFF = '55E1920000000000000000BB';
export const SPEED_1 = '55E1920100000000000000BB';
export const SPEED_2 = '55E1920200000000000000BB';
export const SPEED_3 = '55E1920300000000000000BB';
export const SPEED_4 = '55E1920400000000000000BB';
export const SPEED_5 = '55E1920500000000000000BB';

//TIMER
export const TIMER_NONE = '55E1930000000000000000BB';
export const TIMER_10_MIN = '55E1930100000000000000BB';
export const TIMER_20_MIN = '55E1930200000000000000BB';
export const TIMER_30_MIN = '55E1930300000000000000BB';

//TIMER
export const CRY_DETECTION_SWITCH = '55E1940000000000000000BB';

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

  // ====== WRITE_WITHOUT_RESPONSE TO CONTROL THE DEVICE ======
  const swingActionDisplay = async (device, bytes) => {
    try {
      await bleManager.writeCharacteristicWithoutResponseForDevice(
        device.id,
        PRIMARY_SERVICE_AE00_UUID,
        CHARACTERISTIC_AE01_WRITE_WITHOUT_RESPONSE_UUID,
        hexToBase64(bytes),
      );
    } catch (e) {
      console.log('swingActionDisplay', e);
    }
  };

  return {
    requestPermissions,
    connectToDevice,
    scanForDevices,
    disconnectFromDevice,
    swingActionDisplay,
    allDevices,
    currentDevice,
    status,
  };
}
