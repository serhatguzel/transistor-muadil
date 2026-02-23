// Asset paths
export const ASSETS = {
  DATA_FILE: require('./data/crossref.txt'),
  APP_ICON: require('./assets/logo.jpg'),
};

// API URLs
export const URLS = {
  DATASHEET_ARCHIVE_BASE: 'https://www.datasheetarchive.com',
  getDatasheetUrl: (partNumber) =>
    `${URLS.DATASHEET_ARCHIVE_BASE}/${encodeURIComponent(partNumber.trim())}-datasheet.html`,
  GITHUB_PROFILE: 'https://github.com/serhatguzel',
};

// App Version
export const APP_VERSION = '1.0.0';

// UI Constants
export const UI = {
  // Search limits
  DEFAULT_RESULTS_LIMIT: 20,
  SEARCH_RESULTS_LIMIT: 50,
};

// Colors
export const COLORS = {
  PRIMARY: '#2d6cdf',
  BACKGROUND: '#f4f6fb',
  SURFACE: '#fff',
  TEXT_PRIMARY: '#1f2937',
  TEXT_SECONDARY: '#4b5563',
  TEXT_MUTED: '#6b7280',
  BORDER: '#e5e7eb',
  BORDER_LIGHT: '#d1d5db',
  ERROR: '#b91c1c',
  HIGHLIGHT_BG: '#e0f2fe',
  HIGHLIGHT_BORDER: '#bae6fd',
  PLACEHOLDER: '#8c93a3',
  BUTTON_SECONDARY_BG: '#e5e7eb',
  BUTTON_SECONDARY_TEXT: '#374151',
};

// Spacing
export const SPACING = {
  CONTAINER_HORIZONTAL: 20,
  CONTAINER_TOP: 20,
  HEADER_MARGIN_BOTTOM: 24,
  HEADER_GAP: 16,
  HEADER_PADDING_LEFT: 4,
  SEARCH_ROW_MARGIN_BOTTOM: 16,
  SEARCH_ROW_GAP: 12,
  SEARCH_ROW_PADDING_HORIZONTAL: 4,
  INPUT_PADDING_HORIZONTAL: 16,
  INPUT_PADDING_VERTICAL: 14,
  BUTTON_PADDING_VERTICAL: 12,
  BUTTON_PADDING_HORIZONTAL: 16,
  CARD_PADDING: 18,
  CARD_MARGIN_BOTTOM: 14,
  CARD_HEADER_GAP: 16,
  HIGHLIGHT_PADDING: 16,
  HIGHLIGHT_MARGIN_BOTTOM: 12,
  LIST_CONTENT_PADDING_BOTTOM: 32,
  LIST_CONTENT_PADDING_HORIZONTAL: 4,
  MODAL_HEADER_PADDING_HORIZONTAL: 20,
  MODAL_HEADER_PADDING_VERTICAL: 16,
};

// Sizes
export const SIZES = {
  LOGO_WIDTH: 64,
  LOGO_HEIGHT: 64,
  LOGO_BORDER_RADIUS: 12,
  BUTTON_MIN_WIDTH: 100,
  CLOSE_BUTTON_SIZE: 32,
  CLOSE_BUTTON_BORDER_RADIUS: 16,
  BORDER_RADIUS_SMALL: 8,
  BORDER_RADIUS_MEDIUM: 10,
  BORDER_RADIUS_LARGE: 12,
};

// Typography
export const TYPOGRAPHY = {
  TITLE_SIZE: 22,
  PART_SIZE: 18,
  LABEL_SIZE: 12,
  VALUE_SIZE: 14,
  BUTTON_LABEL_SIZE: 12,
  MODAL_TITLE_SIZE: 18,
  CLOSE_BUTTON_SIZE: 18,
  LOADING_TEXT_SIZE: 14,
  PLACEHOLDER_TITLE_SIZE: 18,
  PLACEHOLDER_TEXT_SIZE: 14,
  OPEN_BUTTON_TEXT_SIZE: 16,
};

// WebView Settings
export const WEBVIEW = {
  ZOOM_INITIAL_SCALE: 0.5,
  ZOOM_MAX_SCALE: 5.0,
  BODY_PADDING: '20px',
};

// JavaScript injection for mobile zoom
export const getZoomOutScript = () => {
  return `
    (function() {
      function setZoom() {
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
          viewport = document.createElement('meta');
          viewport.name = 'viewport';
          document.head.appendChild(viewport);
        }
        viewport.content = 'width=device-width, initial-scale=${WEBVIEW.ZOOM_INITIAL_SCALE}, maximum-scale=${WEBVIEW.ZOOM_MAX_SCALE}, user-scalable=yes';
        document.body.style.padding = '${WEBVIEW.BODY_PADDING}';
      }
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setZoom);
      } else {
        setZoom();
      }
      
      setTimeout(setZoom, 500);
      setTimeout(setZoom, 1000);
    })();
    true;
  `;
};
