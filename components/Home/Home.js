import { ScrollView, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import Footer from "../../styles/Footer";


const Home = ({navigation}) => {
    return (
        <View style={MyStyles.container}>
            <ScrollView>
                <Text style={MyStyles.subject}>TRANG CHỦ</Text>
                <Footer/>
            </ScrollView>
    
            
            {/* <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={[MyStyles.text, MyStyles.margin]}>Đăng ký</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[MyStyles.text, MyStyles.margin]}>Đăng nhập</Text>
            </TouchableOpacity> */}
        </View>
    );
}

export default Home;