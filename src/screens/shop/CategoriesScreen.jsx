import { StyleSheet, Text, View, Image, FlatList, Pressable, Dimensions } from 'react-native'
import { colors } from '../../global/colors'
import { useDispatch } from 'react-redux'
import { setCategorySelected } from '../../store/slices/shopSlices'
import { useGetCategoriesQuery } from '../../services/shopApi'

const { width } = Dimensions.get('window')
const cardWidth = (width - 60) / 2

const CategoriesScreen = ({navigation}) => {

    const { data:categories, isLoading, error } = useGetCategoriesQuery()

    const dispatch = useDispatch()

    const handleCategorySelected = (category) => {
        dispatch(setCategorySelected(category))
        navigation.navigate("Productos",{category: category})
    }

    const renderCategoryItem = ({ item }) => {
        return (
            <Pressable 
                style={styles.cardContainer}
                onPress={()=>handleCategorySelected(item.title)}
            >
                <View style={styles.card}>
                    <View style={styles.imageContainer}>
                        <Image 
                            style={styles.categoryImage} 
                            source={{ uri: item.image }} 
                            resizeMode='cover' 
                        />
                    </View>
                    <Text style={styles.categoryTitle}>{item.title}</Text>
                </View>
            </Pressable>
        )
    }
    
    return (
        <View style={styles.container}>
            <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default CategoriesScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
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
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.lightGray
    },
    imageContainer: {
        width: cardWidth - 32,
        height: cardWidth - 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderRadius: 12,
        overflow: 'hidden'
    },
    categoryImage: {
        width: '100%',
        height: '100%'
    },
    categoryTitle: {
        fontSize: 16,
        fontFamily: 'Lexend-Bold',
        color: colors.darkGray,
        textAlign: 'center',
        lineHeight: 20
    }
})