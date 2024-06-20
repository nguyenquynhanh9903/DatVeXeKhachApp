import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import Footer from "../../styles/Footer";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { MyUserContext } from "../../configs/MyContext";

const HomeAdmin = () => {
    const nav = useNavigation();
    const user = useContext(MyUserContext);

    return(
        <View style={MyStyles.container}>
            <ScrollView>
                <View>
                    <Text style={styles.subject}>Hi, {[user.first_name, user.last_name].join(' ')}!</Text>
                    <Text style={styles.text}>Mời bạn chọn các chức năng sau:</Text>
                    <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: '#f2b6c1' }]} 
                        onPress={() => nav.navigate('Tuyến xe')}>
                    <Text style={[MyStyles.text, MyStyles.margin]}>Quản lý tuyến xe</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: '#f2b6c1' }]} 
                        onPress={() => nav.navigate('Nhân viên')}>
                    <Text style={[MyStyles.text, MyStyles.margin]}>Quản lý nhân viên</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: '#f2b6c1' }]}
                        onPress={() => nav.navigate('Tài xế')}>
                    <Text style={[MyStyles.text, MyStyles.margin]}>Quản lý Tài xế</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: '#f2b6c1' }]}
                        onPress={() => nav.navigate('Khách hàng')}>
                    <Text style={[MyStyles.text, MyStyles.margin]}>Quản lý khách hàng</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: '#f2b6c1' }]}
                        onPress={() => nav.navigate('Thống kê')}>
                    <Text style={[MyStyles.text, MyStyles.margin]}>Thống kê</Text>
                    </TouchableOpacity>
                </View>
                <Footer/>  
            </ScrollView>
            
        </View>
    );

}

const styles = StyleSheet.create ({
    subject: {
        fontSize: 23,
        fontWeight: "bold",
        color: "#BF6B7B",
        marginTop: 20,
        textAlign: "center"
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        width: 300,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderRadius: 10,
        alignSelf:'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    },
    text: {
        fontSize: 18,
        marginTop: 5,
        marginBottom: 5,
        padding: 10
    }
})

export default HomeAdmin;