import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from 'react-native';
import OrdersScreen from "../../screens/profile/OrdersScreen";
import Header from "../../components/Header";
import Subtitle from "../../components/Subtitle";

const Stack = createNativeStackNavigator()

const OrdersStackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="MisCompras"
            screenOptions={{
                header: ({route})=>(
                    <View>
                        <Header />
                        <Subtitle text={route.name} />
                    </View>
                )
            }}
        >
            <Stack.Screen name="MisCompras" component={OrdersScreen} />
        </Stack.Navigator>
    )
}

export default OrdersStackNavigator


