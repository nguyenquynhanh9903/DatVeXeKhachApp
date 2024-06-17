import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { List, TextInput } from "react-native-paper";
import API, { BASE_URL, endpoints } from "../../configs/API";
import MyStyles from "../../styles/MyStyles";

const ThemChuyenXe = () => {
    const nav = useNavigation();
    const [chuyenXe, setChuyenXe]  = useState({});
    const [taiXe, setTaiXe] = useState([]);
    const [xe, setXe] = useState([]);
    const [expanded, setExpanded] = useState(true);
    const handlePress = () => setExpanded(!expanded);

    const fields = [{
        "label": "Tên chuyến xe",
        "icon": "text",
        "name": "TenChuyenXe"
    
    }, {
        "label": "Mã tuyến xe",
        "icon": "text",
        "name": "Ma_Tuyen"
    }, {
        "label": "Thời gian đi",
        "icon": "text",
        "name": "Giodi"
    }, {
        "label": "Thời gian đến",
        "icon": "text",
        "name": "Gioden"
    }, {
        "label": "Chỗ còn trống",
        "icon": "text",
        "name": "Cho_trong"
    }, {
        "label": "Điểm đi",
        "icon": "text",
        "name": "Noidi"
    }, {
        "label": "Điểm đến",
        "icon": "text",
        "name": "Noiden"
    },];

    const updateState = (field, value) => {
        setChuyenXe(current => {
            return {...current, [field]: value}
        })
    }

    const addChuyenXe = async() => {
        try {
            let form = new FormData();
            for(key in chuyenXe)
                form.append(key, chuyenXe[key]);
            
            // Get the selected TaiXe and Xe data
            const selectedTaiXe = taiXe.find((t) => t.id === chuyenXe.Ma_TaiXe);
            const selectedXe = xe.find((x) => x.id === chuyenXe.Ma_Xe);

            if (selectedTaiXe && selectedXe) {
                form.append("Ma_TaiXe", selectedTaiXe.id);
                form.append("Ma_Xe", selectedXe.id);
            } else {
            throw new Error("Vui lòng chọn tài xế và xe");
    } 
            console.info(form);

            let response = await API.post(endpoints['them_chuyenXe'],form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status !== 201) {
                throw new Error('Đã xảy ra lỗi khi thêm chuyến xe.');
            } else {
                Alert.alert('Thêm chuyến xe thành công.');
            }

            

        } catch (err) {
            console.error(err);
            Alert.alert('Đã xảy ra lỗi khi thêm chuyến xe.');
        }
        
    };

    const quayLai = () => {
        nav.navigate('Trang chủ quản lý');
    }

    return (
        <KeyboardAvoidingView>
            <ScrollView>
                {fields.map(t => <TextInput
                value={chuyenXe[t.name]}
                onChangeText={c => updateState(t.name, c)} 
                key={t.label} 
                style={MyStyles.margin}
                label={t.label}
                right={<TextInput.Icon icon={t.icon} />} />)}

                <View>
                    <List.Accordion style={[styles.input]}
                        title="Mã tài xế"
                        expanded={expanded}
                        onPress={handlePress}
                    >
                        {taiXe.map((t) => (
                            <List.Item key={t.id} title={t.name} onPress={() => handleSelect(t.id, "TaiXe")} />
                        ))}
                    </List.Accordion>
                </View>

                <View>
                    <List.Accordion style={[styles.input]}
                        title="Mã xe"
                        expanded={expanded}
                        onPress={handlePress}
                    >
                        {xe.map((x) => (
                            <List.Item key={x.id} title={x.name} onPress={() => handleSelect(x.id, "Xe")} />
                        ))}
                    </List.Accordion>
                </View>
        
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, {width: 'auto'}]} onPress={quayLai}>
                        <Text style={styles.buttonText}>Quay lại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, {width: 'auto'}]} onPress={addChuyenXe}>
                        <Text style={styles.buttonText}>Thêm tuyến xe</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
        
    );
}

const styles = StyleSheet.create({
    input: {
        marginBottom: 5,
        width: '100%',
        height: 60,
        //borderColor: 'gray',
        //borderWidth: 5,
        paddingHorizontal: 10,
        //borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        marginTop: 20,
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

export default ThemChuyenXe;