import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, ActivityIndicator, Image, ScrollView, Button, Text, StyleSheet, TouchableOpacity, RefreshControl } from "react-native"
import { List, Searchbar } from "react-native-paper";
import API, { endpoints } from "../../configs/API";
import MyStyles from "../../styles/MyStyles"
import "moment/locale/vi"
import Icon from 'react-native-vector-icons/FontAwesome';
import { Alert } from "react-native";

const TuyenXe = () => {
    const navigation = useNavigation();
    const [tuyenxe, setTuyenXe] = useState([]);
    const [loading, setLoading] = useState(false);
    const [di, setDi] = useState("");
    const [den, setDen] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false); 

    const loadTX = async () => {
        if (page > 0) {
            try {
                setLoading(true);
                let url;
                if (di.trim() !== '') {
                    url = `${endpoints['tuyenxe']}?diemdi=${di}&page=${page}`;
                } else if (den.trim() !== ''){
                    url = `${endpoints['tuyenxe']}?diemden=${den}&page=${page}`;
                }
                else {
                    url = `${endpoints['tuyenxe']}?page=${page}`;
                }
                let res = await API.get(url);
                if (page === 1) {
                    setTuyenXe(res.data.results);
                } else if(page !== 0) {
                    setTuyenXe(current => [...current, ...res.data.results]);
                }
                if (res.data.next === null) {
                    setPage(0);
                }
            }
            catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
                setIsFetchingMore(false);
            }
        }
    }

    useEffect(() => {
        loadTX();
    }, [di, den, page]);

    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    };

    const loadMore = ({nativeEvent}) => {
        if (!loading && !isFetchingMore && page > 0 && isCloseToBottom(nativeEvent)) { // Kiểm tra isFetchingMore
            setIsFetchingMore(true); // Đặt isFetchingMore thành true khi bắt đầu tải thêm dữ liệu
            setPage(page + 1);
        }
    }

    const gotoChuyenXe = (TuyenXeID) => {
        navigation.navigate('Chuyến xe', { TuyenXeID });
    }

    const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
        loadTX();
        setRefreshing(false);
    }, 2000);
    };

    const search = (value, callback) => {
        setPage(1);
        callback(value)
    }

    const gotoSuaTuyenXe = (TuyenXeID) => {
        navigation.navigate('Chỉnh sửa tuyến xe', {TuyenXeID});
    }

    return (
        <View style={MyStyles.container}>
            <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
                <Searchbar placeholder="Nhập điểm đi..." onChangeText={(t) => search(t, setDi)} value={di} style={styles.search}/>
                {/* <Icon name="arrow-right" size={27} color="#900" /> */}
                <Searchbar placeholder="Nhập điểm đến..." onChangeText={(t) => search(t, setDen)} value={den} style={styles.search}/>
            </View>
            
            
                <ScrollView refreshControl={<RefreshControl refreshing={refreshing}
                onRefresh={onRefresh}/>} onScroll={loadMore}>
                    {loading && <ActivityIndicator/>}
                    { tuyenxe && tuyenxe.map(
                        c => (
                            <TouchableOpacity key={c.id}>
                                <View key={c.id} >
                                    <List.Item style={styles.margin} 
                                        title={c.Ten_tuyen} 
                                        right={() => (
                                            <View style={styles.buttonContainer}>
                                                <TouchableOpacity style={[styles.button]} onPress={() => {
                                                    Alert.alert('Lưu ý', 'Nếu bạn chưa thấy dữ liệu vui lòng Refresh');
                                                    gotoChuyenXe(parseInt(c.id))} } 
                                                >
                                                    <Text>Tìm kiếm</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[styles.button]} onPress={gotoSuaTuyenXe}>
                                                    <Text>Sửa</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    />
                                </View>
                            </TouchableOpacity>    
                        ))
                    }
                    {loading && page > 1 && <ActivityIndicator/>}
                    <TouchableOpacity style={[styles.button]} onPress={() => {navigation.navigate('Thêm tuyến xe')}}>
                        <Text>Thêm tuyến xe</Text>
                    </TouchableOpacity>
                </ScrollView>
               
                
        </View>
        
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        //marginTop: 20,
    },
    button: {
        width: '50px',
        height: '30px',
        alignItems: 'center',
        backgroundColor: 'pink',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },
    margin: {
        margin: 5,
    },
    search: {
        width: '100%',
        justifyContent: 'space-between',
        margin: 6,
    },
  });

  export default TuyenXe;