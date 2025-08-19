import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeTabs from './HomeTabs';
import ProfileForm from '../screens/Profile/ProfileForm';
import { useTranslation } from 'react-i18next';
import CustomDrawerContent from '../components/CustomDrawerContent';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

export type DrawerParamList = {
    HomeTabs: undefined;
    ProfileEdit: undefined;
    ChangePassword: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = () => {
    const { t } = useTranslation();

    return (
        <Drawer.Navigator
            screenOptions={{ headerShown: false }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
            <Drawer.Screen
                name="HomeTabs"
                component={HomeTabs}
                options={{ title: t('common.home') }}
            />
            <Drawer.Screen
                name="ProfileEdit"
                component={ProfileForm}
                options={{ title: t('common.editProfile') }}
            />
            <Drawer.Screen
                name="ChangePassword"
                component={ChangePasswordScreen}
                options={{ title: t('common.changePassword') }}
            />
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;
