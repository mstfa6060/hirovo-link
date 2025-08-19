import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeTabs from './HomeTabs';
import AnimalDetailScreen from '../screens/AnimalDetailScreen';
import DrawerNavigator, { DrawerParamList } from './DrawerNavigator';
import SignUpScreen from '../screens/SignUpScreen';
import ProfileForm from '../screens/Profile/ProfileForm';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import RegisterWithPhoneScreen from '../screens/RegisterWithPhoneScreen';
import OtpVerificationScreen from '../screens/OtpVerificationScreen';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Drawer: {
        screen?: keyof DrawerParamList;
        params?: object;
    };
    HomeTabs: undefined;
    AnimalDetail: { id: string };
    ProfileForm: { fromLogin?: boolean };
    ForgotPassword: undefined;
    ResetPassword: { token: string };
    ChangePassword: undefined;
    OtpVerificationScreen: { phoneNumber: string; otpCode: string };
    RegisterWithPhone: { fromLogin?: boolean };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type RootNavigatorProps = {
    initialRoute: keyof RootStackParamList;
};

const RootNavigator = ({ initialRoute }: RootNavigatorProps) => {
    return (
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={SignUpScreen} />
            <Stack.Screen name="Drawer" component={DrawerNavigator} />
            <Stack.Screen name="AnimalDetail" component={AnimalDetailScreen} />
            <Stack.Screen name="ProfileForm" component={ProfileForm} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <Stack.Screen name="RegisterWithPhone" component={RegisterWithPhoneScreen} />
            <Stack.Screen name="OtpVerificationScreen" component={OtpVerificationScreen} />
        </Stack.Navigator>
    );
};

export default RootNavigator;
