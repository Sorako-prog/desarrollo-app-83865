import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ShopStackNavigator from '../shop/ShopStackNavigator';
import CartStackNavigator from '../cart/CartStackNavigator';
import ProfileStackNavigator from '../profile/ProfileStackNavigator';
import OrdersStackNavigator from '../profile/OrdersStackNavigator';
import Icon from 'react-native-vector-icons/Feather'
import { StyleSheet, View, Text } from 'react-native';
import { colors } from '../../global/colors';
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

const TabsNavigator = () => {
    const cartItems = useSelector(state => state.cart.cartItems)
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.mediumGray,
                tabBarLabelStyle: styles.tabBarLabel
            }}
        >
            <Tab.Screen 
                name="Shop" 
                component={ShopStackNavigator} 
                options={{
                    tabBarIcon: ({focused})=>(<Icon name="shopping-bag" size={24} color={focused?colors.primary:colors.mediumGray} />)
                }}
                />
            <Tab.Screen 
                name="Cart" 
                component={CartStackNavigator} 
                options={{
                    tabBarIcon: ({focused})=>(
                        <View style={styles.cartIconContainer}>
                            <Icon name="shopping-cart" size={24} color={focused?colors.primary:colors.mediumGray} />
                            {totalItems > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{totalItems}</Text>
                                </View>
                            )}
                        </View>
                    ),
                }}
                />
            <Tab.Screen 
                name="Orders"
                component={OrdersStackNavigator}
                options={{
                    tabBarIcon: ({focused})=>(<Icon name="list" size={24} color={focused?colors.primary:colors.mediumGray} />)
                }}
            />
            <Tab.Screen 
                name="Profile" 
                component={ProfileStackNavigator} 
                options={{
                    tabBarIcon: ({focused})=>(<Icon name="user" size={24} color={focused?colors.primary:colors.mediumGray} />)
                }}
                />
        </Tab.Navigator>
    );
}

export default TabsNavigator

const styles = StyleSheet.create({
    tabBar:{
        paddingTop: 10,
        height: 80
    },
    tabBarLabel:{
        fontSize: 16,
        fontFamily: 'Lexend-Regular'
    },
    cartIconContainer: {
        position: 'relative'
    },
    badge: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: colors.secondary,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4
    },
    badgeText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'Lexend-Bold'
    }
})