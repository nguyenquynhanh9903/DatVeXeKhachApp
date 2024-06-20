import { useContext } from "react";
import { MyDispatchContext, MyUserContext } from "../../configs/MyContext";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";

const Logout = () => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const nav = useNavigation();

    const logout = () => {
        dispatch({
            "type": "Logout"
        });
    }

    const goToLogin = () => {
        nav.navigate('Login');
    }

    if (user === null)
        return(
            <Button style={{backgroundColor: "#BF6B7B"}} mode="contained" icon="login" onPress={goToLogin}>Đăng nhập</Button>
        );

    return(
        <Button style={{backgroundColor: "#BF6B7B"}} mode="contained" icon="logout" onPress={logout}>Đăng xuất</Button>
    );
}

export default Logout;