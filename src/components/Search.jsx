import { StyleSheet, TextInput, View } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { colors } from '../global/colors'

const Search = ({setKeyword}) => {
    return (
        <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
                <Icon style={styles.searchIcon} name="search" size={16} color={colors.mediumGray} />
                <TextInput
                    style={styles.searchInput}
                    placeholder='Buscar producto' 
                    placeholderTextColor={colors.mediumGray}
                    onChangeText={(text)=>{setKeyword(text)}}
                />
            </View>
        </View>
    )
}

export default Search

const styles = StyleSheet.create({
    searchContainer:{
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 12,
        backgroundColor: colors.white
    },
    searchInputContainer:{
        flexDirection:"row",
        alignItems:"center",
        backgroundColor: colors.white,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: colors.white,
        shadowColor: colors.darkGray,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    searchInput:{
        flex: 1,
        fontSize: 14,
        fontFamily: 'Lexend-Regular',
        color: colors.darkGray,
        marginLeft: 8
    },
    searchIcon:{
    }
})