import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CirclePlus as PlusCircle, Settings, TrendingUp, Droplet, BadgeInfo, MessageSquare } from 'lucide-react-native';
import { BluetoothStatus } from '@/components/BluetoothStatus';
import { RecentReadingCard } from '@/components/RecentReadingCard';
import { colors } from '@/constants/colors';

export default function HomeScreen() {
  const router = useRouter();

  const navigateToScreen = (screen: string) => {
    router.push(screen);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>GlucoTrack</Text>
        <BluetoothStatus />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/7659564/pexels-photo-7659564.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            style={styles.welcomeImage}
          />
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>Bienvenue</Text>
            <Text style={styles.welcomeText}>
              Suivez votre taux de sucre et restez en bonne santé
            </Text>
            <TouchableOpacity 
              style={styles.addDeviceButton}
              onPress={() => navigateToScreen('/(tabs)/devices')}
            >
              <PlusCircle color={colors.white} size={16} />
              <Text style={styles.addDeviceText}>Ajouter un appareil</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Dernières mesures</Text>
        
        <RecentReadingCard 
          type="blood"
          value={95}
          unit="mg/dL"
          time="Aujourd'hui, 08:30"
          trend="stable"
        />
        
        <RecentReadingCard 
          type="urine"
          value={15}
          unit="mg/dL"
          time="Hier, 20:15"
          trend="down"
        />

        <Text style={styles.sectionTitle}>Accès rapide</Text>
        
        <View style={styles.quickAccessGrid}>
          <TouchableOpacity 
            style={styles.quickAccessItem}
            onPress={() => navigateToScreen('/(tabs)/readings')}
          >
            <Droplet color={colors.primary} size={24} />
            <Text style={styles.quickAccessText}>Mesurer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAccessItem}
            onPress={() => navigateToScreen('/(tabs)/tracking')}
          >
            <TrendingUp color={colors.primary} size={24} />
            <Text style={styles.quickAccessText}>Suivi</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAccessItem}
            onPress={() => navigateToScreen('/(tabs)/settings')}
          >
            <Settings color={colors.primary} size={24} />
            <Text style={styles.quickAccessText}>Paramètres</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAccessItem}
            onPress={() => navigateToScreen('/(tabs)/contact')}
          >
            <MessageSquare color={colors.primary} size={24} />
            <Text style={styles.quickAccessText}>Contact</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeImage: {
    width: '100%',
    height: 140,
  },
  welcomeContent: {
    padding: 16,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.text,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  addDeviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  addDeviceText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
    color: colors.text,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickAccessItem: {
    width: '48%',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickAccessText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    color: colors.textSecondary,
  },
});