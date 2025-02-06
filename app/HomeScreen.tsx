import { useState, useRef } from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, FlatList, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

interface Category {
  id: number;
  name: string;
  logo: any;
  share: number;
  furtherCategories?: Category[];
}

export default function HomeScreen() {
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const inputRef = useRef<TextInput>(null);
  const { dark } = useTheme();

  const expenditureCategories = [
    {
      id: 1,
      name: 'Charity',
      logo: require('@/assets/images/charity.png'),
      share: 20,
      furtherCategories: [
        { id: 1, name: 'Online', logo: require('@/assets/images/charity.png'), share: 40 },
        { id: 2, name: 'In-person', logo: require('@/assets/images/charity.png'), share: 30 },
        { id: 3, name: 'Volunteer', logo: require('@/assets/images/charity.png'), share: 30 },
      ],
    },
    {
      id: 2,
      name: 'Invest',
      logo: require('@/assets/images/investment.png'),
      share: 20,
      furtherCategories: [
        { id: 1, name: 'Stocks', logo: require('@/assets/images/investment.png'), share: 50 },
        { id: 2, name: 'Real Estate', logo: require('@/assets/images/investment.png'), share: 50 },
      ],
    },
    {
      id: 3,
      name: 'Personal',
      logo: require('@/assets/images/personal-wealth.png'),
      share: 20,
      furtherCategories: [
        { id: 1, name: 'Entertainment', logo: require('@/assets/images/personal-wealth.png'), share: 40 },
        { id: 2, name: 'Clothing', logo: require('@/assets/images/personal-wealth.png'), share: 60 },
      ],
    },
    {
      id: 4,
      name: 'Home',
      logo: require('@/assets/images/home.png'),
      share: 20,
      furtherCategories: [
        { id: 1, name: 'Rent', logo: require('@/assets/images/home.png'), share: 70 },
        { id: 2, name: 'Repairs', logo: require('@/assets/images/home.png'), share: 30 },
      ],
    },
    {
      id: 5,
      name: 'Savings',
      logo: require('@/assets/images/jar.png'),
      share: 20,
      furtherCategories: [
        { id: 1, name: 'Emergency Fund', logo: require('@/assets/images/jar.png'), share: 50 },
        { id: 2, name: 'Future Investments', logo: require('@/assets/images/jar.png'), share: 50 },
      ],
    },
  ];

  const calculateAmount = (share: number): string => {
    const amount = Math.floor(parseFloat(totalAmount));
    return isNaN(amount) ? '0' : Math.floor((amount * share) / 100).toString();
  };

  const handleTilePress = (category: Category) => {
    setSelectedCategory(category);
  };

  const focusInputField = () => {
    if (inputRef.current) {
      inputRef.current.blur(); // Ensure clean blur before re-focus
      setTotalAmount(''); // Clear the input field
      setTimeout(() => inputRef.current?.focus(), 100); // Slight delay for reliable focus
    }
  };
  

  return (
    <ThemedView style={[styles.container, { backgroundColor: dark ? '#222' : '#E9E9E9' }]}>     
      {/* Navbar */}
      <View style={styles.navbar}>
        <Image source={require('@/assets/images/cash.png')} style={styles.navbarLogo} />
        <ThemedText style={styles.navbarText}>Expenditures</ThemedText>
      </View>

      <ScrollView>
        {/* Amount Input */}
        <ThemedView style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Enter total amount"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={totalAmount}
            onChangeText={setTotalAmount}
          />
        </ThemedView>

        {/* Expenditure Tiles */}
        <FlatList
          data={expenditureCategories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleTilePress(item)} style={styles.tile}>
              <Image source={item.logo} style={styles.categoryLogo} />
              <View style={styles.tileContent}>
                <ThemedText style={styles.categoryName}>{item.name}</ThemedText>
                <ThemedText style={styles.percentageText}>{item.share}%</ThemedText>
                <ThemedText style={styles.amountText}>Rs. {calculateAmount(item.share)}</ThemedText>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Further Categories Section */}
        {selectedCategory && selectedCategory.furtherCategories && (
          <FlatList
            data={selectedCategory.furtherCategories}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            style={styles.horizontalList}
            contentContainerStyle={styles.centeredList}
            renderItem={({ item }) => (
              <View style={styles.horizontalTile}>
                <Image source={item.logo} style={styles.categoryLogo} />
                <ThemedText style={styles.categoryName}>{item.name}</ThemedText>
                <ThemedText style={styles.percentageText}>{item.share}%</ThemedText>
                <ThemedText style={styles.amountText}>Rs. {calculateAmount(item.share)}</ThemedText>
              </View>
            )}
          />
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: dark ? '#E9E9E9' : '#143D60' }]}
        onPress={focusInputField}
      >
        <MaterialIcons name="refresh" size={24} color={dark ? '#143D60' : '#E9E9E9'} />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#143D60',
    paddingVertical: 10,
    marginTop: 40,
    paddingHorizontal: 16,
  },
  navbarLogo: {
    width: 30,
    height: 30,
    marginRight: 12,
  },
  navbarText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    elevation: 1,
  },
  categoryLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  tileContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  percentageText: {
    fontSize: 14,
    color: '#666',
  },
  amountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  horizontalList: {
    marginVertical: 16,
  },
  centeredList: {
    justifyContent: 'center',
    flexGrow: 1,
  },
  horizontalTile: {
    width: 120,
    padding: 10,
    textAlign: 'center',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    borderRadius: 50,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});
