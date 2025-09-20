import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from 'react-native';
import { CategoriesScreen, ProductsScreen, ProductScreen } from "../../screens";
import Header from "../../components/Header";
import Subtitle from "../../components/Subtitle";
import { useSelector } from 'react-redux'

const Stack = createNativeStackNavigator()

const ShopStackNavigator = () => {
    const categorySelected = useSelector(state => state.shop.categorySelected)
    return (
        <Stack.Navigator
            initialRouteName="Categorías"
            screenOptions={{
                header: ({route})=>(
                    <View>
                        <Header />
                        {route.name !== "Producto" && (
                            <Subtitle 
                                text={
                                    route.name === "Categorías" ? "Inicio" : categorySelected || "Productos"
                                }
                            />
                        )}
                    </View>
                )
            }}
        >
            <Stack.Screen name="Categorías" component={CategoriesScreen} />
            <Stack.Screen name="Productos" component={ProductsScreen} />
            <Stack.Screen name="Producto" component={ProductScreen} />
        </Stack.Navigator>
    )
}

export default ShopStackNavigator