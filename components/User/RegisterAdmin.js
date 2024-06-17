import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { Button, HelperText, List, TextInput, TouchableRipple } from "react-native-paper";
import React, { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import API, { endpoints } from "../../configs/API";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

const RegisterAdmin = () => {
    
    const [user, setUser] = useState({});
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();
    const [expanded, setExpanded] = useState(true);
    const handlePress = () => setExpanded(!expanded);
    const [title, setTitle] = useState("Vui lòng chọn loại người dùng");


    const fields = [{
        "label": "Tên",
        "icon": "text",
        "name": "first_name"
    }, {
        "label": "Họ và tên lót",
        "icon": "text",
        "name": "last_name"
    }, {
        "label": "Tên đăng nhập",
        "icon": "account",
        "name": "username"
    }, {
        "label": "Email",
        "icon": "text",
        "name": "email"
    }, {
        "label": "Mật khẩu",
        "icon": "eye",
        "name": "password",
        "secureTextEntry": true
    }, {
        "label": "Xác nhận mật khẩu",
        "icon": "eye",
        "name": "confirm_password",
        "secureTextEntry": true
    }];

    
    
    const picker = async () => {
        //Yêu cầu quyền truy cập vào thư viện ảnh của thiết bị
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        //Kiểm tra xem quyền truy cập có được cấp hay không
        if (status !== 'granted') {
            alert("Thông báo","Permissions denied!");
        } else {
            //Mở thư viện để người dùng chọn ảnh
            let result = await ImagePicker.launchImageLibraryAsync();

            //Kiểm tra xem người dùng có hủy việc chọn ảnh hay không
            if(!result.canceled) {
                updateState('avatar', result.assets[0]); //Nếu không hủy ảnh sẽ được lưu
            }
        }
    }

    //Update state user
    const updateState = (field, value) => {
        setUser(current => {
            return {...current, [field]:value}
        })
    }

    const handleSelect = (value, label) => {
        updateState('Loai_NguoiDung', value);
        setTitle(label);
        setExpanded(false);
    }

    const resetForm = () => {
        setUser({});
        setTitle("Vui lòng chọn loại người dùng");
        setErr(false);
    }

    //xử lý lỗi
    const register = async () => {
        if(user['password'] !== user['confirm_password'])
            setErr(true);
        else{
            setErr(false);

            //gửi dữ liệu lên API bằng form
             let form = new FormData();
            //duyệt qua các trường bỏ confirm ra, key là duyệt qua các từ khóa đang liên kết vào value
            for(let key in user)
                if(key !== 'confirm_password')
                     if(key === 'avatar') {
                         form.append(key, {
                             uri: user.avatar.uri,
                             name: user.avatar.fileName,
                             type: user.avatar.type
                         });
                    }else
                         form.append(key, user[key]);
             console.info(form);
            
             setLoading(true);
            try{
                //gọi api
                let res = await API.post(endpoints['Register'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

            
                if (res.status === 201) {
                    Alert.alert(
                        "Thông báo",
                        "Đăng ký tài khoản thành công",
                        [{text: "OK", onPress: () => resetForm()}]
                    );
                    nav.navigate("HomeAdmin");
                }
                    

            } catch(ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
            
        }
    }

    return (
        <View style={[MyStyles.container, MyStyles.margin]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView>
                    <Text style={MyStyles.subject}>ĐĂNG KÝ TÀI KHOẢN</Text>


                    <List.Accordion style={[styles.list]}
                        title={title}
                        expanded={expanded}
                        onPress={handlePress}
                    >
                        <List.Item title="Admin" onPress={() => handleSelect(1, "Admin")}/>
                        <List.Item title="Tài xế" onPress={() => handleSelect(4, "Tài xế")} />
                        <List.Item title="Nhân viên" onPress={() => handleSelect(2, "Nhân viên")}/>
                    </List.Accordion>

                    {fields.map(c => <TextInput value={user[c.name] || ''} onChangeText={t => updateState(c.name, t)}
                    style={[MyStyles.margin, {backgroundColor: "#F2CED5"}]} 
                    key={c.name} 
                    label={c.label} 
                    secureTextEntry={c.secureTextEntry} right={<TextInput.Icon icon={c.icon} />}/>)}

                    <HelperText type="error" visible={err}>
                        Mật khẩu không khớp!
                    </HelperText>

                    <TouchableRipple onPress={picker}>
                        <Text style={MyStyles.margin}>Chọn ảnh đại diện.</Text>
                    </TouchableRipple>

                    {/* Hiện avatar */}
                    {user.avatar && <Image source={{uri: user.avatar.uri}} style={MyStyles.avatar} />}

                    <Button style={{backgroundColor: "#BF6B7B"}} loading={loading} icon="account" mode="contained" onPress={register}>ĐĂNG KÝ</Button>
                </ScrollView>
            </KeyboardAvoidingView>
            
            
        </View>
    );
}

const styles = StyleSheet.create({
    list: {
        fontSize:14,
        height: 60,
        justifyContent: 'center',
    },
})

export default RegisterAdmin;