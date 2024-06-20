import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const BASE_URL = 'http://172.20.10.4:8000/';

export const endpoints = {
    'nhanvien': '/NhanVien/',
    'khachhang': '/KhachHang/',
    'taixe': '/TaiXe/',
    'ghe': '/Ghe/',
    'xe': '/Xe/',
    've': '/VeXe/',
    'le': '/le/',
    'momo': '/payment/',
    'zalo':'/zalo/payment/',
    'chucvu': '/loainguoidung/',
    'chitietve': '/chitietve/',
    'them_NV': '/NhanVien/Them_NV/',
    'them_KH': '/KhachHang/Them_KH/',
    'them_KH_Di': '/KhachHangDi/Them_KH_Di/',
    'them_TX': '/TaiXe/Them_TX/',
    'them_Ve': '/VeXe/Them_VeXe/',
    'them_tuyenXe': '/TuyenXe/Them_TuyenXe/',
    'them_chuyenXe': '/ChuyenXe/Them_ChuyenXe/',
    'tuyenxe': '/TuyenXe/',
    'chuyenxe': '/ChuyenXe/',
    'Register': '/users/',
    'Login': '/o/token/',
    'current-user': '/users/current_user/',
    'comments': (chuyenxeID) => `/ChuyenXe/${chuyenxeID}/comments`,
    'them_comment': (chuyenxeID) => `ChuyenXe/${chuyenxeID}/Them_comments/`,
    'them_chi_tiet_ve': (vexeID) => `VeXe/${vexeID}/Them_Chi_Tiet_Ve/`,
    'trang_thai_ghe': (gheID) => `/Ghe/${gheID}/CapNhat_TT/`,
};

export const authAPI = (accessToken) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: `bearer ${accessToken?accessToken:AsyncStorage.getItem("access_token")}`
        }
    });
}
    
export default axios.create({
    baseURL: BASE_URL
});