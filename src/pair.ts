import axios from 'axios';
import { v4 as uuid } from 'uuid';
const { register, listen } = require('push-receiver');

var expoPushToken: string | null;
var steamAuthToken: string | null;

export const getExpoToken = async () => {
    console.log("Registering with FCM");
    const credentials = await register('976529667804');

    console.log("Fetching Expo Push Token");
    const response = await axios.post('https://exp.host/--/api/v2/push/getExpoPushToken', {
        deviceId: uuid(),
        experienceId: '@facepunch/RustCompanion',
        appId: 'com.facepunch.rust.companion',
        deviceToken: credentials.fcm.token,
        type: 'fcm',
        development: false,
    });

    expoPushToken = response.data.data.expoPushToken;
    console.log("Received Expo Push Token: " + expoPushToken);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

async function shutdown() {

    // unregister with Rust Companion API
    if(steamAuthToken){
        console.log("Unregistering from Rust Companion API");
        await axios.delete('https://companion-rust.facepunch.com:443/api/push/unregister', {
            data: {
                AuthToken: steamAuthToken,
                PushToken: expoPushToken,
                DeviceId: 'rustplus-api',
            },
        }).then((response) => {
            console.log("Successfully unregistered from Rust Companion API");
        }).catch((error) => {
            console.log(error);
        });
    }
    process.exit(0);
}