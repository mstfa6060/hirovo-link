import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

// TODO: API hazır olduğunda AnimalMarketAPI import edilecek
// import { AnimalMarketAPI } from '@api/business_modules/animalmarket';

type Offer = {
    id: string;
    animalName: string;
    amount: number;
    status: string;
    createdDate: Date;
};

export default function MyOffersScreen() {
    const { t } = useTranslation();
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOffers = async () => {
        try {
            // TODO: API call yapılacak
            // const response = await AnimalMarketAPI.Offers.MyOffers.Request();
            // setOffers(response.offers);

            // Geçici mock data
            setTimeout(() => {
                setOffers([
                    {
                        id: '1',
                        animalName: 'Holstein İneki',
                        amount: 15000,
                        status: 'Pending',
                        createdDate: new Date(),
                    },
                    {
                        id: '2',
                        animalName: 'Angus Boğası',
                        amount: 25000,
                        status: 'Accepted',
                        createdDate: new Date(),
                    },
                ]);
                setLoading(false);
            }, 1000);

            setError(null);
        } catch (err) {
            console.error('Teklifler yüklenirken hata:', err);
            setError(t('common.error.general'));
            setLoading(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchOffers().finally(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        fetchOffers();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Accepted':
                return '#28a745';
            case 'Rejected':
                return '#dc3545';
            case 'Pending':
                return '#ffc107';
            default:
                return '#6c757d';
        }
    };

    const renderOffer = ({ item }: { item: Offer }) => (
        <TouchableOpacity style={styles.offerCard}>
            <View style={styles.offerHeader}>
                <Text style={styles.animalName} numberOfLines={1}>
                    🐄 {item.animalName}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            <View style={styles.offerInfo}>
                <Text style={styles.amount}>
                    {item.amount.toLocaleString('tr-TR')} ₺
                </Text>
                <Text style={styles.date}>
                    {item.createdDate.toLocaleDateString('tr-TR')}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>📝</Text>
            <Text style={styles.emptyTitle}>{t('offers.noOffers')}</Text>
            <Text style={styles.emptySubtitle}>{t('offers.noOffersDescription')}</Text>
        </View>
    );

    if (loading && offers.length === 0) {
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
                <TouchableOpacity style={styles.retryButton} onPress={fetchOffers}>
                    <Text style={styles.retryText}>{t('common.retry')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t('offers.myOffers')}</Text>
                <Text style={styles.headerSubtitle}>
                    {offers.length} {t('offers.totalOffers')}
                </Text>
            </View>

            <FlatList
                data={offers}
                renderItem={renderOffer}
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
    offerCard: {
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
    offerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    animalName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    statusBadge: {
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
    offerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    amount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bff',
    },
    date: {
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
