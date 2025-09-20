import { StyleSheet, Text, View, TextInput, Pressable, Dimensions, Switch, Image } from 'react-native'
import { colors } from '../../global/colors'
import { useState, useEffect } from 'react'
import { useSignupMutation } from '../../services/authApi'
import { useDispatch } from 'react-redux'
import { setUserEmail, setUserLocalId } from '../../store/slices/userSlices'
import { saveSession, deleteSession } from '../../db'

const textInputWidth = Dimensions.get('window').width * 0.7

const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [persistSession, setPersistSession] = useState(false)
    const [triggerSignup, result] = useSignupMutation()
    const dispatch = useDispatch()

    const onsubmit = () => {
        return triggerSignup({ email, password, returnSecureToken: true })
    }

    useEffect(() => {
        (async () => {
            if (result.status === 'fulfilled') {
                try {
                    const { email: registeredEmail, localId: registeredLocalId } = result.data
                    dispatch(setUserEmail(registeredEmail))
                    dispatch(setUserLocalId(registeredLocalId))
                    if (persistSession) {
                        await saveSession(registeredEmail, registeredLocalId)
                    } else {
                        await deleteSession()
                    }
                } catch (error) {
                }
            }
        })()
    }, [result])

    return (
        <View style={styles.container}>
            <Image 
              source={require('../../../assets/logo.svg.png')}
              style={styles.logo}
              resizeMode='contain'
            />
            <Text style={styles.subTitle}>Crear cuenta</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    onChangeText={(text) => setEmail(text)}
                    placeholderTextColor={colors.black}
                    placeholder="Email"
                    style={styles.textInput}
                />
                <TextInput
                    onChangeText={(text) => setPassword(text)}
                    placeholderTextColor={colors.black}
                    placeholder='Password'
                    style={styles.textInput}
                    secureTextEntry
                />
            </View>
            <View style={styles.footTextContainer}>
                <Text style={styles.whiteText}>¿Ya tienes una cuenta?</Text>
                <Pressable onPress={() => navigation.navigate('Login')}>
                    <Text style={{
                        ...styles.whiteText,
                        ...styles.underLineText
                    }}>Inicia sesión</Text>
                </Pressable>
            </View>
            <Pressable style={styles.btn} onPress={onsubmit}><Text style={styles.btnText}>Registrarme</Text></Pressable>
            <View style={styles.rememberMe}>
                <Text style={{ color: colors.white }}>¿Mantener sesión iniciada?</Text>
                <Switch
                    onValueChange={() => setPersistSession(!persistSession)}
                    value={persistSession}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                />
            </View>
        </View>
    )
}

export default SignupScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary
    },
    subTitle: {
        fontFamily: "Montserrat",
        fontSize: 18,
        color: colors.sweetOrange,
        fontWeight: '700',
        letterSpacing: 3
    },
    inputContainer: {
        gap: 16,
        margin: 16,
        marginTop: 48,
        alignItems: 'center',
    },
    textInput: {
        padding: 8,
        paddingLeft: 16,
        borderRadius: 16,
        backgroundColor: colors.white,
        width: textInputWidth,
        color: colors.black,
    },
    footTextContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    whiteText: {
        color: colors.white
    },
    underLineText: {
        textDecorationLine: 'underline',
    },
    btn: {
        padding: 16,
        paddingHorizontal: 32,
        backgroundColor: colors.black,
        borderRadius: 16,
        marginTop: 32
    },
    btnText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700'
    },
    rememberMe: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8
    },
    logo: {
        width: 240,
        height: 140
    }
})