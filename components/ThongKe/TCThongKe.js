import React from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Thongke = ({navigation}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.buttonContainer, { backgroundColor: '#1E90FF' }]}
                onPress={() => navigation.navigate('Thống kê doanh thu')}>
                <Text style={styles.buttonText}>DOANH THU</Text>
            </TouchableOpacity>
            <Text style={{height: 110}}></Text>
            <TouchableOpacity
                style={[styles.buttonContainer, { backgroundColor: '#FF6347' }]}
                onPress={() => navigation.navigate('Thống kê mật độ')}>
                <Text style={styles.buttonText}>MẬT ĐỘ CHUYẾN XE</Text>
            </TouchableOpacity>
        </View>
      );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        width: 200,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    },
});

export default Thongke;