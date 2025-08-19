import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    RefreshControl,
    Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { AnimalMarketAPI } from '@api/business_modules/animalmarket';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from '@config/i18n';

type Farm = AnimalMarketAPI.Farms.All.IFarmSummary;

export default function FarmsScreen() {
    const { t } = useTranslation();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [farms, setFarms] = useState<Farm[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const fetchFarms = async (pageNumber: number = 1, isRefresh: boolean = false) => {
        try {
            const response = await AnimalMarketAPI.Farms.All.Request({
                languageCode: i18n.language,
                page: pageNumber,
                pageSize: 20,
                city: '',
                district: '',
            });

            if (isRefresh || pageNumber === 1) {
                setFarms(response.farms);
            } else {
                setFarms(prev => [...prev, ...response.farms]);
            }

            setTotalCount(response.totalCount);
            setPage(pageNumber);
            setError(null);
        } catch (err) {
            console.error('Çiftlikler yüklenirken hata:', err);
            setError(t('common.error.general'));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchFarms(1, true);
    }, []);

    const loadMore = () => {
        if (!loading && page * 20 < totalCount) {
            setLoading(true);
            fetchFarms(page + 1);
        }
    };

    useEffect(() => {
        fetchFarms();
    }, []);

    const renderFarm = ({ item }: { item: Farm }) => (
        <TouchableOpacity
            style={styles.farmCard}
            onPress={() => Alert.alert('Çiftlik Detayı', 'Çiftlik detayı özelliği yakında...')}
        >
            <View style={styles.farmHeader}>
                <Text style={styles.farmName} numberOfLines={1}>
                    🏠 {item.name}
                </Text>
            </View>

            <View style={styles.locationInfo}>
                <Text style={styles.location}>
                    📍 {item.city} / {item.district}
                </Text>
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
            <Text style={styles.emptyText}>🏠</Text>
            <Text style={styles.emptyTitle}>{t('farms.noFarms')}</Text>
            <Text style={styles.emptySubtitle}>{t('farms.noFarmsDescription')}</Text>
        </View>
    );

    if (loading && farms.length === 0) {
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
                <TouchableOpacity style={styles.retryButton} onPress={() => fetchFarms()}>
                    <Text style={styles.retryText}>{t('common.retry')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t('farms.allFarms')}</Text>
                <Text style={styles.headerSubtitle}>
                    {totalCount} {t('farms.totalFarms')}
                </Text>
            </View>

            <FlatList
                data={farms}
                renderItem={renderFarm}
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
    farmCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 16,
        padding: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },
    farmHeader: {
        marginBottom: 8,
    },
    farmName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    locationInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    location: {
        fontSize: 14,
        color: '#666',
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
