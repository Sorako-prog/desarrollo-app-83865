import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import { colors } from '../../global/colors'
import CameraIcon from '../../components/CameraIcon'
import { useState, useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import * as ImagePicker from 'expo-image-picker';
import { useUpdateProfilePictureMutation } from '../../services/profileApi'
import { setUserImage, setUserEmail, setUserLocalId } from '../../store/slices/userSlices'
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import { deleteSession } from '../../db'

const ProfileScreen = () => {

    const [location, setLocation] = useState(null)
    const [errorMsg, setError] = useState(null)
    
    const user = useSelector(state=>state.user.email)
    const localId = useSelector(state=>state.user.localId)
    const image = useSelector(state=>state.user.image)

    const [triggerUpdateProfilePicture, result] = useUpdateProfilePictureMutation() 

    const dispatch = useDispatch()
    
    const pickImage = async () => { 
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
            base64: true
        })

        if(!result.canceled){
            const imgBase64 = `data:image/jpeg;base64,${result.assets[0].base64}`
            dispatch(setUserImage(imgBase64))
            triggerUpdateProfilePicture({localId:localId,image:imgBase64 })
        }
    }

    useEffect(() => {
        async function getCurrentLocation() {

            let { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
                setError("No se ha dado permiso para acceder a la ubicación")
                return
            }
            let location = await Location.getCurrentPositionAsync({})
            setLocation(location)
        }
        getCurrentLocation()
    }, [])
    
    return (
        <View style={styles.profileContainer}>
            <View style={styles.imageProfileContainer}>
                {
                    image
                        ?
                        <Image source={{ uri: image }} resizeMode='cover' style={styles.profileImage} />
                        :
                        <Text style={styles.textProfilePlaceHolder}>{user.charAt(0).toUpperCase()}</Text>
                }
                <Pressable onPress={pickImage} style={({ pressed }) => [{ opacity: pressed ? 0.90 : 1 }, styles.cameraIcon]} >
                    <CameraIcon />
                </Pressable>
            </View>
            <Text style={styles.profileData}>Email: {user} </Text>
            <Pressable style={styles.logoutBtn} onPress={async () => {
                await deleteSession()
                dispatch(setUserEmail(""))
                dispatch(setUserLocalId(""))
                dispatch(setUserImage(""))
            }}>
                <Text style={styles.logoutText}>Cerrar sesión</Text>
            </Pressable>
            {errorMsg && <Text style={styles.errorMsg}>{errorMsg}</Text>}
            {location ? (
                <MapView 
                    style={styles.map} initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    }}
                >
                    <Marker coordinate={{ "latitude": location.coords.latitude, "longitude": location.coords.longitude }} title="Ubicación" />
                </MapView>
            ) : null}
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    profileContainer: {
        padding: 32,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageProfileContainer: {
        width: 128,
        height: 128,
        borderRadius: 128,
        backgroundColor: colors.sweetOrange,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textProfilePlaceHolder: {
        color: colors.white,
        fontSize: 48,
    },
    profileData: {
        paddingVertical: 16,
        fontSize: 16
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    profileImage: {
        width: 128,
        height: 128,
        borderRadius: 128
    },
    map: {
        width: '100%',
        height: 240,
        overflow: "hidden",
        elevation: 5,
        marginBottom: 16
    },
    logoutBtn: {
        padding: 12,
        paddingHorizontal: 24,
        backgroundColor: colors.black,
        borderRadius: 16,
        marginBottom: 16
    },
    logoutText: {
        color: colors.white,
        fontWeight: '700'
    }
})