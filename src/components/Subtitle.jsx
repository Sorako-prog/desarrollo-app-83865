import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../global/colors'

const Subtitle = ({ text }) => {
    if (!text) return null
    
    return (
        <View style={styles.container}>
            <Text style={styles.subtitle}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center'
    },
    subtitle: {
        fontSize: 16,
        color: colors.darkGray,
        fontFamily: 'Lexend-Regular',
        textAlign: 'center'
    }
})

export default Subtitle
