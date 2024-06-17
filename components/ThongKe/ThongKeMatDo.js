import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import API, { endpoints } from '../../configs/API';

const ThongKeMatDo = () => {
    const [data, setData] = useState([]);
    const [tuyenXe, setTuyenXe] = useState([]);
    const [labels, setLabels] = useState([]);
    const [tieude, setTieuDe] = useState([]);
    const colors = ['#00FFFF', '#1E90FF', '#0000FF', '#FFFF00', '#FF4500', '#FA8072', '#FF1493'];

    const soLuongChuyen = async () => {
        try {
            const res = await API.get(endpoints['tuyenxe']);
            const tuyenXe = res.data.results;
            setTuyenXe(res.data.results);
            const promises = tuyenXe.map(async tuyen => {
                const resChuyen = await API.get(`${endpoints['tuyenxe']}${tuyen.id}/ChuyenXe/`);
                const chuyenXe = resChuyen.data;
                return chuyenXe.length; // Trả về số lượng chuyến xe
            });
    
            const newData = await Promise.all(promises);
            const newLabels = tuyenXe.map(tuyen => tuyen.Ten_tuyen);
            setData(newData);
            setLabels(newLabels);
            setTieuDe(tuyenXe.map(tuyen => tuyen.id));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    

    useEffect(() => {
        soLuongChuyen();
    }, []);

    return (
        <ScrollView>
            <View>
                <Text style={{marginLeft: 75, marginTop: 23, fontWeight: 'bold', fontSize: 20}}>Mật độ chuyến xe theo tuyến</Text>
            </View>
            <View style={styles.container}>
                <BarChart
                    data={{
                        datasets: [{
                            data: data,
                            colors: [
                                (opacity = 1) => '#00FFFF',
                                (opacity = 1) => '#1E90FF',
                                (opacity = 1) => '#0000FF',
                                (opacity = 1) => '#FFFF00',
                                (opacity = 1) => '#FF4500',
                                (opacity = 1) => '#FA8072',
                                (opacity = 1) => '#FF1493',
                            ]
                        }]
                    }}
                    width={402}
                    height={290}
                    chartConfig={{
                        backgroundColor: '#e26a00',
                        backgroundGradientFrom: '#FF5733',
                        backgroundGradientTo: '#FFA726',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        barRadius: 5,
                    
                        
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                    showValuesOnTopOfBars={true}
                    verticalLabelRotation={140}
                    withCustomBarColorFromData={true}
                    flatColor={true}
                    showBarTops={false}
                    withInnerLines={false}
                    withHorizontalLabels={false}
                    fromZero={true}
                />
                <View>
                    <Text style={{marginTop: 15, fontSize: 18, marginBottom: 15, fontStyle:'italic'}}>Chú thích Tuyến Xe:</Text>
                    {tuyenXe && tuyenXe.map(
                        (c, index) => (
                            <View style={[styles.legendContainer, {marginRight: 150}]} key={c.id}>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendSquare, { backgroundColor: colors[index % colors.length] }]} />
                                    <Text>{c.Ten_tuyen}</Text>
                                </View>
                            </View>
                        )
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    legendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    legendSquare: {
        width: 10,
        height: 10,
        marginRight: 5,
    }
});

export default ThongKeMatDo;
