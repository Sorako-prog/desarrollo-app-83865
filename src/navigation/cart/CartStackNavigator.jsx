import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from 'react-native';
import { CartScreen } from "../../screens";
import Header from "../../components/Header";
import Subtitle from "../../components/Subtitle";

const Stack = createNativeStackNavigator()

const CartStackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Carrito"
            screenOptions={{
                header: ({route})=>(
                    <View>
                        <Header />
                        <Subtitle text={route.name} />
                    </View>
                )
            }}
        >
            <Stack.Screen name="Carrito" component={CartScreen} />
        </Stack.Navigator>
    )
}

export default CartStackNavigator