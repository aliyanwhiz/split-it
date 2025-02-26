import { useState, useRef, useEffect } from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, FlatList, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useNavigationContainerRef } from '@react-navigation/native';

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
  const [usdToPkrRate, setUsdToPkrRate] = useState<number>(1);
  const inputRef = useRef<TextInput>(null);
  const navigation = useNavigation();
  const navigationRef = useNavigationContainerRef();
  const { dark } = useTheme();

  const expenditureCategories = [
        {
          id: 1,
          name: 'Charity',
          logo: require('@/assets/images/charity.png'),
          share: 20,
          furtherCategories: [
            { id: 1, name: 'MATW', logo: require('@/assets/images/matw.png'), share: 40 },
            { id: 2, name: 'Al-khidmat', logo: require('@/assets/images/Al-khidmat.png'), share: 5 },
            { id: 3, name: 'JDC', logo: require('@/assets/images/Jdc.png'), share: 5 },
            { id: 4, name: 'personal', logo: require('@/assets/images/sadqaa.png'), share: 50 },
          ],
        },
        {
          id: 2,
          name: 'Invest',
          logo: require('@/assets/images/invest.png'),
          share: 20,
          furtherCategories: [
            { id: 1, name: 'AHL', logo: require('@/assets/images/AHL.png'), share: 40 },
            { id: 2, name: 'AHMF', logo: require('@/assets/images/AHMF.png'), share: 30 },
            { id: 3, name: 'AMMF', logo: require('@/assets/images/AMMF.png'), share: 30 },
          ],
        },
        {
          id: 3,
          name: 'Personal',
          logo: require('@/assets/images/personal.png'),
          share: 20,
          furtherCategories: [
            { id: 1, name: 'Me', logo: require('@/assets/images/me.png'), share: 50 },
            { id: 2, name: 'Api', logo: require('@/assets/images/sister.png'), share: 50 },
          ],
        },
        {
          id: 4,
          name: 'Home',
          logo: require('@/assets/images/home.png'),
          share: 20,
          furtherCategories: [
            { id: 1, name: 'Baba', logo: require('@/assets/images/baba.png'), share: 70 },
            { id: 2, name: 'bhai', logo: require('@/assets/images/brother.png'), share: 30 },
          ],
        },
        {
          id: 5,
          name: 'Savings',
          logo: require('@/assets/images/jar.png'),
          share: 20,
          furtherCategories: [
            { id: 1, name: 'short term', logo: require('@/assets/images/saving.png'), share: 50 },
            { id: 2, name: 'Hajj', logo: require('@/assets/images/kaaba.png'), share: 50 },
          ],
        },
      ];

  useEffect(() => {
    fetchUsdToPkrRate();
  }, []);

  useEffect(() => {
    if (navigationRef.isReady()) {
      navigationRef.navigate('LoginScreen');
    }
  }, []);

  // Fetch current USD to PKR conversion rate
  const fetchUsdToPkrRate = async () => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      setUsdToPkrRate(data.rates.PKR);
    } catch (error) {
      console.error('Error fetching USD to PKR rate:', error);
    }
  };

  const calculateMainCategoryAmount = (share: number): string => {
    const amount = Math.floor(parseFloat(totalAmount));
    return isNaN(amount) ? '0' : Math.floor((amount * share) / 100).toString();
  };

  const calculateSubcategoryAmount = (mainAmount: number, subCategoryShare: number): string => {
    return Math.floor((mainAmount * subCategoryShare) / 100).toString();
  };

  const handleTilePress = (category: Category) => {
    setSelectedCategory(category);
  };

  const focusInputField = () => {
    if (inputRef.current) {
      inputRef.current.blur();
      setTotalAmount('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const HandleLogout = () => {
    navigation.replace('LoginScreen');
  };


  const calculateMATWAmount = () => {
    const charityCategory = expenditureCategories.find(category => category.name === 'Charity');
    const matwCategory = charityCategory?.furtherCategories?.find(sub => sub.name === 'MATW');

    if (charityCategory && matwCategory) {
      const mainCategoryAmount = parseInt(calculateMainCategoryAmount(charityCategory.share));
      const matwAmount = parseInt(calculateSubcategoryAmount(mainCategoryAmount, matwCategory.share));

      // Subtract 7% from MATW amount and convert to USD
      const subtractedAmount = Math.floor(matwAmount * 0.07);
      const remainingAmount = matwAmount - subtractedAmount;
      const usdAmount = Math.floor(remainingAmount / usdToPkrRate);
      return `Rs. ${matwAmount} \n $${usdAmount} ~ ${subtractedAmount}`;
    }
    return 'N/A';
  };

  const calculatePersonalAmount = (mainCategoryAmount: number, share: number) => {
    const initialAmount = parseInt(calculateSubcategoryAmount(mainCategoryAmount, share));
    const amountAfterSubtraction = initialAmount - 25;
    return `Rs. ${initialAmount} \n ${amountAfterSubtraction} ~ 25`;
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: dark ? '#222' : '#E9E9E9' }]}>     
      <View style={styles.navbar}>
        <View style={styles.navbarLogo}>          
          <Image source={require('@/assets/images/cash.png')} style={styles.navbarLogoImg} />
          <ThemedText style={styles.navbarText}>Expenditures</ThemedText>
        </View>
        <View>
          <TouchableOpacity onPress={() => HandleLogout()}
          >
          <MaterialIcons name="logout" size={24} color={'#E9E9E9'} />
        </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        <FlatList
          data={expenditureCategories}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={(
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
          )}
          renderItem={({ item }) => {
            const mainCategoryAmount = calculateMainCategoryAmount(item.share);
            return (
              <TouchableOpacity onPress={() => handleTilePress(item)} style={styles.tile}>
                <Image source={item.logo} style={styles.categoryLogo} />
                <View style={styles.tileContent} key={item.id}>
                  <ThemedText style={styles.categoryName}>{item.name}</ThemedText>
                  <ThemedText style={styles.percentageText}>{item.share}%</ThemedText>
                  <ThemedText style={styles.amountText}>Rs. {mainCategoryAmount}</ThemedText>
                </View>
              </TouchableOpacity>
            );
          }}
        />

        {selectedCategory && selectedCategory.furtherCategories && (
          <FlatList
            data={selectedCategory.furtherCategories}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            style={styles.horizontalList}
            contentContainerStyle={styles.centeredList}
            renderItem={({ item }) => {
              const mainCategoryAmount = calculateMainCategoryAmount(selectedCategory.share);
              let displayAmount;
              if (item.name === 'MATW') {
                displayAmount = calculateMATWAmount();
              } else if (item.name === 'personal') {
                displayAmount = calculatePersonalAmount(parseInt(mainCategoryAmount), item.share);
              } else {
                displayAmount = `Rs. ${calculateSubcategoryAmount(parseInt(mainCategoryAmount), item.share)}`;
              }
              return (
                <View style={styles.horizontalTile}>
                  <Image source={item.logo} style={styles.categoryLogo} />
                  <ThemedText style={styles.categoryName}>{item.name}</ThemedText>
                  <ThemedText style={styles.percentageText}>{item.share}%</ThemedText>
                  <ThemedText style={styles.amountText}>{displayAmount}</ThemedText>
                </View>
              );
            }}
          />
        )}
      </ScrollView>

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
    //marginTop: 40,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#143D60',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  navbarLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navbarLogoImg: {
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
