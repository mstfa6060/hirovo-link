import React from 'react';
import {
    View, Text, TouchableOpacity, Alert, StyleSheet, ActivityIndicator
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { IAMAPI } from '@api/base_modules/iam';
import { AppConfig } from '@config/animalmarket-config';
import PhoneInputCustom from '../components/PhoneInputCustom';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { useAuth } from '../src/hooks/useAuth'; // 🔁 Burada user.id geliyor

const schema = z.object({
    phoneNumber: z.string().min(10, { message: 'ui.registerWithPhone.validation.phone' }),
});

type FormData = z.infer<typeof schema>;

export default function RegisterWithPhoneScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { t } = useTranslation();
    const { user } = useAuth(); // ✅ user.id burada

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            phoneNumber: '',
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            const response = await IAMAPI.Auth.SendOtp.Request({
                userId: user.id, // ✅ useAuth ile geldi
                phoneNumber: data.phoneNumber,
                companyId: AppConfig.DefaultCompanyId,
                language: i18n.language,
            });

            navigation.navigate('OtpVerificationScreen', {
                phoneNumber: data.phoneNumber,
                otpCode: response.otpCode,
            });
        } catch (error: any) {
            Alert.alert(
                t('ui.error'),
                error?.response?.data?.message || error?.message || t('ui.registerWithPhone.sendFailed')
            );
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('ui.registerWithPhone.title')}</Text>
            <Text style={styles.description}>{t('ui.registerWithPhone.description')}</Text>

            <Controller
                control={control}
                name="phoneNumber"
                render={({ field: { onChange, value } }) => (
                    <>
                        <PhoneInputCustom value={value} onChange={onChange} />
                        {errors.phoneNumber && (
                            <Text style={styles.errorText}>{t(errors.phoneNumber.message || '')}</Text>
                        )}
                    </>
                )}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>{t('ui.registerWithPhone.sendButton')}</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 32,
        color: '#6b7280',
    },
    button: {
        backgroundColor: '#0b80ee',
        paddingVertical: 16,
        borderRadius: 999,
        alignItems: 'center',
        marginTop: 24,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginTop: 4,
        marginBottom: 8,
    },
});
