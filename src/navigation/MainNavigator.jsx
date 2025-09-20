import AuthStackNavigator from "./auth/authStackNavigator";
import TabsNavigator from "./tabs/TabsNavigator";
import { useSelector, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { useGetProfilePictureQuery } from "../services/profileApi";
import { setUserImage, setUserEmail, setUserLocalId } from "../store/slices/userSlices";
import { useEffect } from "react";
import { initSessionTable, getSession } from "../db";

const MainNavigator = () => {
    const email = useSelector(state => state.user.email)
    const localId = useSelector(state => state.user.localId)
    

    const dispatch = useDispatch()

    const {data: profilePicture,isLoading,error} = useGetProfilePictureQuery(localId)

    useEffect(() => {
        const bootstrap = async () => {
            await initSessionTable()
            const session = await getSession()
            if (session) {
                console.log("Session:", session)
                dispatch(setUserEmail(session.email))
                dispatch(setUserLocalId(session.localId))
            }
        }
        bootstrap()
    }, [])

    useEffect(() => {
        if (profilePicture) {
            dispatch(setUserImage(profilePicture.image))
        }
    }, [profilePicture])
        
    return (
        <NavigationContainer>
            {email && localId ? <TabsNavigator /> : <AuthStackNavigator />}
        </NavigationContainer>
    )
}

export default MainNavigator