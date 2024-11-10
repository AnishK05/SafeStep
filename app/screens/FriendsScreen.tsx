// import React, { useState } from 'react';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import { Platform, StyleSheet, View, Dimensions, Text, ScrollView, FlatList,  } from 'react-native';
import React from 'react';


export default function App() {
//  const [people, setPeople] = useState([
//    { name: 'shaun', id: '1' },
//    { name: 'yoshi', id: '2' },
//    { name: 'mario', id: '3' },
//    { name: 'luigi', id: '4' },
//    { name: 'peach', id: '5' },
//    { name: 'toad', id: '6' },
//    { name: 'bowser', id: '7' },
//  ]);


 return (
   <View style={styles.container}>
       <MapView style={styles.map} />
   </View>
  
 );
}


const styles = StyleSheet.create({
 container: {
   flex: 1,
   alignItems: 'center',
 },
 map: {
   width: '92%',
   height: '55%',
   borderRadius: 30,
 },
});
