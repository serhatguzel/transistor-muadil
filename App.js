import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
// SDK 54: readAsStringAsync artık legacy API'de, bu yüzden buradan import ediyoruz.
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';
import {
  ASSETS,
  URLS,
  UI,
  COLORS,
  getZoomOutScript,
} from './constants';
import { styles } from './styles/styles';
import AboutModal from './components/AboutModal';
import { getTranslations } from './locales';

// Web için datasheet açma component (iframe çalışmadığı için yeni sekmede açıyoruz)
const WebDatasheetComponent = ({ url, partNumber, t }) => {
  const [opened, setOpened] = useState(false);
  
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && !opened) {
      // Otomatik olarak yeni sekmede aç
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        setOpened(true);
      }
    }
  }, [url, opened]);
  
  if (Platform.OS !== 'web') return null;
  
  return (
    <View style={styles.webviewPlaceholder}>
      <Text style={styles.placeholderTitle}>
        {t.DATASHEET_LABEL}: {partNumber}
      </Text>
      <Text style={styles.placeholderText}>
        {t.WEB_DATASHEET_OPENED}
      </Text>
      <Text style={styles.placeholderText}>
        {t.WEB_POPUP_WARNING}
      </Text>
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => {
          if (Platform.OS === 'web' && typeof window !== 'undefined') {
            window.open(url, '_blank');
          }
        }}
      >
        <Text style={styles.openButtonText}>{t.WEB_OPEN_AGAIN}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function App() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false);
  const [locale, setLocale] = useState(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_locale');
      return saved || 'tr';
    }
    return 'tr';
  });

  const t = getTranslations(locale);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      localStorage.setItem('app_locale', locale);
    }
  }, [locale]);

  // Dropdown dışına tıklandığında kapat (sadece web için)
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && languageDropdownVisible) {
      const handleClickOutside = (event) => {
        const target = event.target;
        const container = document.querySelector('[data-language-select]');
        if (container && !container.contains(target)) {
          setLanguageDropdownVisible(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [languageDropdownVisible]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const content =
          Platform.OS === 'web'
            ? await fetch(ASSETS.DATA_FILE).then((res) => res.text())
            : await (async () => {
                const asset = Asset.fromModule(ASSETS.DATA_FILE);
                await asset.downloadAsync();
                const filePath = asset.localUri || asset.uri;
                return FileSystem.readAsStringAsync(filePath);
              })();

        const lines = content
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean);

        const rows = lines.map((line) => {
          const parts = line.split(/\s+/);
          const part = parts[0] || '';
          const equivalents = parts.slice(1).filter(Boolean);
          return {
            part,
            equivalents,
            notes: '',
          };
        });

        setData(rows);
      } catch (err) {
        setError('error');
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filtered = useMemo(() => {
    if (!query) return data.slice(0, UI.DEFAULT_RESULTS_LIMIT);
    const q = query.toLowerCase();
    return data
      .filter(
        (row) =>
          row.part.toLowerCase().includes(q) ||
          row.equivalents.some((p) => p.toLowerCase().includes(q)),
      )
      .slice(0, UI.SEARCH_RESULTS_LIMIT);
  }, [data, query]);

  const exactMatch = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return data.find((row) => row.part.toLowerCase() === q) || null;
  }, [data, query]);


  const openDatasheet = (partNumber) => {
    setSelectedPart(partNumber);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.muted}>{t.LOADING_MESSAGE}</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.error}>{t.ERROR_MESSAGE}</Text>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardContent}>
            <Text style={styles.part}>{item.part}</Text>
            <Text style={styles.label}>{t.EQUIVALENTS_LABEL}</Text>
            <Text style={styles.value}>{item.equivalents.join(', ') || '—'}</Text>
          </View>
          <TouchableOpacity
            style={styles.datasheetButton}
            onPress={() => openDatasheet(item.part)}
          >
            <Text style={styles.datasheetButtonLabel}>{t.DETAIL_SHOW_BUTTON}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.navbar}>
        <View style={styles.header}>
          <Image source={ASSETS.APP_ICON} style={styles.logo} />
          <View style={styles.headerText}>
            <Text style={styles.title}>{t.APP_TITLE}</Text>
            <Text style={styles.subtitle}>{t.APP_SUBTITLE}</Text>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.languageSelectContainer} data-language-select>
              <Pressable
                style={({ pressed, hovered }) => [
                  styles.languageButton,
                  (pressed || hovered) && styles.languageButtonPressed,
                ]}
                onPress={() => setLanguageDropdownVisible(!languageDropdownVisible)}
              >
                <Text style={styles.languageButtonText}>
                  {locale === 'tr' ? '🇹🇷' : locale === 'en' ? '🇬🇧' : '🇪🇸'}
                </Text>
                <Text style={styles.languageDropdownArrow}>
                  {languageDropdownVisible ? '▲' : '▼'}
                </Text>
              </Pressable>
              {languageDropdownVisible && (
                <View style={styles.languageDropdown}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.languageDropdownOption,
                      locale === 'tr' && styles.languageDropdownOptionSelected,
                      pressed && styles.languageDropdownOptionPressed,
                    ]}
                    onPress={() => {
                      setLocale('tr');
                      setLanguageDropdownVisible(false);
                    }}
                  >
                    <Text style={styles.languageDropdownOptionFlag}>🇹🇷</Text>
                    <Text style={[
                      styles.languageDropdownOptionText,
                      locale === 'tr' && styles.languageDropdownOptionTextSelected,
                    ]}>
                      Türkçe
                    </Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.languageDropdownOption,
                      locale === 'en' && styles.languageDropdownOptionSelected,
                      pressed && styles.languageDropdownOptionPressed,
                    ]}
                    onPress={() => {
                      setLocale('en');
                      setLanguageDropdownVisible(false);
                    }}
                  >
                    <Text style={styles.languageDropdownOptionFlag}>🇬🇧</Text>
                    <Text style={[
                      styles.languageDropdownOptionText,
                      locale === 'en' && styles.languageDropdownOptionTextSelected,
                    ]}>
                      English
                    </Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.languageDropdownOption,
                      locale === 'es' && styles.languageDropdownOptionSelected,
                      pressed && styles.languageDropdownOptionPressed,
                    ]}
                    onPress={() => {
                      setLocale('es');
                      setLanguageDropdownVisible(false);
                    }}
                  >
                    <Text style={styles.languageDropdownOptionFlag}>🇪🇸</Text>
                    <Text style={[
                      styles.languageDropdownOptionText,
                      locale === 'es' && styles.languageDropdownOptionTextSelected,
                    ]}>
                      Español
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
            <Pressable
              style={({ pressed, hovered }) => [
                styles.navbarButton,
                (pressed || hovered) && styles.navbarButtonPressed,
              ]}
              onPress={() => setAboutModalVisible(true)}
            >
              <Text style={styles.navbarButtonText}>{t.ABOUT_BUTTON}</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          placeholder={t.SEARCH_PLACEHOLDER}
          placeholderTextColor={COLORS.PLACEHOLDER}
          value={query}
          onChangeText={setQuery}
          style={styles.input}
          autoCapitalize="characters"
          autoCorrect={false}
        />
        <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
          <Text style={styles.clearText}>{t.CLEAR_BUTTON}</Text>
        </TouchableOpacity>
      </View>

      {exactMatch ? (
        <View style={styles.highlight}>
          <Text style={styles.label}>{t.EXACT_MATCH_LABEL}</Text>
          <Text style={styles.part}>{exactMatch.part}</Text>
          <Text style={styles.value}>{exactMatch.equivalents.join(', ') || '—'}</Text>
        </View>
      ) : null}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.part}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.muted}>{t.NO_RESULTS_MESSAGE}</Text>
        }
        keyboardShouldPersistTaps="handled"
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {t.DATASHEET_LABEL}: {selectedPart}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {selectedPart && (
            <>
              {Platform.OS === 'web' ? (
                <WebDatasheetComponent
                  url={URLS.getDatasheetUrl(selectedPart)}
                  partNumber={selectedPart}
                  t={t}
                />
              ) : (
                <WebView
                  source={{
                    uri: URLS.getDatasheetUrl(selectedPart),
                  }}
                  style={styles.webview}
                  startInLoadingState={true}
                  scalesPageToFit={false}
                  showsVerticalScrollIndicator={true}
                  showsHorizontalScrollIndicator={false}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  allowsInlineMediaPlayback={true}
                  mediaPlaybackRequiresUserAction={false}
                  injectedJavaScript={getZoomOutScript()}
                  renderLoading={() => (
                    <View style={styles.webviewLoading}>
                      <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                      <Text style={styles.loadingText}>{t.DATASHEET_LOADING_MESSAGE}</Text>
                    </View>
                  )}
                  onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView error: ', nativeEvent);
                  }}
                />
              )}
            </>
          )}
        </SafeAreaView>
      </Modal>

      <AboutModal
        visible={aboutModalVisible}
        onClose={() => setAboutModalVisible(false)}
        locale={locale}
      />

    </SafeAreaView>
  );
}
