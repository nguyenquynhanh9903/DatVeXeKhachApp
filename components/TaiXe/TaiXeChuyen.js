import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, View, Text, ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';
import API, { endpoints } from '../../configs/API';
import MyContext, { MyUserContext } from '../../configs/MyContext';
import moment from 'moment/moment';

const ChuyenTaiXe = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const user = useContext(MyUserContext)
  const [taixe, setTaiXe] = useState([]);
  const [chuyenxe, setChuyenXe] = useState([]);
  const [page, setPage] = useState(1);
  const [page1, setPage1] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

 
  const loadTaiXe = async () => {
    if (page > 0) {
      try {
        setLoading(true);
        let url = `${endpoints['taixe']}?page=${page}`;
        let res = await API.get(url);
        if (page === 1) {
          setTaiXe(res.data.results);
          setPage(page + 1);
        } else if (page !== 0) {
          setTaiXe(current => [...current, ...res.data.results]);
          setPage(page + 1);
        }
        if (res.data.next === null) {
          setPage(0);
        }
      } catch (ex) {
        console.error(ex);
      } finally {
        setLoading(false);
      }
    }
  };

  const loadChuyenXe = async (tentaixe) => {
    try {
      setLoading(true);
      let found = false; // Biến này để kiểm tra xem có chuyến xe cần tìm hay không
      let tempChuyenXe = []; // Mảng tạm để lưu trữ danh sách chuyến xe mới
      for (let c of taixe) {
        if (c.Ten_taixe.toString().trim() === tentaixe.trim()) {
          let url = `${endpoints['chuyenxe']}?idtaixe=${c.id}&page=${page1}`;
          let res = await API.get(url);
          if (res.data.results.length > 0) {
            tempChuyenXe = [...tempChuyenXe, ...res.data.results];
            setPage1(page1 + 1);
            found = true; // Đánh dấu đã tìm thấy chuyến xe
          } else {
            setPage1(0); // Đặt page1 về 0 để ngăn không load thêm dữ liệu
          }
        }
      }
      if (found) {
        setChuyenXe(tempChuyenXe); // Nếu tìm thấy chuyến xe, cập nhật state
      } else {
        setChuyenXe([]); // Nếu không tìm thấy chuyến xe, đặt chuyenxe về mảng rỗng
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTaiXe();
  }, []);

  useEffect(() => {
    if (taixe.length > 0) {
      loadChuyenXe(`${user.first_name} ${user.last_name}`);
    }
  }, [taixe]);

  const goToHome = () => {
    navigation.navigate('Home');
  };

  const formatDate = (dateString) => {
      const date = moment(dateString, 'YYYY-MM-DD');
      return date.format('DD-MM-YYYY');
  };

  const renderItem = ({ item }) => {
      const currentDate = moment();
      const itemDate = moment(item.Ngay, 'YYYY-MM-DD');
      const hoanthanh = itemDate.isBefore(currentDate);
      const status = hoanthanh ? 'Đã hoàn thành' : 'Chưa hoàn thành';
      const machu = hoanthanh ? styles.completedText : styles.notCompletedText;
      return (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Tên Chuyến: {item.TenChuyenXe}</Text>
            <Text style={styles.itemText}>Nơi đi: {item.Noidi} - Nơi đến: {item.Noiden}</Text>
            <Text style={styles.itemText}>Giờ đi: {item.Giodi} - Giờ đến: {item.Gioden}</Text>
            <Text style={styles.itemText}>Ngày: {formatDate(item.Ngay)}</Text>
            <Text style={[styles.itemText, machu]}>Trạng thái: {status}</Text>
        </View>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1); // Đặt lại page về 1 khi làm mới dữ liệu
    setPage1(1); // Đặt lại page1 về 1 khi làm mới dữ liệu chuyến xe
    await loadTaiXe(); // Load lại dữ liệu tài xế
    await loadChuyenXe(`${user.first_name} ${user.last_name}`); // Load lại dữ liệu chuyến xe
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={{marginBottom: 10, marginTop: 10, fontWeight: 'bold', marginLeft: 45, fontSize: 20}}>DANH SÁCH CHUYẾN XE CỦA BẠN</Text>
      <FlatList
        data={chuyenxe}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Không có dữ liệu</Text>
          </View>
        )}
        ListFooterComponent={() => (
          loading && (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
              <View style={{ backgroundColor: '#ccc', padding: 20, borderRadius: 10 }}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            </View>
          )
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      marginBottom: 5,
      marginTop: 10,
  },
  itemText: {
      fontSize: 16,
      marginBottom: 5,
  },
  completedText: {
      color: 'green', // Màu chữ xanh khi trạng thái là 'Đã hoàn thành'
  },
  notCompletedText: {
      color: 'red', // Màu chữ mặc định khi trạng thái là 'Chưa hoàn thành'
  },
});

export default ChuyenTaiXe;