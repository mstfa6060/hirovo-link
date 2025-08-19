import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { I18nextProvider } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { OneSignal } from 'react-native-onesignal';
import { Provider as PaperProvider } from 'react-native-paper';

import { getCurrentLocation } from './src/hooks/useLocation';
import { AnimalMarketAPI } from '@api/business_modules/animalmarket';
import i18n from './common/animalmarket-api/src/config/i18n';
import RootNavigator from './navigation/RootNavigator';
import { AppConfig } from '@config/animalmarket-config';
import { navigationRef, navigate } from './src/navigation/navigationRef';

// OneSignal App ID - app.json'dan alınan gerçek değer
const oneSignalAppId = 'd22118fa-f46c-496a-8ac9-34f2a8de29a1';

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<'Login' | 'Drawer' | 'RegisterWithPhone' | null>(null);

  const linking = {
    prefixes: ['animalmarket://', 'https://animalmarket.page.link'],
    config: {
      screens: {
        Login: 'login',
        Register: 'register',
        Drawer: 'drawer',
        AnimalDetail: {
          path: 'animals/:id',
          parse: { id: (id: string) => id },
        },
        ProfileEdit: 'profile-edit',
        FarmProfile: {
          path: 'farm/:id',
          parse: { id: (id: string) => id },
        },
        ResetPassword: {
          path: 'reset-password',
          parse: { token: (token: string) => token },
        },
      },
    },
  };
  useEffect(() => {
    // OneSignal'i başlat - React Native OneSignal v5.x için doğru API
    OneSignal.initialize(oneSignalAppId);

    // Bildirim izni iste
    OneSignal.Notifications.requestPermission(true);

    // Bildirim açıldığında çalışacak handler
    OneSignal.Notifications.addEventListener('click', (event) => {
      console.log("OneSignal: notification opened:", event);
      const data = event.notification.additionalData as { type?: string; animalId?: string };
      if (data?.type === 'animal-detail' && data?.animalId) {
        setTimeout(() => {
          navigate('AnimalDetail', { id: data.animalId! });
        }, 500);
      }
    });

    // Foreground'da bildirim geldiğinde çalışacak handler
    OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
      console.log("OneSignal: notification will show in foreground:", event);
      // Bildirimi göster
      event.getNotification().display();
    });

    const prepareApp = async () => {
      try {
        // i18n'in başlatılmasını bekle
        if (!i18n.isInitialized) {
          await new Promise<void>((resolve) => {
            i18n.on('initialized', () => resolve());
          });
        }

        // JWT token kontrol et
        const token = await AsyncStorage.getItem('jwt');
        setInitialRoute(token ? 'Drawer' : 'Login');

        if (token) {
          try {
            const decoded: any = jwtDecode(token);
            const userId = decoded?.nameid;

            if (userId) {
              // OneSignal kullanıcı ID'sini ayarla - v5.x API
              OneSignal.login(userId.toString());
              OneSignal.User.addTag('userId', String(userId));

              // Lokasyon bilgisini al ve gönder - AnimalMarket'te lokasyon API'si yok
              // Bu kısım şimdilik comment edildi
              try {
                const location = await getCurrentLocation();
                if (location) {
                  // TODO: AnimalMarket için lokasyon API'si eklendiğinde aktif edilecek
                  // await AnimalMarketAPI.Location.SetLocation.Request({
                  //   userId,
                  //   latitude: location.latitude,
                  //   longitude: location.longitude,
                  //   companyId: AppConfig.DefaultCompanyId,
                  // });
                  console.log('Lokasyon alındı:', location);
                }
              } catch (locationError) {
                console.warn('Lokasyon ayarlanırken hata:', locationError);
              }
            }
          } catch (jwtError) {
            console.warn('JWT decode hatası:', jwtError);
            // Token geçersizse login sayfasına yönlendir
            await AsyncStorage.removeItem('jwt');
            await AsyncStorage.removeItem('refreshToken');
            setInitialRoute('Login');
          }
        }
      } catch (error) {
        console.error('Uygulama hazırlanırken hata:', error);
        setInitialRoute('Login');
      } finally {
        setIsAppReady(true);
      }
    };

    prepareApp();
  }, []);

  if (!isAppReady || initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <I18nextProvider i18n={i18n}>
        <NavigationContainer linking={linking} ref={navigationRef}>
          <RootNavigator initialRoute={initialRoute} />
        </NavigationContainer>
      </I18nextProvider>
    </PaperProvider>
  );
}
