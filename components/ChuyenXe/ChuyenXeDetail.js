import React, { useContext } from 'react';
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import API, { BASE_URL, authAPI, endpoints } from "../../configs/API";
import moment from 'moment';
import MyStyles from '../../styles/MyStyles';
import { height } from '@fortawesome/free-solid-svg-icons/fa0';
import MyContext, { MyDispatchContext, MyUserContext } from '../../configs/MyContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Button, TextInput } from 'react-native-paper';

const ChuyenXeDetail = ({ route }) => {
    const navigation = useNavigation();
    const { ChuyenXeID, Gia } = route.params;
    const user = useContext(MyUserContext);
    const [chuyenxe, setChuyenXe] = useState([]);
    const [comments, setComments] = useState();
    const [contextCom, setContextCom] = useState('');
    const [viewComments, setViewComments] = useState(false);

    useEffect(() => {
        const ChuyenXeDetail = async () => {
          try {
            const res = await API.get(`${endpoints['chuyenxe']}?q=${ChuyenXeID}`);
            setChuyenXe(res.data.results);
          } catch (error) {
            console.error(error);
          }
        };

        const loadComments = async () => {
            try{
                let res = await API.get(endpoints['comments'](ChuyenXeID));
                setComments(res.data.results);
            } catch (ex){
                console.error(ex);
            }
        }

        ChuyenXeDetail();
        loadComments();
    }, [ChuyenXeID]);

    
    const addComment = async () => {
    try {
            if (!contextCom) {
                alert('Vui lòng nhập nội dung bình luận');
                return;
            }

            if (!chuyenxe || !user) {
                alert('Đang tải dữ liệu, vui lòng đợi...');
                return;
            }
            
            let accessToken = await AsyncStorage.getItem("access_token");
            let res = await authAPI(accessToken).post(endpoints['them_comment'](ChuyenXeID),{
                    'content': contextCom
                }
            
            );
            setComments(current => [res.data, ...current])
            setContextCom('');
        } catch (error) {
            console.error('Lỗi:', error.message);
            alert('Đã xảy ra lỗi khi thêm nhân viên');
        }
    };

    const cancelComment = () => {
        setContextCom(''); // Xóa nội dung bình luận
    };

    const formDate = (date) => {
        return moment(date, 'YYYY/MM/DD').format('DD/MM/YYYY');
    }

    const formDateComment = (date) => {
        return moment(date).format('DD/MM/YYYY HH:mm:ss')
    }

    const ThoiHanChuyenXe = (ngayChuyenXe) => {
        const now = new Date();
        const chuyenXeDate = new Date(ngayChuyenXe);
        return chuyenXeDate < now;
    };

    const quaylai = (TuyenXeID) => {
        navigation.navigate('Chuyến xe', {TuyenXeID});
    }

    const dat = (ChuyenXeID) => {
        navigation.navigate('Đặt vé', {ChuyenXeID});
    }

    const sua = (ChuyenXeID) => {
        navigation.navigate('Sửa chuyến xe',{ChuyenXeID})
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.container}>
                    {chuyenxe && chuyenxe.map(c => (
                        <View style={styles.detailContainer} key={c.id}>
                            <Text style={styles.title}>Chuyến Xe {c.TenChuyenXe}</Text>
                            <View style={styles.detailItem}>
                                <Text style={styles.label}>Ngày khởi hành:</Text>
                                <Text style={styles.info}>{formDate(c.Ngay)}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.label}>Điểm Khởi Hành:</Text>
                                <Text style={styles.info}>{c.Noidi}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.label}>Điểm Đến:</Text>
                                <Text style={styles.info}>{c.Noiden}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.label}>Thời Gian Khởi Hành:</Text>
                                <Text style={styles.info}>{c.Giodi}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.label}>Giá vé:</Text>
                                <Text style={styles.info}>{Gia}</Text>
                            </View>
                            <View style={styles.buttonContainer}>
                                {!ThoiHanChuyenXe(c.Ngay) ? (
                                    <Button 
                                        title="Đặt vé" mode='contained' style={styles.button}
                                        onPress={() => {
                                            dat(c.id)
                                        }} 
                                    >Đặt vé</Button>
                                ) : (
                                    <Button 
                                        title="Bình luận" mode='contained' style={styles.button}
                                        onPress={() => {
                                            setViewComments(true);
                                        }} 
                                    >Bình luận</Button>
                                )}
                                {user && user.Loai_NguoiDung === "1" && (
                                    <Button
                                        title='Chỉnh sửa'
                                        onPress={() => sua(c.id)}
                                        mode='contained' style={styles.button}
                                    >Chỉnh sửa</Button>
                                )}
                                <Button title='Quay lại' onPress={() => quaylai(c.Ma_Tuyen)} mode='contained' style={styles.button}>Quay lại</Button>
                            </View>
                        </View>
                    ))}
                </View>
                {viewComments && (
                    <ScrollView>
                        <View style={styles.addCommentContainer}>
                        {user !== null ? (
                            <Image style={styles.commentAvatar} source={{ uri: user.avatar }} />
                        ) : null}
                            <TextInput
                                style={styles.inputComment}
                                placeholder="Viết bình luận..."
                                value={contextCom}
                                onChangeText={(text) => setContextCom(text)}
                            />
                            <TouchableOpacity onPress={addComment}>
                                <Text style={styles.addButton}>Thêm</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={cancelComment}>
                                <Text style={styles.cancelButton}>Hủy</Text>
                            </TouchableOpacity>
                        </View>
                        {comments === null ? (
                            <ActivityIndicator />
                        ) : (
                            <>
                                {comments.map((c) => (
                                    <View key={c.id} style={styles.commentItem}>
                                        <Image style={styles.commentAvatar} source={{ uri: c.user.avatar }} />
                                        <View style={styles.commentContent}>
                                            <Text style={styles.commentTen}>{[c.user.first_name, c.user.last_name]. join(' ')}</Text>
                                            <Text style={styles.commentText}>{c.content}</Text>
                                            <Text style={styles.commentDate}>{formDateComment(c.created_date)}</Text>
                                        </View>
                                    </View>
                                ))}
                            </>
                        )}
                    </ScrollView>
                )}
            </View>
        </ScrollView>
    );
}    

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: -20,
        margin: 10,
        justifyContent: 'center',
        color: '#bf6b7b'
    },
    detailItem: {
        marginBottom: 10,
        marginLeft: -10,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    info: {
        fontSize: 18,
    },
    commentContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 5,
    },
    commentTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    commentItem: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    commentAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    commentContent: {
        flex: 1,
    },
    commentTen: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    commentText: {
        fontSize: 16,
    },
    commentDate: {
        fontSize: 12,
        color: '#777777',
    },
    addCommentContainer: {
        flexDirection: 'row', // Sắp xếp các thành phần theo chiều ngang
        alignItems: 'center', // Canh chỉnh các thành phần theo chiều dọc
        marginBottom: 20, // Khoảng cách phía dưới
    },
    inputComment: {
        flex: 1, // TextInput chiếm phần lớn của không gian
        borderWidth: 1, // Đường viền
        borderColor: 'gray', // Màu đường viền
        borderRadius: 5, // Độ cong góc của viền
        paddingHorizontal: 8, // Khoảng cách lề bên trong theo chiều ngang
        paddingVertical: 8, // Khoảng cách lề bên trong theo chiều dọc
        marginRight: 10, // Khoảng cách với Button
        backgroundColor:'#F2CED5',
    },
    cancelButton: {
        color: 'red', // Màu chữ
        marginLeft: 10, // Khoảng cách với TextInput
    },
    addButton: {
        color: 'blue', // Màu chữ
        marginLeft: 10, // Khoảng cách với TextInput
    },
    buttonContainer: {
        flexDirection: 'row', // Sắp xếp các nút theo chiều ngang
        justifyContent: 'space-between', // Canh chỉnh các nút theo chiều ngang
        marginVertical: 10, // Khoảng cách phía trên và phía dưới
    },
    button: {
        width:200,
        height: 50,
        backgroundColor: '#BF6B7B',
        //paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        margin: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ChuyenXeDetail;
