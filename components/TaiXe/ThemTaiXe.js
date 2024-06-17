import React, { useState } from 'react';
import { Button, Image, View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { BASE_URL, endpoints } from '../../configs/API';

export default function ThemTX({navigation}) {
  const [name, setName] = useState('');
  const [ngaySinh, setNgaySinh] = useState('');
  const [gioiTinh, setGioiTinh] = useState('');
  const [diaChi, setDiaChi] = useState('');
  const [cmnd, setCMND] = useState('');
  const [dienThoai, setDienThoai] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(null);

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

    const addTaiXe = async () => {
        try {
            if (!name || !ngaySinh || !gioiTinh || !diaChi || !cmnd || !dienThoai || !email || !avatar) {
                alert('Vui lòng nhập đầy đủ thông tin và chọn ảnh đại diện');
                return;
            }
        
            const response = await fetch(BASE_URL + endpoints['them_TX'], {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Ten_taixe: name,
                    NgaySinh: ngaySinh,
                    GioiTinh: gioiTinh,
                    DiaChi: diaChi,
                    CMND: cmnd,
                    DienThoai: dienThoai,
                    Email: email,
                    avatar: avatar, 
                }),
            });
        
            if (!response.ok) {
                throw new Error('Đã xảy ra lỗi khi thêm tài xế');
            }
        
            // Nếu thành công, hiển thị thông báo và xóa các trường nhập
            alert('Thêm tài xế thành công!');
            setName('');
            setNgaySinh('');
            setGioiTinh('');
            setDiaChi('');
            setCMND('');
            setDienThoai('');
            setEmail('');
            setAvatar(null);
        } catch (error) {
        console.error('Lỗi:', error.message);
        alert('Đã xảy ra lỗi khi thêm tài xế');
        }
    };
  
  const quayLai = () => {
    navigation.navigate('Tài Xế - Danh Sách');
  }

  return (
      <ScrollView contentContainerStyle={{ alignItems: 'center' }} style={{marginTop: 50}}>
        <Text style={styles.title}>Thêm Tài Xế</Text>
        <TextInput
          style={styles.input}
          placeholder="Tên tài xế"
          value={name}
          onChangeText={text => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Ngày sinh"
          value={ngaySinh}
          onChangeText={text => setNgaySinh(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Giới tính"
          value={gioiTinh}
          onChangeText={text => setGioiTinh(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Địa chỉ"
          value={diaChi}
          onChangeText={text => setDiaChi(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="CMND"
          value={cmnd}
          onChangeText={text => setCMND(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Điện thoại"
          value={dienThoai}
          onChangeText={text => setDienThoai(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <View style={{marginBottom: 30}}>
          <View style={styles.imagePickerContainer}>
            <Text style={{ marginRight: 10 }}>Chọn ảnh đại diện:</Text>
            <Button title="Chọn ảnh" onPress={pickImage} />
          </View>
          {avatar && <Image source={{ uri: `file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FMyMobileApp-caeae716-14f8-42e8-8345-b048446019bf/ImagePicker/${avatar}`}} style={styles.image} />}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, { width: 'auto'}]} onPress={quayLai}>
              <Text style={styles.buttonText}>Quay Lại</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { width: 'auto' }]} onPress={addTaiXe}>
              <Text style={styles.buttonText}>Thêm tài xế</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginTop: -20,
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

