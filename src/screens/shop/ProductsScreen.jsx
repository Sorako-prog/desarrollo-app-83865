import { StyleSheet, Text, View, FlatList, Pressable, Image, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { colors } from '../../global/colors'
import Search from '../../components/Search'
import ProductImageWithFallback from '../../components/ProductImageWithFallback'
import { useSelector, useDispatch } from 'react-redux'
import { setProductSelected } from '../../store/slices/shopSlices'
import Icon from 'react-native-vector-icons/Feather'
import { useGetProductsByCategoryQuery, useGetProductsQuery } from '../../services/shopApi'


const { width } = Dimensions.get('window')
const cardWidth = (width - 60) / 2

const ProductsScreen = ({route, navigation}) => {
    const [productsFiltered,setProductsFiltered] = useState([])
    const [keyword,setKeyword] = useState("")

    const category = useSelector(state => state.shop.categorySelected)

    const cartItems = useSelector(state => state.cart.cartItems)
    const dispatch = useDispatch()

    const handleProductSelected = (product) => {
        dispatch(setProductSelected(product))
        navigation.navigate("Producto", { product: product })
    }
    const {data: productsFilteredByCategory, isLoading, error} = useGetProductsByCategoryQuery(category.toLowerCase())

    useEffect(()=>{
        if(keyword){
            const productsFilteredByKeyword = productsFilteredByCategory.filter(product=>product.title.toLowerCase().includes(keyword.toLocaleLowerCase()))
            setProductsFiltered(productsFilteredByKeyword)
        }else{
            setProductsFiltered(productsFilteredByCategory)
        }
    },[category,keyword,productsFilteredByCategory])

    const renderProductItem = ({ item }) => {
        const formatPrice = (price) => {
            return new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS',
                minimumFractionDigits: 0
            }).format(price)
        }

        const getAvailableStock = (product) => {
            const cartItem = cartItems.find(cartItem => cartItem.id === product.id)
            const quantityInCart = cartItem ? cartItem.quantity : 0
            return product.stock - quantityInCart
        }

        const availableStock = getAvailableStock(item)

        return (
            <Pressable 
                style={styles.cardContainer}
                onPress={() => navigation.navigate("Producto", { product: item })}
            >
                <View style={styles.card}>
                    <View style={styles.badgesContainer}>
                        {item.discount > 0 && (
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountBadgeText}>-{item.discount}%</Text>
                            </View>
                        )}
                        {availableStock <= 0 && (
                            <View style={styles.noStockBadge}>
                                <Icon name="x-circle" size={10} color={colors.white} />
                                <Text style={styles.noStockBadgeText}>Sin Stock</Text>
                            </View>
                        )}
                        {availableStock > 0 && availableStock <= 3 && (
                            <View style={styles.lastUnitsBadge}>
                                <Icon name="alert-triangle" size={10} color={colors.white} />
                                <Text style={styles.lastUnitsBadgeText}>{availableStock}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.imageContainer}>
                        <ProductImageWithFallback
                            imageUri={item.mainImage}
                            productTitle={item.title}
                            style={styles.productImage}
                            containerStyle={styles.imageContainer}
                            resizeMode='cover'
                        />
                    </View>
                    <View style={styles.productInfo}>
                        <Text style={styles.productTitle} numberOfLines={2}>
                            {item.title}
                        </Text>
                        <View style={styles.priceContainer}>
                            {item.discount > 0 ? (
                                <>
                                    <Text style={styles.originalPrice}>
                                        {formatPrice(item.price)}
                                    </Text>
                                    <Text style={styles.discountedPrice}>
                                        {formatPrice(item.price * (1 - item.discount / 100))}
                                    </Text>
                                </>
                            ) : (
                                <Text style={styles.productPrice}>
                                    {formatPrice(item.price)}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            </Pressable>
        )
    }

    return (
        <View style={styles.container}>
            <Search setKeyword={setKeyword} />
            <View style={styles.productsContainer}>
                <FlatList
                    data={productsFiltered}
                    renderItem={renderProductItem}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    )
}

export default ProductsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    productsContainer: {
        flex: 1,
        paddingHorizontal: 20
    },
    listContainer: {
        paddingBottom: 20
    },
    cardContainer: {
        width: cardWidth,
        marginHorizontal: 5,
        marginVertical: 8
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.lightGray,
        position: 'relative'
    },
    badgesContainer: {
        position: 'absolute',
        top: 8,
        left: 8,
        right: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 1
    },
    discountBadge: {
        backgroundColor: colors.secondary,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 8,
        alignSelf: 'flex-start'
    },
    discountBadgeText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: '700'
    },
    noStockBadge: {
        backgroundColor: colors.secondary,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        alignSelf: 'flex-start'
    },
    noStockBadgeText: {
        color: colors.white,
        fontSize: 9,
        fontWeight: '600'
    },
    lastUnitsBadge: {
        backgroundColor: colors.primary,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        alignSelf: 'flex-start'
    },
    lastUnitsBadgeText: {
        color: colors.white,
        fontSize: 9,
        fontWeight: '600'
    },
    imageContainer: {
        width: cardWidth - 24,
        height: cardWidth - 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderRadius: 12,
        overflow: 'hidden'
    },
    productImage: {
        width: '100%',
        height: '100%'
    },
    productInfo: {
        width: '100%',
        alignItems: 'center'
    },
    productTitle: {
        fontSize: 14,
        fontFamily: 'Lexend-Bold',
        color: colors.darkGray,
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 8,
        minHeight: 36
    },
    productPrice: {
        fontSize: 16,
        fontFamily: 'Lexend-Bold',
        color: colors.primary,
        textAlign: 'center'
    },
    priceContainer: {
        alignItems: 'center',
        gap: 2
    },
    originalPrice: {
        fontSize: 12,
        fontFamily: 'Lexend-Regular',
        color: colors.mediumGray,
        textAlign: 'center',
        textDecorationLine: 'line-through'
    },
    discountedPrice: {
        fontSize: 16,
        fontFamily: 'Lexend-Bold',
        color: colors.primary,
        textAlign: 'center'
    }
})