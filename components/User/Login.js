import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native"
import MyStyles from "../../styles/MyStyles"
import { useContext, useState } from "react"
import { Button, TextInput, TouchableRipple } from "react-native-paper";
import API, { authAPI, endpoints } from "../../configs/API";
import { useNavigation } from "@react-navigation/native";
import { MyDispatchContext } from "../../configs/MyContext";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Login = () => {
  
    
    const fields = [{
        "label": "Tên đăng nhập",
        "icon": "account",
        "name": "username",
    }, {
        "label": "Mật khẩu",
        "icon": "eye",
        "name": "password",
        "secureTextEntry": true,
    }]

    const nav = useNavigation();
    const [username, setUsername] = useState({});
    const [password, setPassword] = useState({});
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const dispatch = useContext(MyDispatchContext);

    //gọi api login
    const login = async () => {
        setLoading(true);
        try{
            
            let res = await API.post(endpoints['Login'], {
                ...user,
                'client_id': 'soVvyOundObf8QKoPdtmuJ7FH1BiJVdJrIZc0XyI',
                'client_secret': '2pJvXYrVbDLriOP43IDFcsOHJR8HprY2PbKQ07RvXTQeCmeNWfdBGN8dqPWT93wk66Z44rLwKoQXxd9H0nbh5Yy60UyxO0ZVzJhhevcNU2gQ7MpzJl7eqnHT6dM2UOlp',
                'grant_type': 'password',
            });
            console.info(res.data);

            await AsyncStorage.setItem('access_token', res.data.access_token);
            
            let userRes = await authAPI(res.data.access_token).get(endpoints['current-user']);
            console.info(userRes.data)

            dispatch({
                "type": "Login",
                "payload": userRes.data
            });

            nav.navigate("Home")

            //if (userRes.data.Loai_NguoiDung === "1") 
            //    nav.navigate("HomeAdmin");
            // } else {
            //     nav.navigate("Home");
            // }

            

        } catch(ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    const updateState = (field, value) => {
        setUser(current => {
            return {...current, [field]: value}
        })
    }



    return (
        <View style={MyStyles.container}>
            <ScrollView>
                <Text style={MyStyles.subject}>ĐĂNG NHẬP</Text>

                {fields.map(c => <TextInput 
                    value={user[c.name]} 
                    onChangeText={t => updateState(c.name, t)}
                    style={[MyStyles.margin, {backgroundColor: "#F2CED5"}]} 
                    key={c.label} 
                    label={c.label} 
                    secureTextEntry={c.secureTextEntry}
                    right={<TextInput.Icon icon={c.icon} />}/>
                )}

                <Button style={{backgroundColor: "#BF6B7B"}} loading={loading} icon="account" mode="contained" onPress={login}>ĐĂNG NHẬP</Button>
            </ScrollView>
            
            
        </View>
    )


}


export default Login;
