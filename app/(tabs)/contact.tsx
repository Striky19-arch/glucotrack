import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { Stack } from 'expo-router';
import { Send, Phone, Mail, MapPin } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function ContactScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    message: false,
  });

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    
    // Clear error when typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [field]: false,
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {
      name: formData.name.trim() === '',
      email: !/\S+@\S+\.\S+/.test(formData.email),
      message: formData.message.trim() === '',
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  // Submit form
  const handleSubmit = () => {
    if (validateForm()) {
      // Here you would normally send the data to a server
      Alert.alert(
        'Message envoyé',
        'Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.',
        [{ text: 'OK' }]
      );
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } else {
      Alert.alert(
        'Formulaire incomplet',
        'Veuillez remplir tous les champs obligatoires.',
        [{ text: 'OK' }]
      );
    }
  };

  // Handle direct contact methods
  const handlePhone = () => {
    Linking.openURL('tel:+33123456789');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:contact@glucotrack.com');
  };

  const handleLocation = () => {
    Linking.openURL('https://maps.app.goo.gl/123456789');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Contact',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTitleStyle: {
            color: colors.text,
            fontWeight: '600',
          },
          headerShadowVisible: false,
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Nous contacter</Text>
        <Text style={styles.subtitle}>
          Notre équipe est à votre disposition pour répondre à toutes vos questions.
        </Text>

        <View style={styles.contactInfoContainer}>
          <TouchableOpacity style={styles.contactMethod} onPress={handlePhone}>
            <View style={styles.contactIcon}>
              <Phone size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.contactLabel}>Téléphone</Text>
              <Text style={styles.contactValue}>+33 1 23 45 67 89</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactMethod} onPress={handleEmail}>
            <View style={styles.contactIcon}>
              <Mail size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>contact@glucotrack.com</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactMethod} onPress={handleLocation}>
            <View style={styles.contactIcon}>
              <MapPin size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.contactLabel}>Adresse</Text>
              <Text style={styles.contactValue}>123 Avenue Santé, 75001 Paris</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.formTitle}>Envoyez-nous un message</Text>

        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nom <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, formErrors.name && styles.inputError]}
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
              placeholder="Votre nom"
              placeholderTextColor={colors.textLight}
            />
            {formErrors.name && (
              <Text style={styles.errorText}>Ce champ est obligatoire</Text>
            )}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, formErrors.email && styles.inputError]}
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              placeholder="Votre email"
              placeholderTextColor={colors.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {formErrors.email && (
              <Text style={styles.errorText}>Veuillez entrer un email valide</Text>
            )}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Sujet</Text>
            <TextInput
              style={styles.input}
              value={formData.subject}
              onChangeText={(text) => handleChange('subject', text)}
              placeholder="Sujet de votre message"
              placeholderTextColor={colors.textLight}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Message <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.textArea, formErrors.message && styles.inputError]}
              value={formData.message}
              onChangeText={(text) => handleChange('message', text)}
              placeholder="Votre message"
              placeholderTextColor={colors.textLight}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            {formErrors.message && (
              <Text style={styles.errorText}>Ce champ est obligatoire</Text>
            )}
          </View>
          
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Send size={20} color={colors.white} />
            <Text style={styles.submitButtonText}>Envoyer</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.supportHours}>
          <Text style={styles.supportTitle}>Heures d'assistance</Text>
          <Text style={styles.supportText}>Lundi au Vendredi: 9h - 18h</Text>
          <Text style={styles.supportText}>Samedi: 10h - 16h</Text>
          <Text style={styles.supportText}>Dimanche: Fermé</Text>
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
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  contactInfoContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  required: {
    color: colors.error,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    height: 120,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  supportHours: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  supportText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
});