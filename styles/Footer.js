import { StyleSheet, Text, View } from "react-native";

const Footer = () => {
    return(
        <View style={styles.container}>
            <View style={{alignItems: 'center'}}>
                <Text style={styles.title}>TRUNG TÂM TỔNG ĐÀI & CSKH</Text>
                <Text style={styles.phone}>1900 2548</Text>
                <Text style={styles.company}>CÔNG TY CỔ PHẦN XE KHÁCH MAI ANH</Text>
                <Text style={styles.address}>Địa chỉ: 97 Võ Văn Tần, phường 6, quận 3, Thành phố Hồ Chí Minh</Text>
                <Text style={styles.email}>Email: hotro@maianhbus.vn</Text>
                <Text style={styles.fax}>Điện thoại: 02845134513</Text>
                <Text style={styles.fax}>Fax: 02845154515</Text>
            </View>

            <View style={{backgroundColor: '#708b50', width: 400, height: 80, marginTop: 20}}>
                <Text style={[styles.footerCopyright]}>© 2024 | Đề tài: Quản lý đặt vé xe khách |
                Sinh viên thực hiện: Phan Thị Tuyết Mai - Nguyễn Ngọc Quỳnh Anh</Text>
            </View>
            
           
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#d989ae',
        alignItems: 'center',
        marginTop: 20,
        //paddingTop: 30
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    phone: {
        fontSize: 25,
        color: '#d90d19',
    },
    company: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
    address: {
        fontSize: 14,
        textAlign: 'center',
    },
    email: {
        fontSize: 14,
    },
    fax: {
        fontSize: 14,
    },
    footerCopyright: {
        backgroundColor: '#OB2559',
        color: 'white',
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10,
        fontSize: 13,
        textAlign: 'center',
    },
});

export default Footer;