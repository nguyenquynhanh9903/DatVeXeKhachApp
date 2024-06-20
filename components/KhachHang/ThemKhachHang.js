import React, { useState } from 'react';
import { Image, View, StyleSheet, Text, TouchableOpacity, Alert, KeyboardAvoidingView} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { BASE_URL, endpoints } from '../../configs/API';
import { Picker } from '@react-native-picker/picker';
import { Button, TextInput } from 'react-native-paper';

const ThemKhachHang = ({navigation}) => {
  const [name, setName] = useState('');
  const [ngaySinh, setNgaySinh] = useState('');
  const [gioiTinh, setGioiTinh] = useState('');
  const [diaChi, setDiaChi] = useState('');
  const [cmnd, setCMND] = useState('');
  const [dienThoai, setDienThoai] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [loai_Kh, setLoaiKH] = useState('1');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const fileNameWithExtension = uri.substring(uri.lastIndexOf('/') + 1); // Lấy phần cuối của URI (tên tệp kèm phần mở rộng)
      setAvatar(fileNameWithExtension);
  }
  
  };

  const addKhachHang = async () => {
    try {
      if (!name || !ngaySinh || !gioiTinh || !diaChi || !cmnd || !dienThoai || !email || !avatar) {
        Alert.alert('Lưu ý','Vui lòng nhập đầy đủ thông tin và chọn ảnh đại diện');
        return;
      }

      // let loaiKhachHangId = '';
      // if (loai_Kh === 'trực tiếp') {
      //   loaiKhachHangId = '1';
      // } else if (loai_Kh === 'Online') {
      //   loaiKhachHangId = '2';
      // }
  
      const response = await fetch(BASE_URL + endpoints['them_KH'], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Ten_KH: name,
          NgaySinh: ngaySinh,
          GioiTinh: gioiTinh,
          DiaChi: diaChi,
          CMND: cmnd,
          DienThoai: dienThoai,
          Email: email,
          avatar: avatar, 
          Loai_KH: loai_Kh,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Đã xảy ra lỗi khi thêm khách hàng');
      }
  
      // Nếu thành công, hiển thị thông báo và xóa các trường nhập
      Alert.alert('Thông báo','Thêm khách hàng thành công!');
      setName('');
      setNgaySinh('');
      setGioiTinh('');
      setDiaChi('');
      setCMND('');
      setDienThoai('');
      setEmail('');
      setAvatar(null);
      setLoaiKH('1');
    } catch (error) {
      console.error('Lỗi:', error.message);
      Alert.alert('Đã xảy ra lỗi khi thêm khách hàng');
    }
  };
  
  const quayLai = () => {
    navigation.navigate('Khách hàng - Danh sách');
  }

  return (
    <KeyboardAvoidingView>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }} style={{marginTop: 25}}>
        <TextInput
          style={styles.input}
          label="Tên khách hàng"
          value={name}
          onChangeText={text => setName(text)}
        />
        <TextInput
          style={styles.input}
          label="Ngày sinh"
          value={ngaySinh}
          onChangeText={text => setNgaySinh(text)}
        />
        <TextInput
          style={styles.input}
          label="Giới tính"
          value={gioiTinh}
          onChangeText={text => setGioiTinh(text)}
        />
        <TextInput
          style={styles.input}
          label="Địa chỉ"
          value={diaChi}
          onChangeText={text => setDiaChi(text)}
        />
        <TextInput
          style={styles.input}
          label="CMND"
          value={cmnd}
          onChangeText={text => setCMND(text)}
        />
        <TextInput
          style={styles.input}
          label="Điện thoại"
          value={dienThoai}
          onChangeText={text => setDienThoai(text)}
        />
        <TextInput
          style={styles.input}
          label="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <View style={styles.selectionContainer}>
            <Text style={styles.label}>Chọn loại khách hàng:</Text>
            <Picker
            selectedValue={loai_Kh}
            style={styles.picker}
            onValueChange={(itemValue) => setLoaiKH(itemValue)}
            >
            <Picker.Item label="Trực tiếp" value="1" />
            <Picker.Item label="Online" value="2" />
            </Picker>
        </View>
        <View style={{marginBottom: 30}}>
          <View style={styles.imagePickerContainer}>
            <Text style={{ marginRight: 10 }}>Chọn ảnh đại diện:</Text>
            <Button style={{backgroundColor: "#4f6e4b"}} mode="contained" onPress={pickImage}>CHỌN ẢNH</Button>
          </View>
          {avatar && <Image source={{ uri: `file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FDatVeXeKhachApp-8eb51fdd-b5f9-455f-b225-8f4db299e1f9/ImagePicker/${avatar}`}} style={styles.image} />}
        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, { width: 'auto' }]} onPress={quayLai}>
                <Text style={styles.buttonText}>Quay Lại</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { width: 'auto' }]} onPress={addKhachHang}>
                <Text style={styles.buttonText}>Thêm khách hàng</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      imagePickerContainer: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
      },
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
      image: {
        width: 200,
        height: 200,
        marginTop: 10,
        borderRadius: 20,
        marginLeft: 30
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        marginTop: -20,
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
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
      container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
      },
      selectionContainer: {
        marginBottom: 20,
      },
      label: {
        fontSize: 16,
        marginBottom: 5,
      },
      picker: {
        width: 170,
        height: 40,
        backgroundColor: '#d8d6d0'
      },
});  

export default ThemKhachHang;