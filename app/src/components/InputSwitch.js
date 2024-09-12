// import React, { useState } from 'react';
// import { View, Switch, StyleSheet, Text } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome'; // Biblioteca para ícones

// const CustomSwitch = () => {
//     const [isEnabled, setIsEnabled] = useState(false);

//     const toggleSwitch = () => setIsEnabled(previousState => !previousState);

//     return (
//         <View style={styles.container}>
//             <View style={styles.switchContainer}>
//                 <Switch
//                     trackColor={{ false: '#767577', true: '#4CD964' }} // Cor de fundo (verde quando ligado)
//                     thumbColor={isEnabled ? '#fff' : '#f4f3f4'} // Cor do botão (branco)
//                     ios_backgroundColor="#3e3e3e" // Cor de fundo no iOS quando desligado
//                     onValueChange={toggleSwitch}
//                     value={isEnabled}
//                     style={styles.switch}
//                 />
//                 {isEnabled && (
//                     <View style={styles.iconContainer}>
//                         <Icon name="check" size={12} color="#4CD964" />
//                     </View>
//                 )}
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     switchContainer: {
//         position: 'relative',
//     },
//     switch: {
//         transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }], // Aumentar o tamanho do switch
//     },
//     iconContainer: {
//         position: 'absolute',
//         right: 10, // Ajusta a posição do ícone
//         top: 10,
//         backgroundColor: '#fff',
//         borderRadius: 50,
//         width: 20,
//         height: 20,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
// });

// export default CustomSwitch;
