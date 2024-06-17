import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import MyContext, { MyUserContext } from '../../configs/MyContext';
import API, { BASE_URL, authAPI, endpoints } from '../../configs/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomerForm from './InfoKhach';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';


const DatVe = ({ route }) => {
    const navigation = useNavigation();
    const { ChuyenXeID } = route.params;
    const user = useContext(MyUserContext);
    const [chuyenxe, setChuyenXe] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [ghe, setGhe] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [tuyen, setTuyen] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [le, setLe] = useState([]);

    const loadChuyenXe = async () => {
        try {
            const res = await API.get(`${endpoints['chuyenxe']}?q=${ChuyenXeID}`);
            setChuyenXe(res.data.results);
            if (res.data.results.length !== 0) {
                for (let i = 0; i < res.data.results.length; i++) {
                    const chuyenXe = res.data.results[i];
                    const resGhe = await API.get(`${endpoints['ghe']}?q=${chuyenXe.Ma_Xe}`);
                    setGhe(resGhe.data);
                    const resTuyen = await API.get(`${endpoints['tuyenxe']}?q=${chuyenXe.Ma_Tuyen}`);
                    setTuyen(resTuyen.data.results);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    const loadLe = async () => {
        try {
            const res = await API.get(endpoints['le']);
            setLe(res.data);
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        loadChuyenXe();
        loadLe();
    }, [ChuyenXeID]);


    const handleCustomerSubmit = customer => {
        setCustomers(prevCustomers => [...prevCustomers, customer]);
    };

    const handlePaymentMethodSelect = (method) => {
        setPaymentMethod(method);
    };

    const handleSeatSelect = seat => {
        if (selectedSeats.includes(seat)) {
            setSelectedSeats(prevSeats => prevSeats.filter(s => s !== seat));
        } else {
            setSelectedSeats(prevSeats => [...prevSeats, seat]);
        }
    };

    const gia = tuyen.map(c => c.BangGia);

    const formDate = (date) => {
        return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
    }

    const tinhTien = () => {
        const soGheDaChon = selectedSeats.length;
        let tongTien = soGheDaChon * gia; 
        chuyenxe.forEach(chuyen => {
            const ngayChuyen = formDate(chuyen.Ngay);
            const tangGia = le.find(item => item.Le === ngayChuyen);
            if (tangGia) {
                const phanTramTang = parseFloat(tangGia.Tang.replace("%", ""));
                tongTien *= 1 + phanTramTang / 100;
            }
        });
        return tongTien;
    };
    


    const giaLe = () => {
        const giaLe = chuyenxe.map(c => {
            const ngayFormatted = formDate(c.Ngay);
            const ngayLeItem = le.find(item => item.Le === ngayFormatted);
            if (ngayLeItem) {
                const phantram = 1 + parseFloat(ngayLeItem.Tang.replace("%", "")) / 100;
                const giaSauTang = gia * phantram;
                return giaSauTang;
            } else {
                return gia;
            }
        });
        return giaLe;
    }
    

    const dinhDangGia = (gia) => {
        // Sử dụng hàm toLocaleString để định dạng số thành chuỗi với dấu phân cách
        const giaDinhDang = gia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        return giaDinhDang;
    };

    const handleSubmit = async () => {
        if (user && user.Loai_NguoiDung === "3" || user.Loai_NguoiDung === "1" || user.Loai_NguoiDung === "4"){
            try {
                // 1. Gửi thông tin của từng khách hàng qua API POST để tạo khách hàng mới
                const customerIds = [];
                for (const customer of customers) {
                    const customerData = {
                        Ten_KH: customer.name,
                        DiaChi: customer.diachi,
                        CMND: customer.CMND,
                        DienThoai: customer.dienthoai,
                        Email: customer.email,
                    };
                    const customerRes = await API.post(endpoints['them_KH_Di'], customerData, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    customerIds.push(customerRes.data.id);
                }
                
                let trangthai_TT = '';
                if (paymentMethod) {
                    // Xử lý logic cho phương thức thanh toán được chọn ở đây
                    switch (paymentMethod) {
                        case 'momo':
                            // Thực hiện thanh toán qua Momo
                            trangthai_TT = 'Đã thanh toán qua Momo';
                            break;
                        case 'zalo':
                            // Thực hiện thanh toán qua Zalo
                            trangthai_TT = 'Đã thanh toán qua Zalo';
                            break;
                        case 'cash':
                            // Thực hiện thanh toán trực tiếp tại quầy
                            trangthai_TT = 'trực tiếp';
                            break;
                        default:
                            break;
                    }
                }

                const veID = [];
                // 2. Thực hiện tạo vé và chi tiết vé cho từng khách hàng
                for (let i = 0; i < customers.length; i++) {
                    const customerId = customerIds[i];
                    const ticketData = {
                        Ma_NhanVien: null,
                        Ma_KhachHang: parseInt(customerId),
                        Ma_ChuyenXe: parseInt(chuyenxe.map(c => c.id)),
                        Gia: (giaLe()).toString(),
                        trangthai_TT: trangthai_TT.toString(),
                    };
                    const ticketRes = await API.post(endpoints['them_Ve'], ticketData, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const ticketId = ticketRes.data.id;
                    veID.push(ticketId);
                }
                console.log(veID);
                // 2.1. Thêm dữ liệu chi tiết vé cho từng ghế đã chọn của khách hàng
                const ticketDetailData = [];
                for (const c of veID) {
                    const ticketDetailData = []; // Khởi tạo mảng mới cho mỗi vé xe
                    await Promise.all(selectedSeats.map(async seat => {
                        try {
                            const resGheDaChon = await API.get(`${endpoints['ghe']}?maghe=${seat}`);
                            const gheDaChon = resGheDaChon.data;

                            const detailData = gheDaChon.map(seat => ({
                                Ma_Ve: c,
                                Ma_Xe: parseInt(seat.Bienso_Xe),
                                Vi_tri_ghe_ngoi: parseInt(seat.id),
                                Ghichu: "aaaaa",
                            }));
                            ticketDetailData.push(...detailData);
                        } catch (error) {
                            console.error(error);
                            return null; // Trả về null nếu có lỗi xảy ra
                        }
                    }));
                    let accessToken = await AsyncStorage.getItem("access_token");
                    for (const detailData of ticketDetailData) {
                        await authAPI(accessToken).post(endpoints['them_chi_tiet_ve'](c), detailData , {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                    }
                }
        
                // 3. Cập nhật lại trạng thái của các ghế đã chọn
                const selectedSeatsData = await Promise.all(selectedSeats.map(async seat => {
                    try {
                        const resGheDaChon = await API.get(`${endpoints['ghe']}?maghe=${seat}`);
                        const gheDaChon = resGheDaChon.data;
                        if (gheDaChon.length > 0) {
                            const gheId = gheDaChon[0].id; // Lấy id của ghế từ dữ liệu API
                            return {
                                id: gheId, // ID của ghế
                                trangthai: 'booked', // Trạng thái mới của ghế
                            };
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }));
        
                // Thực hiện cập nhật trạng thái của các ghế đã chọn
                await Promise.all(selectedSeatsData.map(async seatData => {
                    if (seatData) {
                        try {
                            await API.patch(endpoints['trang_thai_ghe'](seatData.id), seatData);
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }));
                
                // Hiển thị thông báo hoặc thực hiện các hành động sau khi hoàn tất quá trình đặt vé thành công
                //Alert.alert('Đã đặt vé thành công!');
            } catch (error) {
                console.error(error);
                // Xử lý lỗi khi gửi thông tin không thành công
                Alert.alert('Có lỗi xảy ra khi thực hiện đặt vé. Vui lòng thử lại sau!');
            }
        }
        else if(user && user.Loai_NguoiDung === "2"){
            const [nhanvien, setNhanVien] = useState('');
            const resNV = await API.get(`${endpoints['nhanvien']}?q=${user.username}`);
            setNhanVien(resNV.data.results);
            try {
                // 1. Gửi thông tin của từng khách hàng qua API POST để tạo khách hàng mới
                const customerIds = [];
                for (const customer of customers) {
                    const customerData = {
                        Ten_KH: customer.name,
                        DiaChi: customer.diachi,
                        CMND: customer.CMND,
                        DienThoai: customer.dienthoai,
                        Email: customer.email,
                    };
                    const customerRes = await API.post(endpoints['them_KH_Di'], customerData, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    customerIds.push(customerRes.data.id);
                }
                

                const veID = [];
                console.log(giaLe());
                // 2. Thực hiện tạo vé và chi tiết vé cho từng khách hàng
                for (let i = 0; i < customers.length; i++) {
                    const customerId = customerIds[i];
                    const ticketData = {
                        Ma_NhanVien: parseInt(nhanvien.map(c => c.id)),
                        Ma_KhachHang: parseInt(customerId),
                        Ma_ChuyenXe: parseInt(chuyenxe.map(c => c.id)),
                        Gia: (giaLe()).toString(),
                        trangthai_TT: "",
                    };
                    const ticketRes = await API.post(endpoints['them_Ve'], ticketData, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const ticketId = ticketRes.data.id;
                    veID.push(ticketId);
                }
                console.log(veID);
                // 2.1. Thêm dữ liệu chi tiết vé cho từng ghế đã chọn của khách hàng
                const ticketDetailData = [];
                let a = 0;
                for (const c of veID) {
                    const ticketDetailData = []; // Khởi tạo mảng mới cho mỗi vé xe
                    await Promise.all(selectedSeats.map(async seat => {
                        try {
                            const resGheDaChon = await API.get(`${endpoints['ghe']}?maghe=${seat}`);
                            const gheDaChon = resGheDaChon.data;

                            const detailData = gheDaChon.map(seat => ({
                                Ma_Ve: c,
                                Ma_Xe: parseInt(seat.Bienso_Xe),
                                Vi_tri_ghe_ngoi: parseInt(seat.id),
                                Ghichu: "aaaaa",
                            }));
                            ticketDetailData.push(...detailData);
                        } catch (error) {
                            console.error(error);
                            return null; // Trả về null nếu có lỗi xảy ra
                        }
                    }));
                    console.log(ticketDetailData);
                    let accessToken = await AsyncStorage.getItem("access_token");
                    for (const detailData of ticketDetailData) {
                        await authAPI(accessToken).post(endpoints['them_chi_tiet_ve'](c), detailData , {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                    }
                }
        
                // 3. Cập nhật lại trạng thái của các ghế đã chọn
                const selectedSeatsData = await Promise.all(selectedSeats.map(async seat => {
                    try {
                        const resGheDaChon = await API.get(`${endpoints['ghe']}?maghe=${seat}`);
                        const gheDaChon = resGheDaChon.data;
                        if (gheDaChon.length > 0) {
                            const gheId = gheDaChon[0].id; // Lấy id của ghế từ dữ liệu API
                            return {
                                id: gheId, // ID của ghế
                                trangthai: 'booked', // Trạng thái mới của ghế
                            };
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }));
        
                // Thực hiện cập nhật trạng thái của các ghế đã chọn
                await Promise.all(selectedSeatsData.map(async seatData => {
                    if (seatData) {
                        try {
                            await API.patch(endpoints['trang_thai_ghe'](seatData.id), seatData);
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }));
                
                // Hiển thị thông báo hoặc thực hiện các hành động sau khi hoàn tất quá trình đặt vé thành công
                Alert.alert('Đã đặt vé thành công!');
                navigation.navigate('Danh sách đơn hàng');
            } catch (error) {
                console.error(error);
                Alert.alert('Có lỗi xảy ra khi thực hiện đặt vé. Vui lòng thử lại sau!');
            }
        }
    };
    
    
    return (
        <ScrollView>
            <Text style={styles.title}>Thông tin đặt vé</Text>
            {/* Thông tin chuyến xe */}
            <View style={{ flex: 1 }}>
                <Text style={styles.headerText}>Chuyến Xe</Text>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Tên chuyến xe</Text>
                    <Text style={styles.headerText}>Thời gian đi</Text>
                    <Text style={styles.headerText}>Thời gian đến</Text>
                </View>
                {chuyenxe.map(c => (
                    <View style={styles.row} key={c.id}>
                        <Text style={styles.cell}>{c.TenChuyenXe}</Text>
                        <Text style={styles.cell}>{c.Giodi}</Text>
                        <Text style={styles.cell}>{c.Gioden}</Text>
                    </View>
                ))}
            </View>
            {/* Thông tin ghế */}
            <View style={{ marginTop: 20 }}>
                <Text style={styles.headerText}>Ghế</Text>
                <View style={styles.seatContainer}>
                {ghe.map(c => (
                    <TouchableOpacity
                        key={c.id}
                        style={[
                            styles.seat,
                            selectedSeats.includes(c.So_ghe) && styles.selectedSeat,
                            c.trangthai === 'booked' && { backgroundColor: 'green' },
                        ]}
                        onPress={() => {
                            if (c.trangthai !== 'booked') {
                                handleSeatSelect(c.So_ghe);
                            }
                        }}
                    >
                        <Text style={styles.seatText}>{c.So_ghe}</Text>
                    </TouchableOpacity>
                ))}
                </View>
            </View>
            {/* Thông tin khách hàng */}
            {customers.length > 0 && (
                <View>
                    <Text style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold', marginLeft: 130 }}>Khách Hàng</Text>
                </View>
            )}
            <View style={{ marginTop: 20 }}>
                {customers.map((customer, index) => (
                    <View key={index} style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 20, marginBottom: 10 }}>Khách hàng {index + 1}</Text>
                        <Text style={{ fontSize: 16 }}>Tên: {customer.name}</Text>
                        <Text style={{ fontSize: 16 }}>Email: {customer.email}</Text>
                        <Text style={{ fontSize: 16 }}>Điện Thoại: {customer.dienthoai}</Text>
                        <Text style={{ fontSize: 16 }}>Địa chỉ: {customer.diachi}</Text>
                        <Text style={{ fontSize: 16 }}>CMND: {customer.CMND}</Text>
                    </View>
                ))}
            </View>
            <CustomerForm onSubmit={handleCustomerSubmit} />
            <View style={styles.paymentMethodsContainer}>
                <Text style={styles.paymentMethodTitle}>Chọn phương thức thanh toán:</Text>
                <TouchableOpacity
                    style={[styles.paymentMethodButton, paymentMethod === 'momo' && styles.selectedPaymentMethod]}
                    onPress={() => handlePaymentMethodSelect('momo')}
                >
                    <Text style={styles.paymentMethodText}>Thanh toán qua Momo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.paymentMethodButton, paymentMethod === 'zalo' && styles.selectedPaymentMethod]}
                    onPress={() => handlePaymentMethodSelect('zalo')}
                >
                    <Text style={styles.paymentMethodText}>Thanh toán qua Zalo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.paymentMethodButton, paymentMethod === 'cash' && styles.selectedPaymentMethod]}
                    onPress={() => handlePaymentMethodSelect('cash')}
                >
                    <Text style={styles.paymentMethodText}>Thanh toán trực tiếp tại quầy</Text>
                </TouchableOpacity>
            </View>
            {/* Hiển thị tổng tiền thanh toán */}
            <Text style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold', marginLeft: 130 }}>
                Tổng tiền thanh toán: {dinhDangGia(tinhTien())}
            </Text>
            <Button
                containerStyle={{ marginTop: 15 }}
                title="Hoàn tất đặt vé"
                onPress={handleSubmit}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    headerText: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 18,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 10,
    },
    cell: {
        flex: 1,
        textAlign: 'center',
    },
    seatContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    seat: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedSeat: {
        backgroundColor: 'blue',
    },
    seatText: {
        color: 'black',
        fontSize: 16,
    },
    paymentMethodsContainer: {
        marginTop: 20,
    },
    paymentMethodTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    paymentMethodButton: {
        backgroundColor: '#eee',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    selectedPaymentMethod: {
        backgroundColor: 'lightblue',
    },
    paymentMethodText: {
        fontSize: 16,
    },
});

export default DatVe;