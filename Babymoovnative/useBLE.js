import {useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {BleManager, Device} from 'react-native-ble-plx';
import {btoa, atob} from 'react-native-quick-base64';

const bleManager = new BleManager();

const NEXT_MUSIC = '55E0A10000000000000000BB';

export default function useBLE() {
  const [allDevices, setAllDevices] = useState([]);
  const [currentDevice, setConnectedDevice] = useState(null);
  const [heartRate, setHeartRate] = useState(0);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  console.log('message', message);
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
      // bleManager.stopDeviceScan();
      startStreamingData(deviceConnection);
      console.log('Connecté');
      setStatus('CONNECT');
    } catch (e) {
      setStatus('FAILED TO CONNECT');
      console.log('FAILED TO CONNECT', e);
    }
  };

  const disconnectFromDevice = () => {
    if (currentDevice) {
      bleManager.cancelDeviceConnection(currentDevice.id);
      setConnectedDevice(null);
      setHeartRate(0);
      console.log('déconnecté');
    }
  };

  const startStreamingData = async device => {
    if (device) {
      device.monitorCharacteristicForService(
        '0000ae00-0000-1000-8000-00805f9b34fb',
        '0000ae04-0000-1000-8000-00805f9b34fb',
        (error, characteristic) => onHeartRateUpdate(error, characteristic),
      );
    }
  };

  const base64ToHex = str => {
    const raw = atob(str);
    let result = '';
    for (let i = 0; i < raw.length; i++) {
      const hex = raw.charCodeAt(i).toString(16);
      result += hex.length === 2 ? hex : '0' + hex;
    }
    return result.toUpperCase();
  };

  // Hex to Base64
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

  const startDisplayMusic = async device => {
    console.log(NEXT_MUSIC);
    console.log(hexToBase64(NEXT_MUSIC));
    try {
      await bleManager.writeCharacteristicWithoutResponseForDevice(
        device.id,
        '0000ae00-0000-1000-8000-00805f9b34fb',
        '0000ae01-0000-1000-8000-00805f9b34fb',
        hexToBase64('55E0A10000000000000000BB'), //55 E0 A0 00 00 00 00 00 00 00 00 BB
        //55 E0 A1 00 00 00 00 00 00 00 00 BB
      );
    } catch (e) {
      console.log(e);
    }
  };

  const onHeartRateUpdate = (error, characteristic) => {
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

  return {
    requestPermissions,
    connectToDevice,
    scanForDevices,
    disconnectFromDevice,
    startDisplayMusic,
    allDevices,
    currentDevice,
    heartRate,
    status,
  };
}
