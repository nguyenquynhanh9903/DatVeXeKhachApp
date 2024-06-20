import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, ScrollView, Button, TouchableOpacity, Alert } from 'react-native';
import API, { endpoints } from '../../configs/API';
import { useNavigation } from '@react-navigation/native';
import MyStyles from '../../styles/MyStyles';

const TaiXeDetail = ({ route }) => {
    const { TaiXeID } = route.params;
    const [nhanvien, setNhanVien] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchTaiXeDetail = async () => {
            try {
                const res = await API.get(`${endpoints['taixe']}?mataixe=${TaiXeID}`);
                setNhanVien(res.data.results);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTaiXeDetail();
    }, [TaiXeID]);

    const XoaTaiXe = async () => {
        Alert.alert(
            'Xác nhận xóa',
            'Bạn có chắc chắn muốn xóa tài xế này?',
            [
                {
                    text: 'Hủy',
                    style: 'cancel',
                },
                {
                    text: 'Xóa',
                    onPress: async () => {
                        try{
                            const res = await API.delete(`${endpoints['taixe']}${TaiXeID}/Xoa_TX/`);
                            if (res.status === 204) {
                                console.log('Tài xế được xóa thành công');
                                Alert.alert(
                                    'Xóa thành công',
                                    'Bạn vui lòng quay lại trang Tài xế để xem sự thay đổi. Nếu bạn không thấy sự thay đổi vui lòng thoát và tải lại',
                                    [
                                        {
                                            text: 'OK',
                                            onPress: () => navigation.navigate('Tài Xế')
                                        },
                                    ],
                                    {cancelable: false}
                                )
                            } else {
                                console.error('Không thể xóa tài xế');
                            }
                            
                        } catch (error) {
                            console.error('Error:', error);
                        }
                    },
                },
            ],
            {cancelable: false}
        ) 
    };

    const quayLai = () => {
        navigation.navigate('Tài xế - Danh sách');
    }

    const suaNhanVien = () => {
        navigation.navigate('Sửa tài xế', {taixeID: TaiXeID})
    };

    if (loading) {
        return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
        );
    }

  return (
    <View style={styles.container}>
      <Text style={MyStyles.subject}>THÔNG TIN TÀI XẾ</Text>
      {nhanvien && nhanvien.map(
            c => (
                <ScrollView key={c.id}>
                    <View style={styles.imageContainer}>
                    <Image
                        source={{
                            uri: c.avatar.endsWith('.jpeg') 
                            ? `file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FDatVeXeKhachApp-8eb51fdd-b5f9-455f-b225-8f4db299e1f9/ImagePicker/${c.avatar.substring(c.avatar.lastIndexOf('/') + 1)}`
                            : c.avatar
                        }} 
                        style={styles.image} 
                        resizeMethod='auto'
                    />
                    </View>

                    <View style={styles.border}>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>Tên:</Text>
                            <Text style={styles.value}>{c.Ten_taixe}</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>Ngày Sinh:</Text>
                            <Text style={styles.value}>{c.NgaySinh}</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>Giới Tính:</Text>
                            <Text style={styles.value}>{c.GioiTinh}</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>Địa chỉ:</Text>
                            <Text style={styles.value}>{c.DiaChi}</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>Email:</Text>
                            <Text style={styles.value}>{c.Email}</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>CMND:</Text>
                            <Text style={styles.value}>{c.CMND}</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>Số điện thoại:</Text>
                            <Text style={styles.value}>{c.DienThoai}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, { width: 100 }]} onPress={quayLai}>
                            <Text style={styles.buttonText}>Quay lại</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { width: 100 }]} onPress={XoaTaiXe}>
                            <Text style={styles.buttonText}>Xóa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { width: 100 }]} onPress={suaNhanVien}>
                            <Text style={styles.buttonText}>Sửa</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
       ))}
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
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
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 100,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
    fontSize: 20,
  },
  value: {
    flex: 1,
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#BF6B7B',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  border: {
    justifyContent: 'center',
    backgroundColor:'#F2B6C1',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    marginLeft:10,
    marginRight: 10,
    marginBottom: 30,
  },
});

export default TaiXeDetail;