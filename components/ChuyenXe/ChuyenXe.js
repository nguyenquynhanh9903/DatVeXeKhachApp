import { useEffect, useState } from "react";
import { View, ActivityIndicator, Image, ScrollView, Text, StyleSheet, TouchableOpacity, RefreshControl, Platform } from "react-native"
import API, { endpoints } from "../../configs/API";
import MyStyles from "../../styles/MyStyles"
import "moment/locale/vi"
import { Picker } from "@react-native-picker/picker";
import moment from "moment";
import DateTimePicker from '@react-native-community/datetimepicker'; // hoặc "react-native"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLocationDot, faEllipsis, faCircleDot } from '@fortawesome/free-solid-svg-icons';
import { Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";


const ChuyenXe = ({ route }) => {
    const { TuyenXeID } = route.params;
    const navigation = useNavigation();
    const [chuyenxe, setChuyenXe] = useState([]);
    const [tuyenxe, setTuyenXe] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectTime] = useState('');
    const [selectedNoi, setSelectNoi] = useState('');
    const [locchuyenxe, setLocChuyenXe] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [defaultDate, setDefaultDate] = useState(new Date()); // Giá trị ngày mặc định
    const [showAlert, setShowAlert] = useState(false);
    const [searchResultFound, setSearchResultFound] = useState(true);
    const [ngayle, setNgayLe] = useState([]);



    const loadCX = async () => {
        setLoading(true);
        try {
            let url;
            url = `${endpoints['tuyenxe']}${TuyenXeID}/ChuyenXe/`
            let res = await API.get(url);
            setChuyenXe(res.data);
        }
        catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    const loadTX = async () => {
        try {
            setLoading(true);
            let url;
            url = `${endpoints['tuyenxe']}?q=${TuyenXeID}`
            let res = await API.get(url);
            setTuyenXe(res.data.results);
        }
        catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    const loadNgayLe = async () => {
        try {
            const res = await API.get(endpoints['le']);
            setNgayLe(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadCX();
        loadTX();
        loadNgayLe();
    }, []);

    const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
            loadCX();
        setRefreshing(false);
    }, 2000);
    };
    

    const searchByDate = (date) => {
        const searchDate = moment(date).format('YYYY/MM/DD');
        let filteredChuyenXe;
        
        if (!searchDate) {
            filteredChuyenXe = chuyenxe;
        } else {
            filteredChuyenXe = chuyenxe.filter(c => moment(c.Ngay).format('YYYY/MM/DD') === searchDate);
        }
        
        const searchResultFound = filteredChuyenXe.length !== 0;
        setLocChuyenXe(filteredChuyenXe);
        setSearchResultFound(searchResultFound);
    };
    
    

    const searchByTime = (time) => {
        if (!time){
            setLocChuyenXe(chuyenxe)
        } else {
            const filter = chuyenxe.filter(c => c.Giodi === time);
            setLocChuyenXe(filter);
        }
    }

    const searchByNoi = (noi) => {
        if (!noi){
            setLocChuyenXe(chuyenxe)
        } else {
            const filter = chuyenxe.filter(c => c.Noidi === noi);
            setLocChuyenXe(filter);
        }
    }

    const searchBySelectedDate = () => {
        searchByDate(selectedDate);
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || selectedDate;
        setSelectedDate(currentDate);
        setShowDatePicker(false); // Đóng DateTimePicker sau khi chọn ngày
        searchByDate(currentDate);
        searchBySelectedDate(); // Cập nhật locchuyenxe ngay sau khi chọn ngày
    };
    
    
    useEffect(() => {
        if (!searchResultFound) {
            Alert.alert(
                'Hãy xem kết quả tìm kiếm',
                'Vui lòng nhấn OK để xem',
                [{ text: 'OK', onPress: () => setShowAlert(false) }]
            );
        }
    }, [searchResultFound]);
    
    const formDate = (date) => {
        return moment(date, 'YYYY/MM/DD').format('DD/MM/YYYY');
    }

    const tinhGia = (ngay, gia) => {
        const ngayFormatted = formDate(ngay);
        const ngayLe = ngayle.find(c => c.Le === ngayFormatted);
        if (ngayLe) {
            const phantram = 1 + parseFloat(ngayLe.Tang.replace("%", "")) / 100;
            const formatPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(gia * phantram);
            return formatPrice;
        } else {
            const formatPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(gia);
            return formatPrice;
        }
    };

    const loaiXe = (maloai) => {
        if (maloai == 1){
            const loai = "Ghế";
            return loai;
        }
        else {
            const loai = "Giường";
            return loai;
        }
    }

    const uniqueArray = (arr) => {
        return arr.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
    };

    const noiArray = uniqueArray(chuyenxe.map(c=> c.Noidi));
    const gioArray = uniqueArray(chuyenxe.map(c=> c.Giodi));

    const gotoChuyenXeDetail = (ChuyenXeID, Gia) => {
        navigation.navigate('ChuyenXeDetail', { ChuyenXeID, Gia });
    }

    const goToTuyenXe = () => {
        navigation.navigate('Tuyến Xe');
      }

    return (
        <View style={MyStyles.container}>
            <View style={styles.tieude}>
                {tuyenxe && tuyenxe.map(
                    d => (
                        <View key={d.id}>
                            <Text style={styles.text}>Tuyến Xe {d.Ten_tuyen}</Text>
                        </View>
                    )
                )}
                <View style={{ flexDirection: 'row', justifyContent:'space-evenly', alignItems: 'center' }}>
                    {Platform.OS === 'ios' ? (
                        <DateTimePicker
                            value={defaultDate}
                            display="default"
                            onDateChange={handleDateChange}
                            mode="date"
                        />
                    ) : (
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{marginTop: 10}}>
                            <Text style={{fontSize: 20}}>Ngày</Text>
                        </TouchableOpacity>
                    )}
                    {showDatePicker && (
                        <DateTimePicker
                        value={defaultDate} // Sử dụng giá trị defaultDate
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={handleDateChange}
                        />                    
                    )}
                    <Picker
                        selectedValue={selectedNoi}
                        onValueChange={(itemValue, itemIndex) => {
                            setSelectNoi(itemValue);
                            searchByNoi(itemValue);
                        }}
                        style={styles.picker} >
                            <Picker.Item label="Nơi khởi hành" value="" />
                            {noiArray.map((value, index) => (
                                <Picker.Item key={index} label={value} value={value} />
                            )
                    )}
                    </Picker>
                    <Picker
                        selectedValue={selectedTime}
                        onValueChange={(itemValue, itemIndex) => {
                            setSelectTime(itemValue);
                            searchByTime(itemValue);
                        }}
                        style={styles.picker} >
                            <Picker.Item label="Thời gian đi" value="" />
                            {gioArray.map((value, index) => (
                                <Picker.Item key={index} label={value} value={value} />
                            )
                    )}
                    </Picker>
                </View>
            </View>
            <ScrollView refreshControl={<RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}/>}>
                {loading && <ActivityIndicator/>}
                {searchResultFound && locchuyenxe && locchuyenxe.map(
                    c => (
                        <Text key={c.id} style={{textAlign: 'center', fontSize: 16, marginTop: 10, marginBottom: 10}}>Kết quả tìm kiếm cho ngày {formDate(c.Ngay)}</Text>
                    )
                )}
                {tuyenxe && tuyenxe.map(
                    d => (
                        locchuyenxe.length > 0 ? locchuyenxe.map(
                            c=> (
                                <TouchableOpacity key={c.id} onPress={() => gotoChuyenXeDetail(c.id, tinhGia(c.Ngay, d.BangGia))}>
                                <View style={styles.rectangle}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{fontSize: 24, marginTop: 15}}>{c.Giodi}</Text>
                                        <FontAwesomeIcon style={{fontSize: 24, marginTop: 25}} icon={faCircleDot} />
                                        <View style={{ flexDirection: 'row'}}>
                                            <FontAwesomeIcon style={{fontSize: 24, marginTop: 25}} icon={faEllipsis} />
                                            <FontAwesomeIcon style={{fontSize: 24, marginTop: 25}} icon={faEllipsis} />
                                            <FontAwesomeIcon style={{fontSize: 24, marginTop: 25}} icon={faEllipsis} />
                                            <FontAwesomeIcon style={{fontSize: 24, marginTop: 25}} icon={faEllipsis} />
                                            <FontAwesomeIcon style={{fontSize: 24, marginTop: 25}} icon={faEllipsis} />
                                            <FontAwesomeIcon style={{fontSize: 24, marginTop: 25}} icon={faEllipsis} />
                                            <FontAwesomeIcon style={{fontSize: 24, marginTop: 25}} icon={faEllipsis} />
                                            <FontAwesomeIcon style={{fontSize: 24, marginTop: 25}} icon={faEllipsis} />
                                        </View>
                                        <FontAwesomeIcon style={{fontSize: 24, marginTop: 25}} icon={faLocationDot} />
                                        <Text style={{fontSize: 24, marginTop: 15}}>{c.Gioden}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{fontSize: 15, marginTop: 15}}>{c.Noidi}</Text>
                                        <Text style={{fontSize: 15, marginTop: 15}}>{c.Noiden}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{fontSize: 15, marginTop: 15}}>{loaiXe(c.Ma_Xe)} {c.Cho_trong} chỗ trống</Text>
                                        <Text style={{fontSize: 15, marginTop: 15}}>{formDate(c.Ngay)}</Text>
                                        <Text style={{fontSize: 15, marginTop: 15}} key={d.id}>{tinhGia(c.Ngay,d.BangGia)}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>     
                            )
                        ) : ( chuyenxe && chuyenxe.map(
                            c => (
                                <TouchableOpacity key={c.id} onPress={() => gotoChuyenXeDetail(c.id, tinhGia(c.Ngay, d.BangGia))}>
                                    <View style={styles.rectangle}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{fontSize: 24, marginTop: 15}}>{c.Giodi}</Text>
                                            <FontAwesomeIcon style={{fontSize: 24, marginTop: 25}} icon={faCircleDot} />
                                            <View style={{ flexDirection: 'row'}}>
                                                <FontAwesomeIcon style={{fontSize: 24, marginTop: 25}} icon={faEllipsis} />
                                                <FontAwesomeIcon style={{fontSize: 24, marginTop: 25}} icon={faEllipsis} />
                                                <FontAwesomeIcon style={{fontSize: 24, marginTop: 25}} icon={faEllipsis} />
                                                <FontAwesomeIcon style={{fontSize: 24, marginTop: 25}} icon={faEllipsis} />
                                                <FontAwesomeIcon style={{fontSize: 24, marginTop: 25}} icon={faEllipsis} />
                                                <FontAwesomeIcon style={{fontSize: 24, marginTop: 25}} icon={faEllipsis} />
                                                <FontAwesomeIcon style={{fontSize: 24, marginTop: 25}} icon={faEllipsis} />
                                                <FontAwesomeIcon style={{fontSize: 24, marginTop: 25}} icon={faEllipsis} />
                                            </View>
                                            <FontAwesomeIcon style={{fontSize: 24, marginTop: 25}} icon={faLocationDot} />
                                            <Text style={{fontSize: 24, marginTop: 15}}>{c.Gioden}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{fontSize: 15, marginTop: 15}}>{c.Noidi}</Text>
                                            <Text style={{fontSize: 15, marginTop: 15}}>{c.Noiden}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{fontSize: 15, marginTop: 15}}>{loaiXe(c.Ma_Xe)} {c.Cho_trong} chỗ trống</Text>
                                            <Text style={{fontSize: 15, marginTop: 15}}>{formDate(c.Ngay)}</Text>
                                            {tuyenxe && tuyenxe.map(
                                                d => (
                                                    <Text style={{fontSize: 15, marginTop: 15}} key={d.id}>{tinhGia(c.Ngay,d.BangGia)}</Text>
                                                )
                                            )}
                                        </View>
                                    </View>
                                </TouchableOpacity>     
                            )
                        )
                    )))
                }
                <View style={styles.buttonContainer}>
                      <TouchableOpacity style={[styles.button, { width: 100 }]} onPress={goToTuyenXe}>
                        <Text>Quay lại</Text>
                      </TouchableOpacity>
                </View>
                {loading && <ActivityIndicator/>}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    tieude: {
        width: 412,
        height: 100,
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -59,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    button: {
      alignItems: 'center',
      backgroundColor: 'pink',
      padding: 10,
      marginVertical: 10,
      borderRadius: 5,
    },
    text: {
        color: 'white',
        fontSize: 20,
    },
    picker: {
        height: 40,
        width: '43%',
        backgroundColor: 'orange', // Màu nền của picker
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginTop: 10,
    },
    rectangle: {
        width: 409,
        height: 130,
        backgroundColor: 'white', // Màu nền trắng
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
      },
      button: {
        alignItems: 'center',
        backgroundColor: 'pink',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
      },
  });

  export default ChuyenXe; 