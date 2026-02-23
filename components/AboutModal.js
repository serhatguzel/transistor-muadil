import React from 'react';
import {
  Linking,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { URLS, APP_VERSION } from '../constants';
import { styles } from '../styles/styles';
import { getTranslations } from '../locales';

export default function AboutModal({ visible, onClose, locale = 'tr' }) {
  const t = getTranslations(locale);
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{t.ABOUT_TITLE}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.aboutContent}>
          <View style={styles.aboutSection}>
            <Text style={styles.aboutText}>{t.ABOUT_DESCRIPTION}</Text>
          </View>

          <View style={styles.aboutDeveloperSection}>
            <Text style={styles.aboutDeveloperLabel}>{t.ABOUT_VERSION_LABEL}</Text>
            <Text style={styles.aboutDeveloperName}>{APP_VERSION}</Text>
          </View>

          <View style={styles.aboutDeveloperSection}>
            <Text style={styles.aboutDeveloperLabel}>{t.ABOUT_DEVELOPER}</Text>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(URLS.GITHUB_PROFILE).catch((err) =>
                  console.error('GitHub profilini açarken hata oluştu:', err)
                );
              }}
            >
              <Text style={styles.aboutDeveloperName}>{t.ABOUT_DEVELOPER_NAME}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
