import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
    Alert,
    Switch,
    Platform,
    Image,
    KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AnimalMarketAPI } from '@api/business_modules/animalmarket';
import TopBar from '../../components/TopBar';
import { useAuth } from '../../src/hooks/useAuth';
import {
    useFocusEffect,
    useRoute,
    useNavigation,
} from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import PhoneInputCustom from '../../components/PhoneInputCustom';
import { AppConfig } from '@config/animalmarket-config';
import { pickAndUploadProfilePhoto } from 'src/utils/uploadProfilePhoto';
import { LanguageSelectorDropdown } from 'components/LanguageSelector';
import { FileProviderAPI } from '@api/base_modules/FileProvider';

const schema = z.object({
    phoneNumber: z.string().min(10, { message: 'ui.profile.validation.phoneNumber' }),
    birthDate: z.string().min(1, { message: 'ui.profile.validation.birthDate' }),
    city: z.string().min(1, { message: 'ui.profile.validation.city' }),
    district: z.string().min(1, { message: 'ui.profile.validation.district' }),
    description: z.string().min(10, { message: 'ui.profile.validation.descriptionMin' }),
    isAvailable: z.boolean(),
});

type FormData = z.infer<typeof schema>;
type ProfileRouteProp = RouteProp<RootStackParamList, 'ProfileForm'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileForm() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const route = useRoute<ProfileRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const fromLogin = route.params?.fromLogin ?? false;

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            phoneNumber: '',
            birthDate: '',
            city: '',
            district: '',
            description: '',
            isAvailable: true,
        },
    });

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [photoUrl, setPhotoUrl] = useState<FileProviderAPI.Files.Upload.IFileResponse | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedBucketId, setUploadedBucketId] = useState<string | null>(null);

    useEffect(() => {
        if (fromLogin) {
            Alert.alert(
                t('ui.profile.completeRequiredTitle'),
                t('ui.profile.completeRequiredMessage')
            );
        }
    }, [fromLogin]);

    useFocusEffect(
        React.useCallback(() => {
            const fetchProfile = async () => {
                try {
                    // TODO: Replace with AnimalMarketAPI profile endpoint
                    console.log('Profile loading disabled - API integration pending');
                    /*
                    const response = await AnimalMarketAPI.DetailProfile.Detail.Request({
                        userId: user.id,
                    });

                    reset({
                        phoneNumber: response.phoneNumber ?? '',
                        birthDate: response.birthDate?.toString().substring(0, 10) ?? '',
                        city: response.city ?? '',
                        district: response.district ?? '',
                        description: response.description ?? '',
                        isAvailable: response.isAvailable ?? false,
                    });

                    const responseImage = await FileProviderAPI.Buckets.Detail.Request({
                        bucketId: user.bucketId,
                        changeId: '00000000-0000-0000-0000-000000000000',
                    });

                    const file = responseImage.files?.[responseImage.files.length - 1] || null;
                    if (file) {
                        setPhotoUrl(file);
                    }
                    */
                } catch (error) {
                    Alert.alert(t('ui.error'), t('ui.profile.fetchError'));
                }
            };

            if (user.id) fetchProfile();

            return () => { };
        }, [user.id, reset])
    );

    const onSubmit = async (data: FormData) => {
        try {
            // TODO: Replace with AnimalMarketAPI update profile endpoint
            Alert.alert('Info', 'Profile update disabled - API integration pending');
            /*
            /*
            await AnimalMarketAPI.UpdateProfile.Update.Request({
                userId: user.id,
                firstName: user.fullName.split(' ')[0] ?? '', 
                surname: user.fullName.split(' ')[1] ?? '',
                email: user.email,
                phoneNumber: data.phoneNumber,
                city: data.city,
                district: data.district,
                description: data.description ?? '',
                birthDate: new Date(data.birthDate),
                isAvailable: data.isAvailable,
                bucketId: uploadedBucketId ?? user.bucketId,
            });

            Alert.alert(t('ui.success'), t('ui.profile.updated'));

            if (fromLogin) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Drawer' }],
                });
            }
            */
        } catch (error) {
            Alert.alert(t('ui.error'), t('ui.profile.updateError'));
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopBar title={t('ui.profile.title')} showBackButton />
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.label}>{t('ui.profile.description')}</Text>

                {/* Örnek input alanı */}
                <Controller
                    control={control}
                    name="phoneNumber"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder={t('ui.profile.phonePlaceholder')}
                            keyboardType="phone-pad"
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.phoneNumber && (
                    <Text style={styles.error}>{t(errors.phoneNumber.message || '')}</Text>
                )}

                <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                    {isSubmitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>{t('ui.save')}</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    error: {
        color: 'red',
        marginBottom: 8,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 14,
        borderRadius: 9999,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
