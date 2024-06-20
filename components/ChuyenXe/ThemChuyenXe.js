import React, { useEffect, useState } from 'react';
import { Button, Image, View, StyleSheet, Text, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView } from 'react-native';
import API, { BASE_URL, endpoints } from '../../configs/API';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import { TextInput } from 'react-native-paper';

export default function ThemCX({navigation, route}) {
    const { TuyenXeID } = route.params;
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [name, setName] = useState('');
    const [ngay, setNgay] = useState('');
    const [giodi, setGioDi] = useState('');
    const [gioden, setGioDen] = useState('');
    const [chotrong, setChoTrong] = useState('');
    const [noidi, setNoiDi] = useState('');
    const [noiden, setNoiDen] = useState('');
    const [mataixe, setMaTaiXe] = useState('');
    const [maxe, setMaXe] = useState('');
    const [taixe, setTaiXe] = useState([]);
    const [xe, setXe] = useState([]);

    const loadTaiXe = async () => {
        if(page > 0){
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

    useEffect(() => {
        loadTaiXe();
        loadXe();
    }, []);

    const themChuyen = async () => {
        try {
        if (!name || !ngay || !giodi || !gioden || !chotrong || !noidi || !noiden || !mataixe || !maxe) {
            alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        const formattedNgay = moment(ngay, 'DD/MM/YYYY').format('YYYY-MM-DD');
        const response = await fetch(BASE_URL + endpoints['them_chuyenXe'], {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            TenChuyenXe: name,
            Ngay: formattedNgay,
            Ma_Tuyen: parseInt(TuyenXeID),
            Giodi: giodi,
            Gioden: gioden,
            Cho_trong: chotrong,
            Noidi: noidi,
            Noiden: noiden,
            Ma_TaiXe: parseInt(mataixe),
            Ma_Xe: parseInt(maxe),
            }),
        });

        if (!response.ok) {
            throw new Error('Đã xảy ra lỗi khi thêm chuyến xe');
        }
            alert('Thêm chuyến xe thành công!.');
            setName('');
            setNgay('');
            setGioDi('');
            setGioDen('');
            setChoTrong('');
            setNoiDi('');
            setNoiDen('');
            setMaTaiXe('');
            setMaXe('');
            quayLai(TuyenXeID);
        } catch (error) {
        console.error('Lỗi:', error.message);
        Alert.alert('Lưu ý' ,'Đã xảy ra lỗi khi thêm chuyến xe');
        }
    };

    const quayLai = (TuyenXeID) => {
        navigation.navigate('Chuyến xe', {TuyenXeID});
    }

    return (
        <KeyboardAvoidingView>
            <ScrollView contentContainerStyle={{ alignItems: 'center' }} style={{ marginTop: 15 }}>
                <TextInput
                    style={styles.input}
                    label="Tên chuyến xe"
                    value={name}
                    onChangeText={text => setName(text)}
                />
                <Text> Vui lòng nhập ngày theo định dạng DD/MM/YYYY!</Text>
                <TextInput
                    style={styles.input}
                    label="Ngày"
                    value={ngay}
                    onChangeText={text => setNgay(text)}
                />
                <TextInput
                    style={styles.input}
                    label="Giờ Đi"
                    value={giodi}
                    onChangeText={text => setGioDi(text)}
                />
                <TextInput
                    style={styles.input}
                    label="Giờ Đến"
                    value={gioden}
                    onChangeText={text => setGioDen(text)}
                />
                <TextInput
                    style={styles.input}
                    label="Số Chỗ"
                    value={chotrong}
                    onChangeText={text => setChoTrong(text)}
                />
                <TextInput
                    style={styles.input}
                    label="Nơi Đi"
                    value={noidi}
                    onChangeText={text => setNoiDi(text)}
                />
                <TextInput
                    style={styles.input}
                    label="Nơi Đến"
                    value={noiden}
                    onChangeText={text => setNoiDen(text)}
                />
                <Picker
                    selectedValue={mataixe}
                    style={styles.input}
                    onValueChange={(itemValue, itemIndex) => setMaTaiXe(itemValue)}
                >
                    <Picker.Item label="Chọn tài xế" value="" />
                    {taixe.map((tx, index) => (
                    <Picker.Item key={index} label={tx.Ten_taixe} value={tx.id} />
                    ))}
                </Picker>
                <Picker
                    selectedValue={maxe}
                    style={styles.input}
                    onValueChange={(itemValue, itemIndex) => setMaXe(itemValue)}
                >
                    <Picker.Item label="Chọn xe" value="" />
                    {xe.map((x, index) => (
                    <Picker.Item key={index} label={x.Bien_so} value={x.id} />
                    ))}
                </Picker>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button]} onPress={() => {quayLai(parseInt(TuyenXeID))}}>
                        <Text style={styles.buttonText}>Quay Lại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { width: 'auto' }]} onPress={themChuyen}>
                        <Text style={styles.buttonText}>Thêm chuyến xe</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    input: {
        marginBottom: 10,
        width: '90%',
        height: 55,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor:'#F2CED5'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        marginTop: 20,
        marginBottom: 50,
    },
    button: {
        backgroundColor: '#BF6B7B',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});