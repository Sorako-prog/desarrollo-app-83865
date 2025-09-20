import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from 'react-native';
import { colors } from "../../global/colors";
import { ProfileScreen } from "../../screens";
import OrdersScreen from "../../screens/profile/OrdersScreen";
import Header from "../../components/Header";
import Subtitle from "../../components/Subtitle";
import { useSelector } from "react-redux";

const Stack = createNativeStackNavigator()

const ProfileStackNavigator = () => {
    const user = useSelector(state => state.user.email)
    return (
        <Stack.Navigator
            initialRouteName="Perfil"
            screenOptions={{
                contentStyle: { backgroundColor: colors.white },
                header: ({route})=>(
                    <View>
                        <Header />
                    </View>
                )
            }}
        >
            <Stack.Screen name="Perfil" component={ProfileScreen} />
            <Stack.Screen name="MisCompras" component={OrdersScreen} />
        </Stack.Navigator>
    )
}

export default ProfileStackNavigator