import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/navigationTypes'; // Adjust the path if needed
import { Ionicons, FontAwesome } from '@expo/vector-icons';

type FavoriteScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Favorites'>;

type City = {
  id: string;
  name: string;
  icon: string | null;
};

type RecentlyAddedItem = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
};

const FavoriteScreen = () => {
  const navigation = useNavigation<FavoriteScreenNavigationProp>();

  const cities: City[] = [
    { id: '0', name: '+', icon: null },
    { id: '1', name: 'Austin', icon: null },
    { id: '2', name: 'Dallas', icon: null },
    { id: '3', name: 'Houston', icon: null },
    { id: '4', name: 'Chicago', icon: null }, 
    { id: '5', name: 'New York', icon: null },
    { id: '6', name: 'DC', icon: null }, 
    { id: '7', name: 'Miami', icon: null },
    { id: '8', name: 'Pheonix', icon: null },
  ];

  const recentlyAdded = [
    {
      id: '1',
      image: 'https://via.placeholder.com/1200x800/0078D4/FFFFFF?text=Texas+State+Capitol',
      title: 'Texas State Capitol',
      subtitle: 'Austin',
    },
    {
      id: '2',
      image: 'https://via.placeholder.com/1200x800/0078D4/FFFFFF?text=Zilker+Park',
      title: 'Zilker Metropolitan Park',
      subtitle: 'Austin',
    },
    {
      id: '3',
      image: 'https://via.placeholder.com/1200x800/0078D4/FFFFFF?text=Aquarium',
      title: 'The Aquarium',
      subtitle: 'Austin',
    },
  ];
  
  
  const renderCityItem = ({ item }: { item: City }) => (
    <TouchableOpacity style={styles.cityTile}>
      <Text style={styles.cityText}>{item.name || '+'}</Text>
    </TouchableOpacity>
  );

  const RecentlyAddedCard = ({ item }: { item: RecentlyAddedItem }) => {
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        </View>
      </View>
    );
  };
  


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      

      <View style={styles.containerFav}>
      {/* Grid Section */}
      <FlatList
        data={cities}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={renderCityItem}
        contentContainerStyle={styles.grid}
      />

      {/* Recently Added Section */}
      <Text style={styles.sectionTitle}>Recently Added</Text>
      <FlatList
        data={recentlyAdded}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <RecentlyAddedCard item={item} />}
        contentContainerStyle={styles.recentlyAddedList}
      />
    </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color="gray" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Favorites')}>
          <FontAwesome name="star" size={24} color="gray" />
          <Text style={styles.navText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Friends')}>
          <FontAwesome name="smile-o" size={24} color="gray" />
          <Text style={styles.navText}>Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={24} color="gray" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 5,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    borderRadius: 50,
    width: 40,
    height: 40,
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  screenTitle: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  bottomNav: {
    position: 'absolute', // Position it absolutely
    bottom: 0, // Align to the bottom of the screen
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 50, // Add padding for bottom navigation
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12, // Adjust text size for bottom nav
    color: 'gray',
  },
  containerFav: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  grid: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cityTile: {
    backgroundColor: '#f0f0f0',
    width: 100,
    height: 100,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  cityText: {
    fontSize: 16,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 12,
  },
  recentlyAdded: {
    flexDirection: 'row',
  },
  recentImageWrapper: {
    marginRight: 8,
  },
  recentImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
    backgroundColor: '#ccc',
  },
  recentlyAddedList: {
    paddingVertical: 16,
  },
  card: {
    backgroundColor: '#333',
    borderRadius: 10,
    width: 160,
    marginRight: 16,
    overflow: 'hidden',
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
    color: '#fff',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#bbb',
  },
});

export default FavoriteScreen;
