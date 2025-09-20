import { FlatList, StyleSheet, Text, View, Image, Pressable, Alert } from 'react-native'
import { colors } from '../../global/colors'
import Icon from 'react-native-vector-icons/Feather'
import { useSelector, useDispatch } from 'react-redux'
import { addItemToCart, removeItemFromCart, removeItemCompletely, clearCart } from '../../store/slices/cartSlices'
import { useCreateOrderMutation } from '../../services/ordersApi'
import ProductImageWithFallback from '../../components/ProductImageWithFallback'


const CartScreen = () => {
  const cartItems = useSelector(state => state.cart.cartItems)
  const total = useSelector(state => state.cart.total)
  const userEmail = useSelector(state => state.user.email)
  const localId = useSelector(state => state.user.localId)
  const dispatch = useDispatch()
  const [createOrder] = useCreateOrderMutation()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleRemoveOne = (item) => {
    dispatch(removeItemFromCart({ product: item, quantity: 1 }))
  }

  const handleRemoveAll = (item) => {
    Alert.alert(
      'Eliminar producto',
      `¿Estás seguro de que quieres eliminar "${item.title}" del carrito?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => dispatch(removeItemCompletely({ product: item })) }
      ]
    )
  }

  const handleClearCart = () => {
    Alert.alert(
      'Vaciar carrito',
      '¿Estás seguro de que quieres vaciar todo el carrito?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Vaciar', style: 'destructive', onPress: () => dispatch(clearCart()) }
      ]
    )
  }

  const HeaderComponent = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.cartScreenTitle}>Tu carrito ({cartItems.length} productos)</Text>
      {cartItems.length > 0 && (
        <Pressable style={styles.clearButton} onPress={handleClearCart}>
          <Icon name="trash-2" size={16} color={colors.secondary} />
          <Text style={styles.clearButtonText}>Vaciar</Text>
        </Pressable>
      )}
    </View>
  )

  const FooterComponent = () => (
    <View style={styles.footerContainer}>
      <View style={styles.totalContainer}>
        <Text style={styles.footerTotal}>Total: {formatPrice(total)}</Text>
        <Text style={styles.itemsCount}>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} productos</Text>
      </View>
      <Pressable style={styles.confirmButton} onPress={() => {
        if (cartItems.length === 0) return
        Alert.alert(
          'Confirmar compra',
          '¿Deseás confirmar la compra de tu carrito?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Confirmar', style: 'default', onPress: async () => {
              try {
                const order = {
                  user: { email: userEmail, localId },
                  items: cartItems.map(({ id, title, price, finalPrice, quantity }) => ({ id, title, price, finalPrice, quantity })),
                  total,
                  createdAt: new Date().toISOString()
                }
                await createOrder(order).unwrap()
                dispatch(clearCart())
                Alert.alert('Compra confirmada', 'Tu orden fue creada correctamente')
              } catch (e) {
                Alert.alert('Error', 'No se pudo confirmar la compra')
              }
            } }
          ]
        )
      }}>
        <Text style={styles.confirmButtonText}>Confirmar Compra</Text>
      </Pressable>
    </View>
  )

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <ProductImageWithFallback
        imageUri={item.mainImage}
        productTitle={item.title}
        style={styles.cartImage}
        containerStyle={styles.cartImageContainer}
        resizeMode='contain'
      />
      <View style={styles.itemInfo}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.price}>
          Precio: {formatPrice(item.finalPrice || item.price)}
          {item.finalPrice && item.finalPrice !== item.price && (
            <Text style={styles.originalPriceInCart}> (antes: {formatPrice(item.price)})</Text>
          )}
        </Text>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Cantidad:</Text>
          <View style={styles.quantityControls}>
            <Pressable 
              style={[styles.quantityButton, item.quantity <= 1 && styles.quantityButtonDisabled]}
              onPress={() => handleRemoveOne(item)}
              disabled={item.quantity <= 1}
            >
              <Icon name="minus" size={14} color={item.quantity <= 1 ? colors.mediumGray : colors.darkGray} />
            </Pressable>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <Pressable 
              style={styles.quantityButton}
              onPress={() => dispatch(addItemToCart({ product: item, quantity: 1 }))}
            >
              <Icon name="plus" size={14} color={colors.darkGray} />
            </Pressable>
          </View>
        </View>
        <Text style={styles.itemTotal}>Subtotal: {formatPrice(item.quantity * (item.finalPrice || item.price))}</Text>
      </View>
      <Pressable style={styles.removeButton} onPress={() => handleRemoveAll(item)}>
        <Icon name="x" size={20} color={colors.secondary} />
      </Pressable>
    </View>
  )

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="shopping-cart" size={64} color={colors.mediumGray} />
        <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
        <Text style={styles.emptySubtitle}>Agrega algunos productos para comenzar</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.id}
        renderItem={renderCartItem}
        ListHeaderComponent={<HeaderComponent />}
        ListFooterComponent={<FooterComponent />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  )
}

export default CartScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  listContainer: {
    paddingBottom: 20
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    marginBottom: 8
  },
  cartScreenTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkGray
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.secondary
  },
  clearButtonText: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '600'
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 12,
    borderRadius: 12,
    shadowColor: colors.darkGray,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.lightGray
  },
  cartImage: {
    width: 60,
    height: 60,
    borderRadius: 8
  },
  cartImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden'
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: 4
  },
  price: {
    fontSize: 12,
    color: colors.mediumGray,
    marginBottom: 8
  },
  originalPriceInCart: {
    fontSize: 10,
    color: colors.mediumGray,
    textDecorationLine: 'line-through'
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  quantityLabel: {
    fontSize: 12,
    color: colors.darkGray,
    fontWeight: '500'
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.mediumGray
  },
  quantityButtonDisabled: {
    backgroundColor: colors.white,
    opacity: 0.5
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGray,
    minWidth: 20,
    textAlign: 'center'
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8
  },
  footerContainer: {
    padding: 20,
    backgroundColor: colors.white,
    marginTop: 16
  },
  totalContainer: {
    alignItems: 'center',
    marginBottom: 16
  },
  footerTotal: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: 4
  },
  itemsCount: {
    fontSize: 14,
    color: colors.mediumGray
  },
  confirmButton: {
    padding: 16,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center'
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: colors.white
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.darkGray,
    marginTop: 16,
    marginBottom: 8
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.mediumGray,
    textAlign: 'center'
  }
})