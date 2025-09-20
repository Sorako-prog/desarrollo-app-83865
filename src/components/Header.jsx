import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import { colors } from '../global/colors'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

const Header = () => {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
        <View style={{ width: 40, justifyContent: 'center', alignItems: 'flex-start' }}>
          { navigation.canGoBack() && (
            <Pressable onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>
          )}
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/logo.svg.png')}
              style={styles.logo}
              resizeMode='contain'
            />
          </View>
        </View>
        <View style={{ width: 40 }} />
    </View>
  )
}

export default Header;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 16,
    },
    logoContainer: {
        height: 80,
        width: 220,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: '100%',
        height: '100%'
    }
});