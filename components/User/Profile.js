import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MyContext, { MyUserContext } from '../../configs/MyContext';
import API, { endpoints } from '../../configs/API';
import { ScrollView } from 'react-native';
import { Button, TouchableRipple } from 'react-native-paper';
import MyStyles from '../../styles/MyStyles';


const Profile = () => {
    const user = useContext(MyUserContext);
    const [ve, setVe] = useState([]);
    const [chitiet, setChiTiet] = useState([]);
    const [allTickets, setAllTickets] = useState([]);
    const [allGhe, setAllGhe] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tenchuyen, setTen] = useState([]);
    const [chucvu, setChucVu] = useState([]);
    const [gioDi, setGioDi] = useState([]);
    const [ticketDetailsVisible, setTicketDetailsVisible] = useState(false);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const loadVe = async () => {
        try {
            setLoading(true);
            const res = await API.get(`${endpoints['chitietve']}?mauser=${user.id}`);
            setChiTiet(res.data);
            const veData = await Promise.all(res.data.map(async (c) => {
                const resVe = await API.get(`${endpoints['ve']}?mave=${c.vexe}`);
                return resVe.data;
            }));
            setVe(veData);
            let tickets = [];
            veData.forEach(array => {
                array.forEach(ticket => {
                    tickets.push(ticket);
                });
            });
            setAllTickets(tickets);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadChuyen = async (allTickets) => {
        try {
            const tenChuyenXeArray = [];
            const gioArray = [];
            for (const ticket of allTickets) {
                const resChuyen = await API.get(`${endpoints['chuyenxe']}?q=${ticket.Ma_ChuyenXe}`);
                if (Array.isArray(resChuyen.data.results)) {
                    const filteredResults = resChuyen.data.results.filter(result => !("_h" in result && "_i" in result && "_j" in result && "_k" in result));
                    const tenChuyenXe = filteredResults.map(c => c.TenChuyenXe);
                    const giodi = filteredResults.map(c => c.Giodi);
                    tenChuyenXeArray.push(...tenChuyenXe);
                    gioArray.push(...giodi);
                }
            }
            setTen(tenChuyenXeArray);
            setGioDi(gioArray);
        } catch (error) {
            console.error(error);
        }
    }; 

    const loadGhe = async (chitiet, allTickets) => {
        try{
            const tenGheArray = [];
            for (c of chitiet){
                for (d of allTickets){
                    if(c.vexe == d.id){
                        const resGhe = await API.get(`${endpoints['ghe']}?gheID=${c.Vi_tri_ghe_ngoi}`);
                        if (Array.isArray(resGhe.data)) {
                            const filteredResults = resGhe.data.filter(result => !("_h" in result && "_i" in result && "_j" in result && "_k" in result));
                            const tenGhe = filteredResults.map(c => c.So_ghe);
                            tenGheArray.push(...tenGhe);
                        }
                    }
                }
            }
            setAllGhe(tenGheArray);
        } catch (error) {
            console.error(error);
        }
    }

    const Chucvu = async () => {
        try{
            const resChucvu = await API.get(`${endpoints['chucvu']}?ma=${user.Loai_NguoiDung}`);
            setChucVu(resChucvu.data);
        } catch (error){
            console.log(error);
        }
    }


    useEffect(() => {
        loadVe();  
        Chucvu();
    }, []);

    const uniqueTickets = Array.from(new Set(allTickets.map(ticket => ticket.id)))
    .map(id => {
        return allTickets.find(ticket => ticket.id === id);
    });

    useEffect(() => {
        const fetchData = async () => {
            await loadChuyen(allTickets);
            await loadGhe(chitiet, allTickets)
        };
        fetchData();
    }, [chitiet, allTickets]);

    const uniqueGhe = allGhe.filter((value, index, self) => {
        return self.indexOf(value) === index;
    });

    function chuyenDoiNgay(chuoiThoiGian) {
        const date = new Date(chuoiThoiGian);
        const ngay = date.getDate();
        const thang = date.getMonth() + 1; 
        const nam = date.getFullYear();
        const ngayFormatted = ngay < 10 ? '0' + ngay : ngay;
        const thangFormatted = thang < 10 ? '0' + thang : thang;
        return ngayFormatted + '/' + thangFormatted + '/' + nam;
    }

    const toggleTicketDetailsVisibility = () => {
        setTicketDetailsVisible(!ticketDetailsVisible);
    };

    const renderTicketDetails = () => {
        return (
            <ScrollView>
                {uniqueTickets.map((ticket, index) => (
                    <View key={index} style={styles.itemContainer} >
                        <Text>Mã vé: {ticket.id}</Text>
                        <Text>Ngày đặt: {chuyenDoiNgay(ticket.updated_date)}</Text>
                        <Text>Thanh toán: {ticket.trangthai_TT}</Text>
                        <Text>Chuyến Xe: {tenchuyen[index]}</Text>
                        <Text>Ghế ngồi: {uniqueGhe[index]}</Text>
                        <Text>Giờ đi: {gioDi[index]}</Text>
                        {new Date(ticket.updated_date) >= today ? 
                            <Text style={{color: 'blue', marginLeft: 220}}>Chưa hoàn thành</Text> : <Text style={{color: 'blue', marginLeft: 220}}>Đã hoàn thành</Text>}
                    </View>
                ))}
            </ScrollView>
        );
    };

    return (
        <>
            <ScrollView>
            <View>
                <Text style={MyStyles.subject}>THÔNG TIN TÀI KHOẢN</Text>
                <View>
                    <Image
                        source={{
                            uri: user.avatar.endsWith('.jpeg') 
                            ? `file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FMyMobileApp-caeae716-14f8-42e8-8345-b048446019bf/ImagePicker/${c.avatar.substring(c.avatar.lastIndexOf('/') + 1)}`
                            : user.avatar
                        }} 
                        style={styles.image} 
                        resizeMethod='auto'
                    />
                    <View style={styles.border}>
                        <Text style={styles.text}>Tên : {[ user.last_name, user.first_name].join(' ')}</Text>
                        <Text style={styles.text}>Email: {user.email}</Text>
                        {chucvu && chucvu.map(
                            c => (
                                <Text key={c.id} style={styles.text}>Bạn là: {c.loai.toUpperCase()}</Text>
                            )
                        )}
                    </View>
                </View>
            </View>
            <TouchableRipple>
                <Text style={styles.detailsLink} onPress={toggleTicketDetailsVisibility}>Xem chi tiết đơn hàng</Text>
            </TouchableRipple>
                {ticketDetailsVisible && renderTicketDetails()}
            </ScrollView>
        </>
    );
};
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        text: {
            fontSize: 18,
            //fontFamily:'sans-serif'
        },
        itemContainer: {
            borderWidth: 1, 
            borderColor: 'black', 
            borderRadius: 5, 
            padding: 10, 
            marginBottom: 10, 
            width: 350,
            marginLeft: 30,
            marginTop: 20,
        },
        imageContainer: {
            alignItems: 'center',
            marginBottom: 20,
        },
        image: {
            width: 200,
            height: 200,
            marginTop: 25,
            marginBottom: 25, 
            marginLeft: 98,
            borderRadius: 100,
        },
        detailsLink: {
            color: 'blue',
            textDecorationLine: 'underline',
            marginTop: 10,
            marginLeft: 260,
        },
        border: {
            justifyContent: 'center',
            backgroundColor:'#F2B6C1',
            borderColor: 'black',
            borderWidth: 2,
            borderRadius: 20,
            padding: 20,
            marginTop: 10,
            marginLeft:30,
            marginRight: 40,
            marginBottom: 30,
        }
    });
    
export default Profile;