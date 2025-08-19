import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { AnimalMarketAPI } from '@api/business_modules/animalmarket';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const { width } = Dimensions.get('window');

type AnimalDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AnimalDetail'>;
type AnimalDetailScreenRouteProp = RouteProp<RootStackParamList, 'AnimalDetail'>;

export default function AnimalDetailScreen() {
    const { t } = useTranslation();
    const navigation = useNavigation<AnimalDetailScreenNavigationProp>();
    const route = useRoute<AnimalDetailScreenRouteProp>();
    const { id } = route.params;

    const [animal, setAnimal] = useState<AnimalMarketAPI.Animals.Detail.IResponseModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        fetchAnimalDetails();
        getCurrentUser();
    }, [id]);

    const getCurrentUser = async () => {
        try {
            const token = await AsyncStorage.getItem('jwt');
            if (token) {
                const decoded: any = jwtDecode(token);
                setCurrentUserId(decoded?.nameid);
            }
        } catch (error) {
            console.error('Kullanıcı bilgisi alınırken hata:', error);
        }
    };

    const fetchAnimalDetails = async () => {
        try {
            setLoading(true);
            const response = await AnimalMarketAPI.Animals.Detail.Request({ animalId: id });
            setAnimal(response);
            setError(null);
        } catch (err) {
            console.error('Hayvan detayları yüklenirken hata:', err);
            setError(t('common.error.general'));
        } finally {
            setLoading(false);
        }
    };

    const handleMakeOffer = () => {
        if (!currentUserId) {
            Alert.alert(t('common.error.title'), t('auth.loginRequired'));
            return;
        }
        // TODO: Teklif verme modal'ı göster
        Alert.alert('Teklif Yap', 'Teklif verme özelliği yakında...');
    };

    const handlePlaceBid = () => {
        if (!currentUserId) {
            Alert.alert(t('common.error.title'), t('auth.loginRequired'));
            return;
        }
        // TODO: Açık artırma teklifi modal'ı göster
        Alert.alert('Teklif Ver', 'Açık artırma teklifi özelliği yakında...');
    };

    const handleContactSeller = () => {
        if (!animal) return;
        // TODO: Chat özelliği
        Alert.alert('İletişim', 'Mesajlaşma özelliği yakında...');
    }; const getAnimalAge = (birthDate: Date) => {
        const now = new Date();
        const birth = new Date(birthDate);
        const diffTime = Math.abs(now.getTime() - birth.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const months = Math.floor(diffDays / 30);
        const years = Math.floor(months / 12);

        if (years > 0) {
            return `${years} ${t('common.years')} ${months % 12} ${t('common.months')}`;
        }
        return `${months} ${t('common.months')}`;
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>{t('common.loading')}</Text>
            </SafeAreaView>
        );
    }

    if (error || !animal) {
        return (
            <SafeAreaView style={styles.errorContainer}>
                <Text style={styles.errorText}>❌ {error || t('common.error.notFound')}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchAnimalDetails}>
                    <Text style={styles.retryText}>{t('common.retry')}</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Fotoğraf Galerisi */}
                <View style={styles.imageContainer}>
                    {animal.photos && animal.photos.length > 0 ? (
                        <>
                            <ScrollView
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onMomentumScrollEnd={(event) => {
                                    const index = Math.round(event.nativeEvent.contentOffset.x / width);
                                    setCurrentImageIndex(index);
                                }}
                            >
                                {animal.photos
                                    .sort((a, b) => a.order - b.order)
                                    .map((photo, index) => (
                                        <Image
                                            key={photo.id}
                                            source={{ uri: photo.url }}
                                            style={styles.animalImage}
                                        />
                                    ))}
                            </ScrollView>
                            <View style={styles.imageIndicator}>
                                <Text style={styles.imageCount}>
                                    {currentImageIndex + 1} / {animal.photos.length}
                                </Text>
                            </View>
                        </>
                    ) : (
                        <View style={styles.placeholderImage}>
                            <Text style={styles.placeholderText}>🐄</Text>
                        </View>
                    )}
                </View>

                {/* Temel Bilgiler */}
                <View style={styles.infoSection}>
                    <View style={styles.header}>
                        <Text style={styles.animalName}>{animal.name}</Text>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>
                                {t(`animalStatus.${AnimalMarketAPI.Enums.AnimalStatus[animal.status]}`)}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.breed}>
                        {animal.breed} • {t(`animalType.${AnimalMarketAPI.Enums.AnimalType[animal.type]}`)}
                    </Text>

                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>
                            {animal.price.toLocaleString('tr-TR')} ₺
                        </Text>
                        {animal.isNegotiable && (
                            <Text style={styles.negotiable}>{t('common.negotiable')}</Text>
                        )}
                    </View>

                    <View style={styles.saleTypeContainer}>
                        <Text style={styles.saleType}>
                            {t(`saleType.${AnimalMarketAPI.Enums.AnimalSaleType[animal.saleType]}`)}
                        </Text>
                        {animal.saleType === AnimalMarketAPI.Enums.AnimalSaleType.Auction && (
                            <Text style={styles.bidCount}>
                                🔨 {animal.activeBidCount} {t('animals.activeBids')}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Hayvan Özellikleri */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('animals.characteristics')}</Text>

                    <View style={styles.characteristicGrid}>
                        <View style={styles.characteristic}>
                            <Text style={styles.characteristicLabel}>{t('animals.gender')}</Text>
                            <Text style={styles.characteristicValue}>
                                {t(`gender.${AnimalMarketAPI.Enums.AnimalGender[animal.gender]}`)}
                            </Text>
                        </View>

                        <View style={styles.characteristic}>
                            <Text style={styles.characteristicLabel}>{t('animals.age')}</Text>
                            <Text style={styles.characteristicValue}>
                                {getAnimalAge(animal.birthDate)}
                            </Text>
                        </View>

                        <View style={styles.characteristic}>
                            <Text style={styles.characteristicLabel}>{t('animals.weight')}</Text>
                            <Text style={styles.characteristicValue}>{animal.weight} kg</Text>
                        </View>

                        <View style={styles.characteristic}>
                            <Text style={styles.characteristicLabel}>{t('animals.healthStatus')}</Text>
                            <Text style={styles.characteristicValue}>{animal.healthStatus}</Text>
                        </View>
                    </View>
                </View>

                {/* Açıklama */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('animals.description')}</Text>
                    <Text style={styles.description}>{animal.description}</Text>
                </View>

                {/* Konum */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('animals.location')}</Text>
                    <View style={styles.locationContainer}>
                        <Text style={styles.location}>
                            📍 {animal.city} / {animal.district}
                        </Text>
                        <TouchableOpacity
                            style={styles.mapButton}
                            onPress={() => {
                                // TODO: Harita modal'ı göster
                                Alert.alert('Konum', `Lat: ${animal.latitude}, Lng: ${animal.longitude}`);
                            }}
                        >
                            <Text style={styles.mapButtonText}>{t('common.showOnMap')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Çiftlik Bilgileri */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('animals.farmInfo')}</Text>
                    <TouchableOpacity
                        style={styles.farmButton}
                        onPress={() => Alert.alert('Çiftlik', 'Çiftlik detayı özelliği yakında...')}
                    >
                        <Text style={styles.farmButtonText}>
                            🏠 {t('animals.viewFarm')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Alt Butonlar */}
            <View style={styles.bottomActions}>
                {animal.saleType === AnimalMarketAPI.Enums.AnimalSaleType.Auction ? (
                    <TouchableOpacity style={styles.bidButton} onPress={handlePlaceBid}>
                        <Text style={styles.buttonText}>{t('animals.placeBid')}</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.offerButton} onPress={handleMakeOffer}>
                        <Text style={styles.buttonText}>{t('animals.makeOffer')}</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.contactButton} onPress={handleContactSeller}>
                    <Text style={styles.buttonText}>{t('animals.contactSeller')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#d32f2f',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#007bff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 6,
    },
    retryText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    imageContainer: {
        height: 300,
        position: 'relative',
    },
    animalImage: {
        width: width,
        height: 300,
        resizeMode: 'cover',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 64,
    },
    imageIndicator: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    imageCount: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    infoSection: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    animalName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    statusBadge: {
        backgroundColor: '#28a745',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginLeft: 12,
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    breed: {
        fontSize: 16,
        color: '#666',
        marginBottom: 12,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007bff',
    },
    negotiable: {
        marginLeft: 12,
        fontSize: 14,
        color: '#28a745',
        backgroundColor: '#e8f5e8',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    saleTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    saleType: {
        fontSize: 16,
        color: '#666',
        fontWeight: 'bold',
    },
    bidCount: {
        fontSize: 14,
        color: '#f57c00',
        fontWeight: 'bold',
    },
    section: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    characteristicGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    characteristic: {
        width: '48%',
        marginBottom: 16,
    },
    characteristicLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    characteristicValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    description: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
    locationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    location: {
        fontSize: 16,
        color: '#333',
    },
    mapButton: {
        backgroundColor: '#007bff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    mapButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    farmButton: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    farmButtonText: {
        fontSize: 16,
        color: '#007bff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    bottomActions: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    offerButton: {
        flex: 1,
        backgroundColor: '#28a745',
        paddingVertical: 12,
        borderRadius: 8,
        marginRight: 8,
    },
    bidButton: {
        flex: 1,
        backgroundColor: '#f57c00',
        paddingVertical: 12,
        borderRadius: 8,
        marginRight: 8,
    },
    contactButton: {
        flex: 1,
        backgroundColor: '#007bff',
        paddingVertical: 12,
        borderRadius: 8,
        marginLeft: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
