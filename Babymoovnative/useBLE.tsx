import {useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {BleManager, Device} from 'react-native-ble-plx';
import {btoa, atob} from 'react-native-quick-base64';

type PermissionCallback = (result: boolean) => void;

const bleManager = new BleManager();

interface BluetoothLowEnergyApi {
  requestPermissions(callback: PermissionCallback): Promise<void>;
  connectToDevice(device: Device): Promise<void>;
  connectToDevice: (deviceId: Device) => Promise<void>;
  scanForDevices(): void;
  disconnectFromDevice: () => void;
  currentDevice: Device | null;
  heartRate: number;
  allDevices: Device[];
}

export default function useBLE(): BluetoothLowEnergyApi {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [currentDevice, setConnectedDevice] = useState<Device | null>(null);
  const [heartRate, setHeartRate] = useState<number>(0);

  const requestPermissions = async (callback: PermissionCallback) => {
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

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex(device => nextDevice.id === device.id) > -1;

  const scanForDevices = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (device && device.name?.includes('BABYMOOV')) {
        setAllDevices(prevState => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });
  };

  // const connectToDevice = async (device: Device) => {
  //   try {
  //     const deviceConnection = await bleManager.connectToDevice(device.id);
  //     setConnectedDevice(deviceConnection);
  //     await deviceConnection.discoverAllServicesAndCharacteristics();
  //     startStreamingData(device);
  //   } catch (e) {
  //     console.log('FAILED TO CONNECT', e);
  //   }
  // };

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      startStreamingData(deviceConnection);
      console.log('Connecté');
    } catch (e) {
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

  // const startStreamingData = async (device: Device) => {
  //   console.log('1234');
  //   if (device) {
  //     device.monitorCharacteristicForService('AE00', 'AE01', onHeartRateUpdate);
  //     device
  //       .writeCharacteristicWithResponseForService(
  //         'AE00',
  //         'AE01',
  //         btoa('55E0A000000000000000BB'),
  //       )
  //       .then(characteristic => {
  //         console.log('aaaaaaaa', characteristic.value);
  //         return;
  //       });
  //   } else {
  //     console.log('No Device Connected');
  //   }
  // };

  const startStreamingData = async (device: Device) => {
    console.log('startStreamingData');
    if (device) {
      device.monitorCharacteristicForService(
        'AE00',
        'AE01',
        (error, characteristic) => onHeartRateUpdate(error, characteristic),
      );
    } else {
      console.log('No Device Connected');
    }
  };

  const onHeartRateUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null,
  ) => {
    if (error) {
      console.log(error);
      return;
    } else if (!characteristic?.value) {
      console.log('No Data was recieved');
      return;
    }

    const rawData = atob(characteristic.value);
    console.log('rawData', rawData);
    let innerHeartRate: number = -1;

    const firstBitValue: number = Number(rawData) & 0x01;

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
  };
}
