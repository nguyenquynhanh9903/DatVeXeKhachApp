import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Alert, View, TouchableOpacity, Button, Image, KeyboardAvoidingView} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import API, { endpoints } from '../../configs/API';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import { TextInput } from 'react-native-paper';

const SuaChuyenXe = ({ route }) => {

    const navigation = useNavigation();
    const { ChuyenXeID } = route.params;
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [id, setID] = useState('');
    const [name, setName] = useState('');
    const [ngay, setNgay] = useState('');
    const [gioDi, setGioDi] = useState('');
    const [gioDen, setGioDen] = useState('');
    const [chotrong, setChoTrong] = useState('');
    const [noidi, setNoiDi] = useState('');
    const [noiden, setNoiDen] = useState('');
    const [matuyen, setMaTuyen] = useState('');
    const [mataixe, setMaTaiXe] = useState('');
    const [maxe, setMaXe] = useState('');
    const [taixe, setTaiXe] = useState([]);
    const [xe, setXe] = useState([]);

    const [selectedTaiXe, setSelectedTaiXe] = useState('');
    const [selectedXe, setSelectedXe] = useState('');

    useEffect(() => {
        ChuyenXeData();
        loadTaiXe(); 
        loadXe(); 
    }, [ChuyenXeID]);

    const ChuyenXeData = async () => {
        try {
            const response = await API.get(`${endpoints['chuyenxe']}?q=${ChuyenXeID}`);
            const data = response.data.results;
            if (data && data.length > 0) {
                const chuyenXe = data[0];
                setID(chuyenXe.id);
                setName(chuyenXe.TenChuyenXe);
                setNgay(chuyenXe.Ngay);
                setGioDi(chuyenXe.Giodi);
                setGioDen(chuyenXe.Gioden);
                setChoTrong(chuyenXe.Cho_trong);
                setNoiDi(chuyenXe.Noidi);
                setNoiDen(chuyenXe.Noiden);
                setMaTaiXe(chuyenXe.Ma_TaiXe); 
                setMaXe(chuyenXe.Ma_Xe);
                setMaTuyen(chuyenXe.Ma_Tuyen);

                await LayTaiXeById(chuyenXe.Ma_TaiXe);
                await LayXeById(chuyenXe.Ma_Xe);
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin chuyến xe:', error);
        }
    };

    const LayTaiXeById = async (id) => {
        try {
            const response = await API.get(`${endpoints['taixe']}?mataixe=${id}`);
            const taiXeData = response.data.results;
            if (taiXeData.length > 0) {
                setSelectedTaiXe(taiXeData[0].id); 
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin tài xế:', error);
        }
    };

    const LayXeById = async (id) => {
        try {
            const response = await API.get(`${endpoints['xe']}?q=${id}`);
            const xeData = response.data;
            if (xeData) {
                setSelectedXe(xeData[0].id); 
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin xe:', error);
        }
    };

    const handleTaiXeChange = (itemValue) => {
        setSelectedTaiXe(itemValue); 
    }

    const handleXeChange = (itemValue) => {
        setSelectedXe(itemValue); 
    };

    const loadTaiXe = async () => {
        if (page > 0){
            try {
                setLoading(true);
                let url = `${endpoints['taixe']}?page=${page}`;
                let res = await API.get(url);
                if (page === 1) {
                  setTaiXe(res.data.results);
                  setPage(page + 1);
                } else if (page !== 0) {
                  setTaiXe(current => [...current, ...res.data.results]);
                  setPage(page + 1);
                }
                if (res.data.next === null) {
                  setPage(0);
                }
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    };

    const loadXe = async () => {
        try {
            setLoading(true);
            const res = await API.get(endpoints['xe']);
            setXe(res.data);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    
    const quaylai = () => {
        navigation.navigate('Chuyến xe', { TuyenXeID: matuyen });
    }

    useEffect(() => {
        ChuyenXeData();
        loadTaiXe(); 
        loadXe(); 
    }, [ChuyenXeID]);

    const suaChuyenXe = async () => {
        try {

            const formattedNgay = moment(ngay).format('YYYY-MM-DD');
            const maTaiXe = selectedTaiXe || mataixe;
            const maXe = selectedXe || maxe;

            await API.put(`${endpoints['chuyenxe']}${ChuyenXeID}/Capnhat_ChuyenXe/`, {
                TenChuyenXe: name,
                Ngay: formattedNgay,
                Ma_Tuyen: parseInt(matuyen),
                Giodi: gioDi,
                Gioden: gioDen,
                Cho_trong: chotrong,
                Noidi: noidi,
                Noiden: noiden,
                Ma_TaiXe: parseInt(maTaiXe),
                Ma_Xe: parseInt(maXe),
            });
            console.log('Thông tin chuyến xe đã được cập nhật');
            Alert.alert(
                'Cập nhật thành công',
                'Bạn vui lòng quay lại trang Chuyến xe để xem sự thay đổi.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Chuyến xe', { TuyenXeID: matuyen })
                    },
                ],
                { cancelable: false }
            );
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin chuyến xe:', error);
        }
    };

    const XoaChuyenXe = async () => {
        try {
            Alert.alert(
                'Xác nhận xóa',
                'Bạn có chắc chắn muốn xóa chuyến xe này?',
                [
                    {
                        text: 'Hủy',
                        style: 'cancel'
                    },
                    {
                        text: 'Xóa',
                        onPress: async () => {
                            try {
                                const res = await API.delete(`${endpoints['chuyenxe']}${ChuyenXeID}/Xoa_ChuyenXe/`);
                                if (res.status === 204) {
                                    console.log('Chuyến xe được xóa thành công');
                                    Alert.alert(
                                        'Xóa thành công',
                                        'Bạn vui lòng quay lại trang Chuyến Xe để xem sự thay đổi. Nếu bạn không thấy sự thay đổi vui lòng thoát và tải lại',
                                        [
                                            {
                                                text: 'OK',
                                                onPress: () => navigation.navigate('Chuyến Xe', { TuyenXeID: matuyen })
                                            },
                                        ],
                                        { cancelable: false }
                                    );
                                } else {
                                    console.error('Không thể xóa chuyến xe');
                                    Alert.alert(
                                        'Lỗi',
                                        'Không thể xóa chuyến xe. Vui lòng thử lại sau.'
                                    );
                                }
                            } catch (error) {
                                console.error('Error:', error);
                                Alert.alert(
                                    'Lỗi',
                                    'Đã xảy ra lỗi khi xóa chuyến xe. Vui lòng thử lại sau.'
                                );
                            }
                        }
                    },
                ],
                { cancelable: false }
            );
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <KeyboardAvoidingView>

        
            <ScrollView style={styles.container}>
                <Text style={styles.label}>Tên chuyến xe:</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                />
                <Text style={styles.label}>Ngày:</Text>
                <TextInput
                    style={styles.input}
                    value={ngay}
                    onChangeText={setNgay}
                />
                <Text style={styles.label}>Giờ Đi:</Text>
                <TextInput
                    style={styles.input}
                    value={gioDi}
                    onChangeText={setGioDi}
                />
                <Text style={styles.label}>Giờ Đến:</Text>
                <TextInput
                    style={styles.input}
                    value={gioDen}
                    onChangeText={setGioDen}
                />
                <Text style={styles.label}>Số lượng ghế:</Text>
                <TextInput
                    style={styles.input}
                    value={chotrong}
                    onChangeText={setChoTrong}
                />
                <Text style={styles.label}>Nơi Đi:</Text>
                <TextInput
                    style={styles.input}
                    value={noidi}
                    onChangeText={setNoiDi}
                />
                <Text style={styles.label}>Nơi Đến:</Text>
                <TextInput
                    style={styles.input}
                    value={noiden}
                    onChangeText={setNoiDen}
                />
                <Text style={styles.label}>Tài Xế:</Text>
                <Picker
                    selectedValue={selectedTaiXe}
                    onValueChange={handleTaiXeChange}
                    style={{backgroundColor: '#d8d6d0'}}
                >
                    {taixe && taixe.map((c) => (
                        <Picker.Item key={c.id} label={c.Ten_taixe} value={c.id} />
                    ))}
                </Picker>
                <Text style={styles.label}>Xe:</Text>
                <Picker
                    selectedValue={selectedXe}
                    onValueChange={handleXeChange}
                    style={{backgroundColor: '#d8d6d0'}}
                >
                    {xe && xe.map((item) => (
                        <Picker.Item key={item.id} label={item.Ten_xe} value={item.id} />
                    ))}
                </Picker>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, { width: 150 }]} onPress={quaylai}>
                        <Text style={styles.buttonText}>Quay Lại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { width: 150 }]} onPress={XoaChuyenXe}>
                        <Text style={styles.buttonText}>Xóa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { width: 150 }]} onPress={suaChuyenXe}>
                        <Text style={styles.buttonText}>Cập nhật</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    ); 
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    label: {
        marginBottom: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        fontSize: 16,
        backgroundColor:'#F2CED5'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 35,
    },
    button: {
        width:200,
        height: 50,
        backgroundColor: '#BF6B7B',
        //paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        margin: 5,
        marginTop: 20
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SuaChuyenXe;