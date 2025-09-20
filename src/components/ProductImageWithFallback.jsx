import React, { useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { colors } from '../global/colors'

const ProductImageWithFallback = ({ 
    imageUri, 
    productTitle, 
    style, 
    containerStyle,
    resizeMode = 'cover' 
}) => {
    const [imageError, setImageError] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)

    const generateBlueColor = (title) => {
        let hash = 0
        for (let i = 0; i < title.length; i++) {
            hash = title.charCodeAt(i) + ((hash << 5) - hash)
        }

        const r = Math.abs(hash) % 100 + 100 
        const g = Math.abs(hash >> 8) % 100 + 50 
        const b = Math.abs(hash >> 16) % 100 + 150 
        
        return `rgb(${r}, ${g}, ${b})`
    }

    const backgroundColor = generateBlueColor(productTitle)
    
    const createTextPattern = () => {
        const words = productTitle.split(' ')
        const pattern = []
        
        for (let i = 0; i < 20; i++) {
            pattern.push(words[i % words.length])
        }
        
        return pattern.join(' • ')
    }

    const textPattern = createTextPattern()

    const handleImageError = () => {
        setImageError(true)
    }

    const handleImageLoad = () => {
        setImageLoaded(true)
    }

    return (
        <View style={[styles.container, containerStyle]}>
            {!imageError && imageUri && imageUri.trim() !== '' && (
                <Image
                    source={{ uri: imageUri }}
                    style={[style, { opacity: imageLoaded ? 1 : 0 }]}
                    resizeMode={resizeMode}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                />
            )}
            
            {(imageError || !imageUri || imageUri.trim() === '') && (
                <View style={[styles.fallbackContainer, { backgroundColor }]}>
                    <View style={styles.textContainer}>
                        <Text style={styles.patternText} numberOfLines={0}>
                            {textPattern}
                        </Text>
                        <Text style={styles.patternText} numberOfLines={0}>
                            {textPattern}
                        </Text>
                        <Text style={styles.patternText} numberOfLines={0}>
                            {textPattern}
                        </Text>
                    </View>
                    <View style={styles.overlay}>
                        <Text style={styles.productTitle} numberOfLines={2}>
                            {productTitle}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        overflow: 'hidden'
    },
    fallbackContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    textContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.1
    },
    patternText: {
        fontSize: 8,
        color: colors.white,
        fontFamily: 'Lexend-Regular',
        textAlign: 'center',
        lineHeight: 12,
        transform: [{ rotate: '-15deg' }]
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    productTitle: {
        fontSize: 16,
        fontFamily: 'Lexend-Bold',
        color: colors.white,
        textAlign: 'center',
        paddingHorizontal: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2
    }
})

export default ProductImageWithFallback
