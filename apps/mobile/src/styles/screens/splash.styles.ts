import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../theme';

export const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brand.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['3xl'],
  },
  logoContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius['3xl'],
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['3xl'],
    ...shadows.lg,
  },
  logoIcon: {
    fontSize: 48,
  },
  appName: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.white,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: spacing['4xl'],
    fontSize: 16,
  },
  getStartedButton: {
    backgroundColor: colors.white,
    borderRadius: borderRadius['2xl'],
    paddingHorizontal: spacing['4xl'],
    paddingVertical: spacing.md,
  },
  getStartedText: {
    color: colors.brand.DEFAULT,
    fontWeight: '600',
    fontSize: 16,
  },
});
