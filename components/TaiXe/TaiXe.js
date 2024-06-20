import { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, ActivityIndicator, Image, ScrollView, Button, Text, StyleSheet, TouchableOpacity, RefreshControl } from "react-native"
import { List, Searchbar } from "react-native-paper";
import API, { endpoints } from "../../configs/API";
import MyStyles from "../../styles/MyStyles"
import "moment/locale/vi"
import { MyUserContext } from "../../configs/MyContext";

const TaiXe = () => {
    const navigation = useNavigation();
    const [taixe, setTaiXe] = useState([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const user = useContext(MyUserContext); 

    const loadTX = async () => {
        if (page > 0) {
            try {
                setLoading(true);
                let url;
                if (!isNaN(q)) {
                    url = `${endpoints['taixe']}?mataixe=${q}&page=${page}`;
                } else {
                    url = `${endpoints['taixe']}?q=${q}&page=${page}`;
                }
                let res = await API.get(url);
                if (page === 1) {
                    setTaiXe(res.data.results);
                } else if(page !== 0) {
                    setTaiXe(current => [...current, ...res.data.results]);
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
    }, [q, page]);

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

    const goToHome = () => {
        navigation.navigate('Home');
    }

    const gotoDetail = (TaiXeID) => {
        navigation.navigate('Thông tin tài xế', { TaiXeID });
    }

    const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
            loadTX();
        setRefreshing(false);
    }, 2000);
    };

    const gotoAdd = () => {
        navigation.navigate('Thêm tài xế');
    }  

    const search = (value, callback) => {
        setPage(1);
        callback(value)
    }

    return (
        <View style={MyStyles.container}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 , marginTop: -40}}>Danh sách tài xế</Text>
            <View>
                <Searchbar placeholder="Nhập id hoặc tên của tài xế..." onChangeText={(t) => search(t, setQ)} value={q} />
            </View>
            <ScrollView refreshControl={<RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}/>} onScroll={loadMore}>
                {loading && <ActivityIndicator/>}
                { taixe && taixe.map(
                    c => (
                        <TouchableOpacity onPress={() => gotoDetail(c.id)} key={c.id}>
                            <View key={c.id} >
                                <List.Item style={styles.margin} 
                                    title={c.Ten_taixe} 
                                    description={c.Email}
                                    left={() => (
                                        <Image 
                                            style={MyStyles.avatar} 
                                            source={{
                                                uri: c.avatar && c.avatar.endsWith('.jpeg') 
                                                    ? `file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FDatVeXeKhachApp-8eb51fdd-b5f9-455f-b225-8f4db299e1f9/ImagePicker/${c.avatar.substring(c.avatar.lastIndexOf('/') + 1)}`
                                                    : c.avatar
                                            }} 
                                        />
                                    )}
                                />
                            </View>
                        </TouchableOpacity>    
                    ))
                }
                <View style={styles.buttonContainer}>
                      <TouchableOpacity style={[styles.button, { width: 150 }]} onPress={goToHome}>
                        <Text style={styles.buttonText}>Quay lại</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.button, { width: 150 }]} onPress={gotoAdd}>
                        <Text style={styles.buttonText}>Thêm</Text>
                      </TouchableOpacity>
                </View>
                {loading && page > 1 && <ActivityIndicator/>}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
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

  export default TaiXe;