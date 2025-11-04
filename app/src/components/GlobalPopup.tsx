import React, { useEffect, useMemo } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export type PopupType = 'info' | 'error' | 'success';

type Props = {
  visible: boolean;
  title?: string;
  message: string;
  type?: PopupType;
  onClose?: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
};

const GlobalPopup: React.FC<Props> = ({ visible, title, message, type = 'info', onClose, primaryLabel, secondaryLabel, onPrimary, onSecondary }) => {
  const accent = useMemo(() => {
    switch (type) {
      case 'error': return '#EF4444';
      case 'success': return '#10B981';
      default: return colors.accent;
    }
  }, [type]);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={[styles.iconCircle, { backgroundColor: accent }]}>
            <Text style={styles.iconText}>{type === 'error' ? '!' : type === 'success' ? '✓' : 'ℹ'}</Text>
          </View>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          <Text style={styles.message}>{message}</Text>
          {secondaryLabel ? (
            <View style={styles.btnRow}>
              <Pressable style={[styles.btn, styles.btnSecondary]} onPress={onSecondary || onClose}>
                <Text style={[styles.btnText, { color: colors.text }]}>{secondaryLabel}</Text>
              </Pressable>
              <Pressable style={[styles.btn, { backgroundColor: accent }]} onPress={onPrimary || onClose}>
                <Text style={styles.btnText}>{primaryLabel || 'OK'}</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={[styles.btn, { backgroundColor: accent }]} onPress={onPrimary || onClose}>
              <Text style={styles.btnText}>{primaryLabel || 'OK'}</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: {
    width: '100%', maxWidth: 360, borderRadius: 16, backgroundColor: 'white',
    paddingHorizontal: 18, paddingVertical: 16, alignItems: 'center',
    ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 14, shadowOffset: { width: 0, height: 6 } }, android: { elevation: 10 }, default: {} }),
  },
  iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  iconText: { color: 'white', fontWeight: '800', fontSize: 20 },
  title: { fontSize: 15, fontWeight: '800', color: colors.text, textAlign: 'center', marginTop: 4 },
  message: { fontSize: 13, color: '#4B5563', textAlign: 'center', marginTop: 6 },
  btn: { marginTop: 12, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 10 },
  btnText: { color: 'white', fontWeight: '700' },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btnSecondary: { backgroundColor: '#F3F4F6' },
});

export default GlobalPopup;
