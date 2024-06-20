import Home from "./components/Home/Home";
import Register from "./components/User/Register";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./components/User/Login";
import { createDrawerNavigator } from "@react-navigation/drawer";
import 'react-native-gesture-handler';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useContext, useReducer } from "react";
import MyUserReducer from "./Reducer/MyUserReducer";
import { Icon } from "react-native-paper";
import Logout from "./components/User/Logout";
import { createStackNavigator } from "@react-navigation/stack";
import NhanVienDetail from "./components/NhanVien/NhanVienDetails";
import SuaNhanVien from "./components/NhanVien/SuaNhanVien";
import KhachHangDetail from "./components/KhachHang/KhachHangDetail";
import SuaKhachHang from "./components/KhachHang/SuaKhachHang";
import ThemKhachHang from "./components/KhachHang/ThemKhachHang";
import NhanVien from "./components/NhanVien/NhanVien";
import KhachHang from "./components/KhachHang/KhachHang";
import Thongke from "./components/ThongKe/TCThongKe";
import ThongKeDoanhThu from "./components/ThongKe/ThongKeDoanhThu";
import ThongKeMatDo from "./components/ThongKe/ThongKeMatDo";
import Profile from "./components/User/Profile";
import RegisterAdmin from "./components/User/RegisterAdmin";
import HomeAdmin from "./components/Home/HomeAdmin";
import MyContext, { MyDispatchContext, MyUserContext } from "./configs/MyContext";
import TuyenXe from "./components/TuyenXe/TuyenXe";
import ThemNhanVien from "./components/NhanVien/ThemNhanVien";
import ThemTuyenXe from "./components/TuyenXe/ThemTuyenXe";
import ChuyenXe from "./components/ChuyenXe/ChuyenXe";
import ChuyenXeDetail from "./components/ChuyenXe/ChuyenXeDetail";
import DatVe from "./components/VeXe/VeXe";
import ThemChuyenXe from "./components/ChuyenXe/ThemChuyenXe";
import SuaTuyenXe from "./components/TuyenXe/SuaTuyenXe";
import TaiXe from "./components/TaiXe/TaiXe";
import ThemTX from "./components/TaiXe/ThemTaiXe";
import TaiXeDetail from "./components/TaiXe/TaiXeDetail";
import SuaTaiXe from "./components/TaiXe/SuaTaiXe";
import ChuyenTaiXe from "./components/TaiXe/TaiXeChuyen";
import SuaChuyenXe from "./components/ChuyenXe/SuaChuyenXe";


const Drawer = createDrawerNavigator();
const MyDrawer = () => {
  const user = useContext(MyUserContext);
  return(
    
      <Drawer.Navigator screenOptions={{headerRight: Logout, drawerActiveBackgroundColor: '#F2CED5'}}>
    
          {user === null ? <>
            <Drawer.Screen name="Home" component={Home} screenOptions={{headerShown: false}}/>
            <Drawer.Screen name="Register" component={Register} options={{title: 'Đăng ký'}}/>
            <Drawer.Screen name='Login' component={Login} options={{title: 'Đăng nhập'}} />
          </> : <>
            <Drawer.Screen name="Home" component={Home} screenOptions={{headerShown: false}}/>
            <Drawer.Screen name='Profile - Đơn hàng' component={Profile} options={{title: 'Thông tin tài khoản'}} />
            <Drawer.Screen name='Logout' component={Logout} options={{title: 'Đăng xuất'}} />
          </>}

          {user && user.Loai_NguoiDung === "1" && (
            <>
              <Drawer.Screen name="HomeAdmin" component={HomeNavigator} options={{title: 'Quản lý'}} />
              <Drawer.Screen name="RegisterAdmin" component={RegisterAdmin} options={{title: 'Đăng ký tài khoản nhân viên'}} />
            </>
          )}

          {((user && user.Loai_NguoiDung === "2") || (user && user.Loai_NguoiDung === "3") &&
            <>
              <Drawer.Screen name="Tuyến xe" component={TuyenXeNavigator}/>
            </>
          )}

          {user && user.Loai_NguoiDung === "4" && (
            <>
              <Drawer.Screen name="Tuyến xe" component={TuyenXeNavigator} />
              <Drawer.Screen name="Tài xế - Chuyến" component={ChuyenTaiXe} />
            </>
          )}
      </Drawer.Navigator>
    
  );
}

const Stack = createStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Drawer.Screen name="HomeAdmin" component={HomeAdmin} />
      <Drawer.Screen name="Nhân viên" component={NhanVienNavigator} />
      <Drawer.Screen name="Khách hàng" component={KhachHangNavigator} />
      <Drawer.Screen name="Tài xế" component={TaiXeNavigator} />
      <Drawer.Screen name="Thống kê" component={ThongKeNavigator} />
    </Stack.Navigator>
  )
}


const NhanVienNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: true}}>
      <Stack.Screen name="Nhân viên - Danh sách" component={NhanVien} />
      <Stack.Screen name="Thêm nhân viên" component={ThemNhanVien}/>
      <Stack.Screen name="Thông tin nhân viên" component={NhanVienDetail} />
      <Stack.Screen name="Sửa nhân viên" component={SuaNhanVien} />
    </Stack.Navigator>
  );
}

const KhachHangNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Khách hàng - Danh sách" component={KhachHang} />
      <Stack.Screen name="Thông tin khách hàng" component={KhachHangDetail} />
      <Stack.Screen name="Sửa khách hàng" component={SuaKhachHang} />
      <Stack.Screen name="Thêm khách hàng" component={ThemKhachHang} />
    </Stack.Navigator>
  );
}

const TaiXeNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tài xế - Danh sách" component={TaiXe} />
      <Stack.Screen name="Thông tin tài xế" component={TaiXeDetail} />
      <Stack.Screen name="Sửa tài xế" component={SuaTaiXe} />
      <Stack.Screen name="Thêm tài xế" component={ThemTX} />
    </Stack.Navigator>
  );
}

const ThongKeNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Hãy chọn thống kê mà bạn muốn!" component={Thongke} />
      <Stack.Screen name="Thống kê doanh thu" component={ThongKeDoanhThu} />
      <Stack.Screen name="Thống kê mật độ" component={ThongKeMatDo} />
    </Stack.Navigator>
  );
}

 const TuyenXeNavigator = () => {
  return (
    <Stack.Navigator>
      <Drawer.Screen name="Danh sách tuyến xe" component={TuyenXe} />
      <Drawer.Screen name="Chuyến xe" component={ChuyenXe} />
      <Drawer.Screen name="Chi tiết chuyến xe" component={ChuyenXeDetail} />
      <Drawer.Screen name="Đặt vé" component={DatVe} />
      <Drawer.Screen name="Danh sách vé đã mua" component={Profile}/>
      <Drawer.Screen name="Chỉnh sửa tuyến xe" component={SuaTuyenXe}/>
      <Drawer.Screen name="Sửa chuyến xe" component={SuaChuyenXe} />
      <Drawer.Screen name="Thêm tuyến xe" component={ThemTuyenXe} />
      <Drawer.Screen name="Thêm chuyến xe" component={ThemChuyenXe} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
const MyTab = () => {
  const user = useContext(MyUserContext);
  return(
    <Tab.Navigator screenOptions={{headerShown: true, tabBarLabelStyle: {color: "#A60D29"}}}>
      
      <Tab.Screen name="Home" component={MyDrawer} 
      options={{tabBarIcon: ({color, size}) => (
      <MaterialCommunityIcons name="home" color='#A60D29' size={size} />
      ),}}/>

      <Tab.Screen name='Tuyến xe' component={TuyenXeNavigator} 
      options={{tabBarIcon: ({color, size}) => (
      <MaterialCommunityIcons name="bus" color='#A60D29' size={size} />
      ),}}/>

      {user !== null && (
        <>
          <Tab.Screen name='Tài khoản' component={Profile} 
          options={{tabBarIcon: ({color, size}) => (
          <MaterialCommunityIcons name="account" color='#A60D29' size={size} />
          ),}}/>
        </>
      )}

    </Tab.Navigator>
  );
}

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  return(
    <NavigationContainer>
      <MyUserContext.Provider value={user}> 
        <MyDispatchContext.Provider value={dispatch}>
          <MyTab/>
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </NavigationContainer>
  );
}

export default App;