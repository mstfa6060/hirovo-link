import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    RefreshControl,
    AppState,
    AppStateStatus,
    Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { AnimalMarketAPI } from '@api/business_modules/animalmarket';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentLocation } from '../src/hooks/useLocation';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig } from '@config/animalmarket-config';
import DeviceInfo from 'react-native-device-info';
import i18n from '@config/i18n';

type Animal = AnimalMarketAPI.Animals.All.IAnimalSummaryModel;

export default function AnimalsAllScreen() {
    const { t } = useTranslation();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    const fetchAnimals = async (pageNumber: number = 1, isRefresh: boolean = false) => {
        try {
            const location = await getCurrentLocation();

            const response = await AnimalMarketAPI.Animals.All.Request({
                languageCode: i18n.language,
                page: pageNumber,
                pageSize: 20,
                sortBy: 'createdDate',
                sortDirection: 'desc',
                city: '',
                district: '',
                breed: '',
            });

            if (isRefresh || pageNumber === 1) {
                setAnimals(response.animals);
            } else {
                setAnimals(prev => [...prev, ...response.animals]);
            }

            setTotalCount(response.totalCount);
            setHasNextPage(response.hasNextPage);
            setPage(pageNumber);
            setError(null);
        } catch (err) {
            console.error('Hayvanlar yüklenirken hata:', err);
            setError(t('common.error.general'));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchAnimals(1, true);
    }, []);

    const loadMore = () => {
        if (hasNextPage && !loading) {
            setLoading(true);
            fetchAnimals(page + 1);
        }
    };

    useEffect(() => {
        fetchAnimals();

        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active') {
                onRefresh();
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription?.remove();
    }, []);

    const renderAnimal = ({ item }: { item: Animal }) => (
        <TouchableOpacity
            style={styles.animalCard}
            onPress={() => navigation.navigate('AnimalDetail', { id: item.id })}
        >
            <View style={styles.imageContainer}>
                {item.primaryPhotoUrl ? (
                    <Image source={{ uri: item.primaryPhotoUrl }} style={styles.animalImage} />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Text style={styles.placeholderText}>🐄</Text>
                    </View>
                )}
                <View style={styles.badgeContainer}>
                    <Text style={styles.badge}>
                        {t(`animalType.${AnimalMarketAPI.Enums.AnimalType[item.type]}`)}
                    </Text>
                </View>
            </View>

            <View style={styles.animalInfo}>
                <Text style={styles.animalName} numberOfLines={1}>
                    {item.name}
                </Text>
                <Text style={styles.animalBreed} numberOfLines={1}>
                    {item.breed} • {t(`gender.${AnimalMarketAPI.Enums.AnimalGender[item.gender]}`)}
                </Text>

                <View style={styles.priceContainer}>
                    <Text style={styles.price}>
                        {item.price.toLocaleString('tr-TR')} ₺
                    </Text>
                    {item.isNegotiable && (
                        <Text style={styles.negotiable}>{t('common.negotiable')}</Text>
                    )}
                </View>

                <View style={styles.locationInfo}>
                    <Text style={styles.location}>
                        📍 {item.city} / {item.district}
                    </Text>
                    {item.distanceKm && (
                        <Text style={styles.distance}>
                            {item.distanceKm.toFixed(1)} km
                        </Text>
                    )}
                </View>

                <View style={styles.animalDetails}>
                    <Text style={styles.detail}>
                        ⚖️ {item.weight} kg
                    </Text>
                    <Text style={styles.detail}>
                        📅 {item.ageMonths} ay
                    </Text>
                    <Text style={styles.detail}>
                        🏠 {item.farmName}
                    </Text>
                </View>

                {item.saleType === AnimalMarketAPI.Enums.AnimalSaleType.Auction && (
                    <View style={styles.auctionInfo}>
                        <Text style={styles.auctionLabel}>🔨 Açık Artırma</Text>
                        {item.bidCount > 0 && (
                            <Text style={styles.bidInfo}>
                                {item.bidCount} teklif • En yüksek: {item.highestBid?.toLocaleString('tr-TR')} ₺
                            </Text>
                        )}
                        {item.auctionEndDate && (
                            <Text style={styles.auctionEnd}>
                                Bitiş: {new Date(item.auctionEndDate).toLocaleDateString('tr-TR')}
                            </Text>
                        )}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color="#007bff" />
            </View>
        );
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>🐄</Text>
            <Text style={styles.emptyTitle}>{t('animals.noAnimals')}</Text>
            <Text style={styles.emptySubtitle}>{t('animals.noAnimalsDescription')}</Text>
        </View>
    );

    if (loading && animals.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>{t('common.loading')}</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>❌ {error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => fetchAnimals()}>
                    <Text style={styles.retryText}>{t('common.retry')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t('animals.allAnimals')}</Text>
                <Text style={styles.headerSubtitle}>
                    {totalCount} {t('animals.totalAnimals')}
                </Text>
            </View>

            <FlatList
                data={animals}
                renderItem={renderAnimal}
                keyExtractor={(item) => item.id}
                style={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#007bff']}
                    />
                }
                onEndReached={loadMore}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    list: {
        flex: 1,
        padding: 16,
    },
    animalCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },
    imageContainer: {
        position: 'relative',
        height: 200,
    },
    animalImage: {
        width: '100%',
        height: '100%',
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
        fontSize: 48,
    },
    badgeContainer: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    badge: {
        backgroundColor: 'rgba(0, 123, 255, 0.9)',
        color: 'white',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 'bold',
    },
    animalInfo: {
        padding: 16,
    },
    animalName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    animalBreed: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007bff',
    },
    negotiable: {
        marginLeft: 8,
        fontSize: 12,
        color: '#28a745',
        backgroundColor: '#e8f5e8',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    locationInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    location: {
        fontSize: 14,
        color: '#666',
    },
    distance: {
        fontSize: 12,
        color: '#007bff',
        fontWeight: 'bold',
    },
    animalDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detail: {
        fontSize: 12,
        color: '#666',
    },
    auctionInfo: {
        backgroundColor: '#fff8e1',
        padding: 8,
        borderRadius: 6,
        marginTop: 8,
    },
    auctionLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#f57c00',
        marginBottom: 4,
    },
    bidInfo: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    auctionEnd: {
        fontSize: 12,
        color: '#d32f2f',
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
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
        backgroundColor: '#f5f5f5',
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
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
});
