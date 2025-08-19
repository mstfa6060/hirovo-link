// @config/animalmarket-config.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AxiosInstance = ReturnType<typeof axios.create>;

export const api: AxiosInstance = axios.create({
  baseURL: 'https://api.animalmarket.com',
  timeout: 10000
});

// 🔐 Tüm isteklere token ekle
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('jwt');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


export const AppConfig = {
  BaseApi: "https://api.animalmarket.com/",
  AnimalMarketUrl: 'https://api.animalmarket.com/animalmarket',
  IAMUrl: 'https://api.animalmarket.com/iam',
  FileProviderUrl: 'https://api.animalmarket.com/fileprovider',
  OneSignalAppId: '', // TODO: Set your OneSignal App ID here
  // GoogleIosClientId: '88926208060-det9u39oljigc6l96j1qn9lqt4em4bh6.apps.googleusercontent.com',
  // GoogleAndroidClientId: '88926208060-3vevirik4i74peebrqne4i0i680gbb8n.apps.googleusercontent.com',
  GoogleWebClientId: '88926208060-rpeal44o63rpqcojr94bdlannd1vko4t.apps.googleusercontent.com', // Doğru Firebase Web Client ID
  DefaultCompanyId: 'c9d8c846-10fc-466d-8f45-a4fa4e856abd',
  // ExpoClientId: "88926208060-rpeal44o63rpqcojr94bdlannd1vko4t.apps.googleusercontent.com"
};

