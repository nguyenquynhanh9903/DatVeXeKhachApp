import { StyleSheet, Text, View } from "react-native";

const Footer = () => {
    return(
        <View style={styles.container}>
            <Text style={styles.title}>TRUNG TÂM TỔNG ĐÀI & CSKH</Text>
            <Text style={styles.phone}>1900 2548</Text>
            <Text style={styles.company}>CÔNG TY CỔ PHẦN XE KHÁCH ÁNH DƯƠNG</Text>
            <Text style={styles.address}>Địa chỉ: 97 Võ Văn Tần, phường 6, quận 3, Thành phố Hồ Chí Minh</Text>
            <Text style={styles.email}>Email: hotro@anhduong.vn</Text>
            <Text style={styles.fax}>Điện thoại: 02845134513</Text>
            <Text style={styles.fax}>Fax: 02845154515</Text>

            
            <Text style={[styles.footerCopyright]}>© 2024 | Đề tài: Quản lý đặt vé xe khách |
                    Sinh viên thực hiện: Phan Thị Tuyết Mai - Nguyễn Ngọc Quỳnh Anh</Text>
           
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    phone: {
        fontSize: 20,
        color: '#f00',
    },
    company: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
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
        color: 'black',
        marginTop: 20,
        fontSize: 12,
        textAlign: 'center',
    },
});

export default Footer;