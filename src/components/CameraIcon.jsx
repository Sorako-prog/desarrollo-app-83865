import { StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { colors } from '../global/colors'

const CameraIcon = () => {
  return (
    <View style={styles.cameraIcon}>
      <Icon name="camera" size={24} color={colors.white} />
    </View>
  )
}

export default CameraIcon

const styles = StyleSheet.create({
    cameraIcon: {
        backgroundColor: colors.darkGray,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 50
    }
})