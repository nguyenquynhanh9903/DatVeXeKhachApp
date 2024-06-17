import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import Footer from "../../styles/Footer";
import { useNavigation } from "@react-navigation/native";

const HomeAdmin = () => {
    const nav = useNavigation();

    return(
        <View style={MyStyles.container}>
            <ScrollView>
                <Text style={styles.subject}>Hi, Admin!</Text>
                <TouchableOpacity onPress={() => nav.navigate('Thêm tuyến xe')}>
                <Text style={[MyStyles.text, MyStyles.margin]}>Thêm tuyến xe</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate('Thêm chuyến xe')}>
                <Text style={[MyStyles.text, MyStyles.margin]}>Thêm chuyến xe</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate('Đặt vé')}>
                <Text style={[MyStyles.text, MyStyles.margin]}>Đặt vé xe</Text>
                </TouchableOpacity>
            </ScrollView>
            <Footer/>
        </View>
    );

}

const styles = StyleSheet.create ({
    subject: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#BF6B7B",
        marginTop: 10,
        textAlign: "center"
    }
})

export default HomeAdmin;