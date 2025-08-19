import React, { useEffect } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/RootNavigator';
import { IAMAPI } from '@api/base_modules/iam';
import { AppConfig } from '@config/animalmarket-config';

// ✅ Google tipi eklendi (sadece bu eklendi)
type GoogleUser = {
  email: string;
  familyName?: string;
  givenName?: string;
  id: string;
  name: string;
  photo?: string;
};

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: AppConfig.GoogleWebClientId,
      offlineAccess: true,
      scopes: ['profile', 'email'],
    });

  }, []);

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { user, idToken } = userInfo.data as { user: GoogleUser; idToken: string };

      if (!idToken || !user?.email) {
        Alert.alert('Hata', 'Google oturum açma başarısız.');
        return;
      }

      const {
        email,
        givenName = '',
        familyName = '',
        id: providerId,
      } = user;

      const newUserData = {
        userName: email,
        firstName: givenName,
        surname: familyName,
        email,
        password: Math.random().toString(36).slice(-10),
        providerId,
        // userType: IAMAPI.Enums.UserType.WorkerAndEmployer, // TODO: Fix UserType enum
        companyId: AppConfig.DefaultCompanyId,
        userSource: IAMAPI.Enums.UserSources.Google,
        description: '',
      };

      const loginData = {
        provider: 'google',
        userName: email,
        password: '',
        token: idToken,
        platform: IAMAPI.Enums.ClientPlatforms.Mobile,
        isCompanyHolding: false,
        companyId: AppConfig.DefaultCompanyId,
        firstName: givenName,
        surname: familyName,
        phoneNumber: '0000000000',
        birthDate: new Date('1990-01-01'),
        externalProviderUserId: providerId,
      };

      let authResponse;
      try {
        authResponse = await IAMAPI.Auth.Login.Request(loginData);
      } catch (loginErr: any) {
        if (loginErr.response?.status === 404) {
          await IAMAPI.Users.Create.Request(newUserData);
          authResponse = await IAMAPI.Auth.Login.Request(loginData);
        } else {
          const backendMessage =
            loginErr?.response?.data?.messageCode || loginErr?.message || 'Bilinmeyen hata';
          Alert.alert('Giriş Hatası', backendMessage);
          return;
        }
      }

      if (!authResponse?.jwt) {
        Alert.alert('Hata', 'Sunucudan geçerli yanıt alınamadı.');
        return;
      }

      await AsyncStorage.setItem('jwt', authResponse.jwt);
      await AsyncStorage.setItem('refreshToken', authResponse.refreshToken);
      await AsyncStorage.setItem('sessionExpirationDate', authResponse.sessionExpirationDate.toString());

      const userDetail = await IAMAPI.Users.Detail.Request({
        userId: authResponse.user.id,
        companyId: authResponse.user.companyId,
      });

      const phoneMissing =
        !userDetail.phoneNumber || userDetail.phoneNumber === '0000000000';
      const birthDateMissing =
        !userDetail.birthDate || new Date(userDetail.birthDate).getFullYear() === 1990;

      if (phoneMissing || birthDateMissing) {
        navigation.navigate('RegisterWithPhone', { fromLogin: true });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Drawer' }],
        });
      }
    } catch (err) {
      console.error('Google login genel hata:', err);
      Alert.alert('Hata', 'Google ile giriş yapılamadı.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Google ile Giriş Yap" onPress={handleGoogleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default LoginScreen;
