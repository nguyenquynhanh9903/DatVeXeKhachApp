import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Searchbar, TextInput } from "react-native-paper";
import API, { endpoints } from "../../configs/API";
import { useNavigation } from "@react-navigation/native";

const SuaTuyenXe = ({route}) => {
    const { tuyenxeID } = route.params;
    const nav = useNavigation();
    const [tuyenXe, setTuyenXe] = useState({});

    const fields = [{
        "label": "Tên tuyến xe",
        "icon": "text",
        "name": "Ten_tuyen"
    
    }, {
        "label": "Điểm đi",
        "icon": "text",
        "name": "Diendi"
    }, {
        "label": "Điểm đến",
        "icon": "text",
        "name": "Diemden"
    }, {
        "label": "Bảng giá",
        "icon": "text",
        "name": "BangGia"
    },];

    useEffect(() => {
        TuyenXeData();
    }, [tuyenxeID]);


    const updateState = (field, value) => {
        setTuyenXe(current => {
            return {...current, [field]: value}
        })
    };

    const TuyenXeData = async () => {
        try {
            const res = await API.get(`${endpoints['tuyenxe']}?matuyenxe=${tuyenxeID}`);
            const data = res.data.results;
            if (data && data.length > 0) {
                setTuyenXe(data[0]);
            }
        } catch (err) {
            console.error('Lỗi khi lấy thông tin tuyến xe.',err);
        }
    };

    const gotoDetail = (TuyenXeID) => {
        nav.navigate('Danh sách tuyến xe', {TuyenXeID})
    };

    const suaTuyenXe = async () => {
        try {
            await API.put(`${endpoints['tuyenxe']}${tuyenxeID}/Sua_TuyenXe/`, {
                Ten_tuyen: tuyenXe.Ten_tuyen,
                Diendi: tuyenXe.Diendi,
                Diemden: tuyenXe.Diemden,
                BangGia: tuyenXe.BangGia,
            });
            await TuyenXeData();
            console.log('Thông tin tuyến xe đã được cập nhật');
            Alert.alert(
                'Cập nhật thành công',
                'Bạn vui lòng quay lại trang Tuyến xe để xem sự thay đổi. Nếu không thấy sự thay đổi vui lòng thoát và tải lại.',
                [
                    {
                        text: 'OK',
                        onPress: () => nav.navigate('Danh sách tuyến xe')
                    }
                ],
                {cancelable: false}
            )

        } catch (err) {
            console.error('Lỗi khi cập nhật thông tin tuyến xe.', err);
        }
    }

    const xoaTuyenXe = async () => {
        try {
            await API.delete(`${endpoints['tuyenxe']}${tuyenxeID}/Xoa_TuyenXe`,);
            Alert.alert('Xóa tuyến xe thành công.');
            nav.navigate('Danh sách tuyến xe');
        } catch (err) {
            console.error('Không thể xóa tuyến xe.', err);
        }
    }

    return (
        <ScrollView>
            {fields.map(t => <TextInput
                value={tuyenXe[t.name]}
                onChangeText={c => updateState(t.name, c)} 
                key={t.label} 
                style={MyStyles.margin}
                label={t.label}
                right={<TextInput.Icon icon={t.icon} />} />)}
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, { width: 150 }]} onPress={suaTuyenXe}>
                    <Text>SAVE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { width: 150 }]} onPress={xoaTuyenXe}>
                    <Text>DELETE</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 35,
    },
    button: {
        backgroundColor: '#007bff',
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

export default SuaTuyenXe;