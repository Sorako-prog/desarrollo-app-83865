import { StyleSheet, Text, View, FlatList } from 'react-native'
import { colors } from '../../global/colors'
import { useSelector } from 'react-redux'
import { useGetOrdersByUserQuery } from '../../services/ordersApi'

const OrdersScreen = () => {
    const localId = useSelector(state => state.user.localId)
    const { data: orders = [], isLoading, isError } = useGetOrdersByUserQuery(localId, { skip: !localId })

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(price)
    }

    if (!localId) {
        return (
            <View style={styles.center}>
                <Text style={styles.info}>Inicia sesión para ver tus compras</Text>
            </View>
        )
    }

    if (isLoading) {
        return (
            <View style={styles.center}>
                <Text style={styles.info}>Cargando compras...</Text>
            </View>
        )
    }

    if (isError) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>No se pudieron cargar las compras</Text>
            </View>
        )
    }

    if (!orders.length) {
        return (
            <View style={styles.center}>
                <Text style={styles.info}>No tenés compras registradas</Text>
            </View>
        )
    }

    const renderItem = ({ item }) => (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Orden: {item.id}</Text>
                <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
            <View style={styles.items}>
                {item.items.map((p) => (
                    <View key={p.id} style={styles.itemRow}>
                        <Text style={styles.itemTitle} numberOfLines={1}>{p.title}</Text>
                        <Text style={styles.itemQty}>x{p.quantity}</Text>
                        <Text style={styles.itemPrice}>{formatPrice((p.finalPrice || p.price) * p.quantity)}</Text>
                    </View>
                ))}
            </View>
            <View style={styles.orderFooter}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatPrice(item.total)}</Text>
            </View>
        </View>
    )

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                keyExtractor={(o) => o.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />
        </View>
    )
}

export default OrdersScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    list: {
        padding: 16
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white
    },
    info: {
        color: colors.darkGray
    },
    error: {
        color: colors.secondary,
        fontWeight: '700'
    },
    orderCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.lightGray,
        shadowColor: colors.darkGray,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    orderId: {
        fontWeight: '700',
        color: colors.darkGray
    },
    orderDate: {
        color: colors.mediumGray
    },
    items: {
        gap: 4,
        marginBottom: 8
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8
    },
    itemTitle: {
        flex: 1,
        color: colors.darkGray
    },
    itemQty: {
        minWidth: 24,
        textAlign: 'right',
        color: colors.mediumGray
    },
    itemPrice: {
        minWidth: 80,
        textAlign: 'right',
        color: colors.darkGray,
        fontWeight: '700'
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
        paddingTop: 8
    },
    totalLabel: {
        color: colors.mediumGray
    },
    totalValue: {
        color: colors.primary,
        fontWeight: '700'
    }
})


