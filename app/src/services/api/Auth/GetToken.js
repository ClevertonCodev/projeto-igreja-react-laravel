import AsyncStorage from '@react-native-async-storage/async-storage'

const token = async (bearer = null) => {
    try {
        const token = await AsyncStorage.getItem('access_token');
        if (bearer) {
            return 'Bearer ' + token;
        }
        return token ? token : null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export default token;

