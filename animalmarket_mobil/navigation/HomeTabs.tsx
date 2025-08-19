import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AnimalsAllScreen from '../screens/AnimalsAllScreen';
import FarmsScreen from '../screens/FarmsScreen';
import MyOffersScreen from '../screens/MyOffersScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();

const MenuButton = () => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={{ paddingLeft: 16 }}
        >
            <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
    );
};

const HomeTabs = () => {
    const { t } = useTranslation();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerLeft: () => <MenuButton />,
                headerShown: true,
                tabBarIcon: ({ color, size }) => {
                    let iconName: string = 'home';

                    if (route.name === 'Animals') {
                        iconName = 'paw-outline';
                    } else if (route.name === 'Farms') {
                        iconName = 'home-outline';
                    } else if (route.name === 'MyOffers') {
                        iconName = 'document-text-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#2563eb',
                tabBarInactiveTintColor: '#6b7280',
                tabBarLabelStyle: { fontSize: 12 },
                tabBarStyle: { paddingVertical: 6, height: 60 },
            })}
        >
            <Tab.Screen
                name="Animals"
                component={AnimalsAllScreen}
                options={{ title: t('tabs.animals') }}
            />
            <Tab.Screen
                name="Farms"
                component={FarmsScreen}
                options={{ title: t('tabs.farms') }}
            />
            <Tab.Screen
                name="MyOffers"
                component={MyOffersScreen}
                options={{ title: t('tabs.myOffers') }}
            />
        </Tab.Navigator>
    );
};

export default HomeTabs;
