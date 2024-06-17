import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';

const CustomerForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [diachi, setDiaChi] = useState('');
  const [dienthoai, setDienThoai] = useState('');
  const [CMND, setCMND] = useState('');
 
  const handleAddCustomer = () => {
    if (name && email && diachi && dienthoai && CMND) {
      const customer = { name, email, diachi, dienthoai, CMND };
      onSubmit(customer);
      setName('');
      setEmail('');
      setDiaChi('');
      setDienThoai('');
      setCMND('');
    } else {
      Alert.alert('Vui lòng điền đầy đủ thông tin khách hàng!');
    }
  };

  return (
    <View>
      <Text style={{ fontSize: 18, marginBottom: 20, marginTop: 20, fontWeight: 'bold', marginLeft: 100}}>Thông Tin Khách hàng</Text>
      <TextInput
        placeholder="Tên"
        value={name}
        onChangeText={text => setName(text)}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Điện Thoại"
        value={dienthoai}
        onChangeText={text => setDienThoai(text)}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Địa Chỉ"
        value={diachi}
        onChangeText={text => setDiaChi(text)}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Căn cước công dân"
        value={CMND}
        onChangeText={text => setCMND(text)}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
      />
      <Button title="Thêm Khách hàng" onPress={handleAddCustomer} />
    </View>
  );
};

export default CustomerForm;