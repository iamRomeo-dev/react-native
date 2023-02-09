import {useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {BleManager, Device} from 'react-native-ble-plx';
import {btoa, atob} from 'react-native-quick-base64';

const bleManager = new BleManager();

export default function useBLE() {
  const [allDevices, setAllDevices] = useState([]);
  const [currentDevice, setConnectedDevice] = useState(null);
  const [heartRate, setHeartRate] = useState(0);
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
      // bleManager.stopDeviceScan();
      startStreamingData(deviceConnection);
      console.log('Connecté');
      setStatus('CONNECT');
    } catch (e) {
      console.log('FAILED TO CONNECT', e);
      setStatus('FAILED TO CONNECT');
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
    console.log('startStreamingData');
    if (device) {
      // device.monitorCharacteristicForService(
      //   'AE00',
      //   'AE04',
      //   (error, characteristic) => onHeartRateUpdate(error, characteristic),
      // );
      bleManager
        .writeCharacteristicWithoutResponseForDevice(
          device.id,
          'AE00',
          'AE01',
          btoa('55E0A000000000000000BB'),
        )
        .then(res => {
          console.log('tototo');
          console.log(res.value);
          return res.value;
        });
    } else {
      console.log('No Device Connected');
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
    console.log('rawData1111');
    const rawData = atob(characteristic.value);
    console.log('rawData', rawData);
    let innerHeartRate = -1;

    const firstBitValue = Number(rawData) & 0x01;

    if (firstBitValue === 0) {
      innerHeartRate = rawData[1].charCodeAt(0);
    } else {
      innerHeartRate =
        Number(rawData[1].charCodeAt(0) << 8) +
        Number(rawData[2].charCodeAt(2));
    }

    setHeartRate(innerHeartRate);
  };

  return {
    requestPermissions,
    connectToDevice,
    scanForDevices,
    disconnectFromDevice,
    allDevices,
    currentDevice,
    heartRate,
    status,
  };
}
