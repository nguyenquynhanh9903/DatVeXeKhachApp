import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BarChart } from 'react-native-chart-kit';
import API, { endpoints } from '../../configs/API';

const ThongKeDoanhThu = () => {
    const [selectedOption, setSelectedOption] = useState('year');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [data, setData] = useState([]);
    const [labels, setLabels] = useState([]);

    const tinhDoanhThu = async (option) => {
        try {
            const res = await API.get(endpoints['ve']);
            const vexeData = res.data;
            const revenueData = {};
            vexeData.forEach((ticket) => {
                const date = new Date(ticket.created_date);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const quarter = Math.ceil(month / 3);
                const revenue = parseInt(ticket.Gia);

                if (option === 'year') {
                    const label = `${year}`;
                    // nếu chưa có revenueData[label] thì cho nó là 0
                    if (!revenueData[label]) {
                        revenueData[label] = 0;
                    }
                    // tính doanh thu
                    revenueData[label] += revenue;
                } else if (option === 'month' && year === selectedYear && month === selectedMonth) {
                    const label = `${year}-${month < 10 ? '0' : ''}${month}`;
                    if (!revenueData[label]) {
                        revenueData[label] = 0;
                    }
                    revenueData[label] += revenue;
                } else if (option === 'quarter' && year === selectedYear && quarter === Math.ceil(selectedMonth / 3)) {
                    const label = `${year}-Quý${quarter}`;
                    if (!revenueData[label]) {
                        revenueData[label] = 0;
                    }
                    revenueData[label] += revenue;
                }
            });

            setData(Object.values(revenueData));
            setLabels(Object.keys(revenueData));
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
            setData([]);
            setLabels([]);
        }
    };

    useEffect(() => {
        tinhDoanhThu(selectedOption);
    }, [selectedOption, selectedYear, selectedMonth]);

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const handleYearChange = (year) => {
        setSelectedYear(year);
    };

    const handleMonthChange = (month) => {
        setSelectedMonth(month);
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={{fontSize: 20, fontWeight:'bold', fontStyle:'italic', marginTop: 8}}>BIỂU ĐỒ DOANH THU</Text>
            </View>
            <Picker
                selectedValue={selectedOption}
                style={{ height: 50, width: 167, marginTop: 5, marginBottom: 5}}
                onValueChange={(itemValue, itemIndex) => handleOptionChange(itemValue)}>
                <Picker.Item label="Theo Quý" value="quarter" />
                <Picker.Item label="Theo Năm" value="year" />
                <Picker.Item label="Theo Tháng" value="month" />
            </Picker>
            {selectedOption === 'month' || selectedOption === 'quarter' ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginRight: 10 }}>NĂM</Text>
                    <Picker
                        selectedValue={selectedYear}
                        style={{ height: 50, width: 150 }}
                        onValueChange={(itemValue, itemIndex) => handleYearChange(itemValue)}>
                        {Array.from({ length: new Date().getFullYear() - 2019 }, (v, i) => (
                            <Picker.Item key={2020 + i} label={(2020 + i).toString()} value={2020 + i} />
                        ))}
                    </Picker>
                </View>
            ) : null}
            {selectedOption === 'month' ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginRight: 10 }}>THÁNG</Text>
                    <Picker
                        selectedValue={selectedMonth}
                        style={{ height: 50, width: 150 }}
                        onValueChange={(itemValue, itemIndex) => handleMonthChange(itemValue)}>
                        {Array.from({ length: 12 }, (v, i) => (
                            <Picker.Item key={i + 1} label={(i + 1).toString()} value={i + 1} />
                        ))}
                    </Picker>
                </View>
            ) : null}
            <BarChart
                data={{
                    labels: labels,
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
                height={320}
                yAxisLabel={'VN'}
                chartConfig={{
                    backgroundColor: '#e26a00',
                    backgroundGradientFrom: '#FF5733',
                    backgroundGradientTo: '#FFA726',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16
                    },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#FFFF00"
                    }
                }}
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
                showValuesOnTopOfBars={true}
                withCustomBarColorFromData={true}
                flatColor={true}
                showBarTops={false}
                withInnerLines={false}
                withHorizontalLabels={false}
                fromZero={true}
            />
        </View>
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

export default ThongKeDoanhThu;