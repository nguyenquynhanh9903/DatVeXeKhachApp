import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Alert, View, TouchableOpacity, Button, Image} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import API, { endpoints } from '../../configs/API';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const SuaKhachHang = ({ route }) => {
    const navigation = useNavigation();
    const { khachhangID } = route.params;
    const [id, setID] = useState('');
    const [name, setName] = useState('');
    const [ngaySinh, setNgaySinh] = useState('');
    const [gioiTinh, setGioiTinh] = useState('');
    const [diaChi, setDiaChi] = useState('');
    const [cmnd, setCMND] = useState('');
    const [dienThoai, setDienThoai] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [oldAvatar, setOldAvatar] = useState(null); 
    const [newAvatar, setNewAvatar] = useState(null);

    useEffect(() => {
        KhachHangData();
    }, [khachhangID]);

    const KhachHangData = async () => {
        try {
            const response = await API.get(`${endpoints['khachhang']}?makhach=${khachhangID}`);
            const data = response.data.results;
            data && data.map(
                c => {
                    setID(c.id);
                    setName(c.Ten_KH);
                    setNgaySinh(c.NgaySinh);
                    setGioiTinh(c.GioiTinh);
                    setDiaChi(c.DiaChi);
                    setCMND(c.CMND);
                    setDienThoai(c.DienThoai);
                    setEmail(c.Email);
                    setAvatar(c.avatar); // Set avatar to current image URI
                    setOldAvatar(c.avatar); // Set oldAvatar to current image URI
                }
            )
        } catch (error) {
            console.error('Lỗi khi lấy thông tin nhân viên:', error);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            const fileNameWithExtension = uri.substring(uri.lastIndexOf('/') + 1); // Get file name with extension
            setNewAvatar(fileNameWithExtension); // Set newAvatar to URI of newly selected image
        }
    };

    const gotoDetail = (KhachHangID) => {
        navigation.navigate('KhachHangDetail', { KhachHangID })
    };

    const suaKhachHang = async () => {
        try {
            await API.put(`${endpoints['khachhang']}${khachhangID}/Sua_KH/`, {
                Ten_KH: name,
                NgaySinh: ngaySinh,
                GioiTinh: gioiTinh,
                DiaChi: diaChi,
                CMND: cmnd,
                DienThoai: dienThoai,
                Email: email,
                avatar: newAvatar || oldAvatar, // Use newAvatar if available, otherwise use oldAvatar
            });
            await KhachHangData();
            console.log('Thông tin khách hàng đã được cập nhật');
            Alert.alert(
                'Cập nhật thành công',
                'Bạn vui lòng quay lại trang Khách Hàng để xem sự thay đổi. Nếu bạn không thấy sự thay đổi vui lòng thoát và tải lại',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Khách Hàng')
                    },
                ],
                { cancelable: false }
            )
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin khách hàng:', error);
        }
    };
    
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label}>Tên khách hàng:</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
            />
            <Text style={styles.label}>Ngày Sinh:</Text>
            <TextInput
                style={styles.input}
                value={ngaySinh}
                onChangeText={setNgaySinh}
            />
            <Text style={styles.label}>Giới Tính:</Text>
            <TextInput
                style={styles.input}
                value={gioiTinh}
                onChangeText={setGioiTinh}
            />
            <Text style={styles.label}>Địa Chỉ:</Text>
            <TextInput
                style={styles.input}
                value={diaChi}
                onChangeText={setDiaChi}
            />
            <Text style={styles.label}>CMND:</Text>
            <TextInput
                style={styles.input}
                value={cmnd}
                onChangeText={setCMND}
            />
            <Text style={styles.label}>Điện Thoại:</Text>
            <TextInput
                style={styles.input}
                value={dienThoai}
                onChangeText={setDienThoai}
            />
            <Text style={styles.label}>Email:</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
            />
            <View style={{ marginBottom: 30 }}>
                <View style={styles.imagePickerContainer}>
                    <Text style={{ marginRight: 10 }}>Chọn ảnh đại diện:</Text>
                    <Button title="Chọn ảnh" onPress={pickImage} />
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {newAvatar ? (
                        <Image source={{ uri: 
                        `file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FMyMobileApp-caeae716-14f8-42e8-8345-b048446019bf/ImagePicker/${newAvatar.substring(newAvatar.lastIndexOf('/') + 1)}`
                         }} style={styles.image} />
                    ) : (
                            // avatar && <Image source={{uri: avatar}} style={styles.image}/>
                            avatar && <Image source={{uri: avatar.endsWith('.jpeg') ? 
                            `file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FMyMobileApp-caeae716-14f8-42e8-8345-b048446019bf/ImagePicker/${avatar.substring(avatar.lastIndexOf('/') + 1)}` : avatar}} 
                            style={styles.image} />
                        )}
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, { width: 150 }]} onPress={() => gotoDetail(id)}>
                    <Text style={styles.buttonText}>Quay Lại</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { width: 150 }]} onPress={suaKhachHang}>
                    <Text style={styles.buttonText}>Cập nhật</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    image: {
        width: 200,
        height: 200,
    },
    imagePickerContainer: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
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
    },
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

export default SuaKhachHang;
