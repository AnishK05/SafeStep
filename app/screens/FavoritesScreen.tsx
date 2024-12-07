import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/navigationTypes';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

type FavoriteScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Favorites'>;

type City = {
  id: string;
  name: string;
  background: any;
};

type RecentlyAddedItem = {
  id: string;
  image: any; // Use `require()` for local images
  title: string;
  subtitle: string;
};

const FavoriteScreen = () => {
  const navigation = useNavigation<FavoriteScreenNavigationProp>();
  const { isDarkTheme } = useTheme();
  const route = useRoute(); // Get the current route

  const cities: City[] = [
    { id: '0', name: '+', background: null },
    { id: '1', name: 'Austin', background: require('../assets/images/city_skyline.png') },
    { id: '2', name: 'Dallas', background: require('../assets/images/city_skyline.png') },
    { id: '3', name: 'Houston', background: require('../assets/images/city_skyline.png') },
    { id: '4', name: 'Chicago', background: require('../assets/images/city_skyline.png') },
    { id: '5', name: 'New York', background: require('../assets/images/city_skyline.png') },
    { id: '6', name: 'DC', background: require('../assets/images/city_skyline.png') },
    { id: '7', name: 'Miami', background: require('../assets/images/city_skyline.png') },
    { id: '8', name: 'Phoenix', background: require('../assets/images/city_skyline.png') },
  ];

  const recentlyAdded: RecentlyAddedItem[] = [
    {
      id: '1',
      image: require('../assets/images/capitol.jpg'),
      title: 'Texas State Capitol',
      subtitle: 'Austin',
    },
    {
      id: '2',
      image: require('../assets/images/zilker.jpg'),
      title: 'Zilker Metropolitan Park',
      subtitle: 'Austin',
    },
    {
      id: '3',
      image: require('../assets/images/aquarium.jpg'),
      title: 'The Aquarium',
      subtitle: 'Austin',
    },
  ];

  const renderCityItem = ({ item }: { item: City }) => {
    if (item.name === '+') {
      // Special styling for the "New" button
      return (
        <TouchableOpacity style={styles(isDarkTheme).newButtonTile}>
          <Ionicons name="add" size={32} color="#0078D4" />
          <Text style={styles(isDarkTheme).newButtonText}>New</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles(isDarkTheme).cityTile}>
        <ImageBackground
          source={item.background}
          style={styles(isDarkTheme).cityBackground}
          imageStyle={styles(isDarkTheme).cityImage}
        >
          <View style={styles(isDarkTheme).overlay} />
          <Text style={styles(isDarkTheme).cityText}>{item.name}</Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  const RecentlyAddedCard = ({ item }: { item: RecentlyAddedItem }) => (
    <View style={styles(isDarkTheme).card}>
      <Image source={item.image} style={styles(isDarkTheme).cardImage} />
      <View style={styles(isDarkTheme).cardTextContainer}>
        <Text style={styles(isDarkTheme).cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles(isDarkTheme).cardSubtitle} numberOfLines={1}>
          {item.subtitle}
        </Text>
      </View>
    </View>
  );

  const isActive = (routeName: string) => route.name === routeName;

  // Colors for active and inactive states
  const activeColor = isDarkTheme ? 'white' : '#585d69';
  const inactiveColor = isDarkTheme ? 'rgba(204, 204, 204, 0.5)' : 'rgba(128, 128, 128, 0.5)'; // Duller color with lower opacity for inactive icons

  return (

    <View style={styles(isDarkTheme).container}>

      {/* Back Button */}
      <TouchableOpacity style={styles(isDarkTheme).backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles(isDarkTheme).containerFav}>
        {/* Grid Section */}
        <FlatList
          data={cities}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={renderCityItem}
          contentContainerStyle={styles(isDarkTheme).grid}
        />

        {/* Recently Added Section */}
        <Text style={styles(isDarkTheme).sectionTitle}>Recently Added</Text>
        <FlatList
          data={recentlyAdded}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <RecentlyAddedCard item={item} />}
          contentContainerStyle={styles(isDarkTheme).recentlyAddedList}
        />
      </View>

      {/*Navigation Bar*/}
      <View style={styles(isDarkTheme).bottomNav}>
        <TouchableOpacity style={styles(isDarkTheme).navItem} onPress={() => navigation.navigate('Home')}>
            <Ionicons
              name="home"
              size={24}
              color={isActive('Home') ? activeColor : inactiveColor}
            />
            <Text style={[styles(isDarkTheme).navText, { color: isActive('Home') ? activeColor : inactiveColor }]}>
              Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles(isDarkTheme).navItem} onPress={() => navigation.navigate('Favorites')}>
            <FontAwesome
              name="star"
              size={24}
              color={isActive('Favorites') ? activeColor : inactiveColor}
            />
            <Text style={[styles(isDarkTheme).navText, { color: isActive('Favorites') ? activeColor : inactiveColor }]}>
              Favorites
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles(isDarkTheme).navItem} onPress={() => navigation.navigate('Friends')}>
            <FontAwesome
              name="smile-o"
              size={24}
              color={isActive('Friends') ? activeColor : inactiveColor}
            />
            <Text style={[styles(isDarkTheme).navText, { color: isActive('Friends') ? activeColor : inactiveColor }]}>
              Friends
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles(isDarkTheme).navItem} onPress={() => navigation.navigate('Profile')}>
            <Ionicons
              name="person"
              size={24}
              color={isActive('Profile') ? activeColor : inactiveColor}
            />
            <Text style={[styles(isDarkTheme).navText, { color: isActive('Profile') ? activeColor : inactiveColor }]}>
              Profile
            </Text>
          </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = (isDarkTheme: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkTheme ? '#0b1a34' : '#f5f5f5',
    },
    backButton: {
      position: 'absolute',
      top: 80,
      left: 15,
      zIndex: 10,
      backgroundColor: isDarkTheme ? '#1c2a48' : 'black',
      borderRadius: 50,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    containerFav: {
      marginTop: 150,
      marginLeft: 10,
    },
    grid: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    cityTile: {
      width: 120,
      height: 120,
      margin: 8,
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 6,
      elevation: 4, // For Android shadow
      backgroundColor: isDarkTheme ? '#1c2a48' : '#e6e6e6',
    },
    cityBackground: {
      flex: 1,
      justifyContent: 'flex-end', // Align image to the bottom
      alignItems: 'center',
    },
    cityImage: {
      resizeMode: 'contain',
      opacity: 0.4, // Fade effect for the background
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isDarkTheme ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.3)',
    },
    cityText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: isDarkTheme ? 'white' : 'black',
      marginBottom: 2,
    },
    newButtonTile: {
      width: 117,
      height: 117,
      margin: 10,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDarkTheme ? '#1c2a48' : '#f0f0f0',
      borderWidth: 2,
      borderColor: '#0078D4',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 6,
      elevation: 4,
    },
    newButtonText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#0078D4',
      marginTop: 5,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 35,
      marginLeft: 10,
      color: isDarkTheme ? '#ffffff' : '#000000',
    },
    recentlyAddedList: {
      marginTop: 15,
      marginLeft: 10,
    },
    card: {
      backgroundColor: isDarkTheme ? '#333' : '#fff',
      borderRadius: 10,
      width: 160,
      height: 170,
      marginRight: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
    },
    cardImage: {
      width: '100%',
      height: 100,
    },
    cardTextContainer: {
      padding: 8,
    },
    cardTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: isDarkTheme ? '#ffffff' : '#000',
      marginBottom: 4,
    },
    cardSubtitle: {
      fontSize: 12,
      color: isDarkTheme ? '#bbb' : '#555',
    },
    bottomNav: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingVertical: 10,
      paddingBottom: 50,
      backgroundColor: isDarkTheme ? '#1c2a48' : '#ffffff',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
    },
    navItem: {
      alignItems: 'center',
    },
    navText: {
      fontSize: 12,
      color: isDarkTheme ? '#cccccc' : 'gray',
    },
  });

export default FavoriteScreen;
