import { StyleSheet, Text, View, Pressable, Image, ScrollView, useWindowDimensions } from 'react-native'
import { colors } from '../../global/colors';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart } from '../../store/slices/cartSlices';
import { setProductSelected } from '../../store/slices/shopSlices';
import { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import ProductImageWithFallback from '../../components/ProductImageWithFallback';

const ProductScreen = ({ route }) => {
    const { product: productFromRoute } = route.params || {}
    const productFromRedux = useSelector(state => state.shop.productSelected)
    const cartItems = useSelector(state => state.cart.cartItems)
    const { width } = useWindowDimensions()
    const [quantity, setQuantity] = useState(1)

    const dispatch = useDispatch()

    const product = productFromRoute || productFromRedux

    const getAvailableStock = () => {
        if (!product) return 0
        const cartItem = cartItems.find(item => item.id === product.id)
        const quantityInCart = cartItem ? cartItem.quantity : 0
        return product.stock - quantityInCart
    }

    const availableStock = getAvailableStock()

    useEffect(() => {
        if (productFromRoute) {
            dispatch(setProductSelected(productFromRoute))
        }
    }, [productFromRoute, dispatch])

    const handleAddToCart = () => {
        dispatch(addItemToCart({ product, quantity }))
        setQuantity(1)
    }

    const incrementQuantity = () => {
        if (quantity < availableStock) {
            setQuantity(prev => prev + 1)
        }
    }

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1)
        }
    }

    if (!product) {
        return (
            <View style={styles.productContainer}>
                <Text style={styles.textTitle}>Producto no encontrado</Text>
            </View>
        )
    }

    return (
        <ScrollView style={styles.productContainer}>
            <Text style={styles.textBrand}>{product.brand}</Text>
            <Text style={styles.textTitle}>{product.title}</Text>
            
            <View style={styles.badgesContainer}>
                {product.discount > 0 && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountBadgeText}>-{product.discount}%</Text>
                    </View>
                )}
                {availableStock > 0 && availableStock <= 3 && (
                    <View style={styles.lastUnitsBadge}>
                        <Icon name="alert-triangle" size={12} color={colors.white} />
                        <Text style={styles.lastUnitsText}>Últimas {availableStock} unidades</Text>
                    </View>
                )}
            </View>

            <View style={styles.productImageContainer}>
                <ProductImageWithFallback
                    imageUri={product.mainImage}
                    productTitle={product.title}
                    style={styles.productMainImage}
                    containerStyle={styles.productImageContainer}
                    resizeMode='cover'
                />
            </View>
            <Text style={styles.longDescription}>{product.longDescription}</Text>
            <View style={styles.tagsContainer}>
                <View style={styles.tags}>
                    <Text style={styles.tagText}>Tags : </Text>
                    {
                        product.tags?.map(tag => <Text key={Math.random()} style={styles.tagText}>{tag}</Text>)
                    }
                </View>
            </View>
            
            {availableStock <= 0 ? (
                <View style={styles.noStockContainer}>
                    <Icon name="x-circle" size={48} color={colors.secondary} />
                    <Text style={styles.noStockText}>Sin Stock</Text>
                    <Text style={styles.noStockSubtext}>Este producto no está disponible</Text>
                </View>
            ) : (
                <>
                    <View style={styles.priceContainer}>
                        {product.discount > 0 ? (
                            <>
                                <Text style={styles.originalPriceLabel}>Precio original:</Text>
                                <Text style={styles.originalPrice}>${product.price}</Text>
                                <Text style={styles.discountedPriceLabel}>Precio con descuento:</Text>
                                <Text style={styles.discountedPrice}>
                                    ${Math.round(product.price * (1 - product.discount / 100))}
                                </Text>
                                <Text style={styles.savingsText}>
                                    Ahorras: ${Math.round(product.price * (product.discount / 100))}
                                </Text>
                            </>
                        ) : (
                            <Text style={styles.price}>Precio: ${product.price}</Text>
                        )}
                    </View>
                    
                    <View style={styles.quantityContainer}>
                        <View>
                            <Text style={styles.quantityLabel}>Cantidad:</Text>
                            <Text style={styles.stockLabel}>
                                Stock disponible: {availableStock}
                                {availableStock < product.stock && (
                                    <Text style={styles.cartStockNote}> (en carrito: {product.stock - availableStock})</Text>
                                )}
                            </Text>
                        </View>
                        <View style={styles.quantityControls}>
                            <Pressable 
                                style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
                                onPress={decrementQuantity}
                                disabled={quantity <= 1}
                            >
                                <Icon name="minus" size={20} color={quantity <= 1 ? colors.mediumGray : colors.darkGray} />
                            </Pressable>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <Pressable 
                                style={[styles.quantityButton, quantity >= availableStock && styles.quantityButtonDisabled]}
                                onPress={incrementQuantity}
                                disabled={quantity >= availableStock}
                            >
                                <Icon name="plus" size={20} color={quantity >= availableStock ? colors.mediumGray : colors.darkGray} />
                            </Pressable>
                        </View>
                    </View>

                    <Pressable
                        style={({ pressed }) => [
                            { opacity: pressed ? 0.95 : 1 }, 
                            styles.addToCartButton
                        ]}
                        onPress={handleAddToCart}>
                        <Text style={styles.textAddToCart}>
                            Agregar al carrito
                        </Text>
                    </Pressable>
                </>
            )}
        </ScrollView>
    )
}

export default ProductScreen

const styles = StyleSheet.create({
    productContainer: {
        paddingHorizontal: 16,
        marginVertical: 16
    },
    textBrand: {
        color: colors.darkGray,
    },
    textTitle: {
        fontSize: 24,
        fontWeight: '700'
    },
    productImageContainer: {
        width: '100%',
        height: 280,
        borderRadius: 16,
        overflow: 'hidden',
        marginVertical: 16
    },
    productMainImage: {
        width: '100%',
        height: '100%'
    },
    badgesContainer: {
        flexDirection: 'row',
        gap: 8,
        marginVertical: 12,
        flexWrap: 'wrap'
    },
    discountBadge: {
        backgroundColor: colors.secondary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start'
    },
    discountBadgeText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '700'
    },
    lastUnitsBadge: {
        backgroundColor: colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start'
    },
    lastUnitsText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '600'
    },
    longDescription: {
        fontSize: 16,
        textAlign: 'justify',
        paddingVertical: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        gap: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8
    },
    tags: {
        flexDirection: 'row',
        gap: 5,
    },
    tagText: {
        fontWeight: '600',
        fontSize: 14,
        color: colors.primary
    },
    noStockContainer: {
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 20
    },
    noStockText: {
        color: colors.secondary,
        fontSize: 24,
        fontWeight: '700',
        marginTop: 16,
        marginBottom: 8
    },
    noStockSubtext: {
        color: colors.mediumGray,
        fontSize: 16,
        textAlign: 'center'
    },
    price: {
        fontSize: 24,
        fontWeight: '700',
        alignSelf: 'center',
        paddingVertical: 16
    },
    priceContainer: {
        alignItems: 'center',
        paddingVertical: 16
    },
    originalPriceLabel: {
        fontSize: 16,
        color: colors.mediumGray,
        marginBottom: 4
    },
    originalPrice: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.mediumGray,
        textDecorationLine: 'line-through',
        marginBottom: 8
    },
    discountedPriceLabel: {
        fontSize: 18,
        color: colors.darkGray,
        fontWeight: '600',
        marginBottom: 4
    },
    discountedPrice: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: 8
    },
    savingsText: {
        fontSize: 16,
        color: colors.secondary,
        fontWeight: '600'
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 16,
        paddingHorizontal: 20
    },
    quantityLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.darkGray
    },
    stockLabel: {
        fontSize: 14,
        color: colors.mediumGray,
        marginTop: 4
    },
    cartStockNote: {
        fontSize: 12,
        color: colors.primary,
        fontStyle: 'italic'
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
    },
    quantityButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.mediumGray
    },
    quantityButtonDisabled: {
        backgroundColor: colors.lightGray,
        opacity: 0.5
    },
    quantityText: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.darkGray,
        minWidth: 30,
        textAlign: 'center'
    },
    addToCartButton: {
        padding: 8,
        paddingHorizontal: 16,
        backgroundColor: colors.primary,
        borderRadius: 16,
        marginVertical: 16
    },
    addToCartButtonDisabled: {
        backgroundColor: colors.mediumGray,
        opacity: 0.6
    },
    textAddToCart: {
        color: colors.white,
        fontSize: 24,
        textAlign: 'center',
    },
    textAddToCartDisabled: {
        color: colors.white,
        opacity: 0.8
    }
})