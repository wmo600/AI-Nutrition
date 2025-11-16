import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../theme';

export const goalsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: 64,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.gray[900],
  },
  subtitle: {
    color: colors.gray[500],
    marginBottom: spacing['2xl'],
    fontSize: 16,
  },
  goalCard: {
    borderRadius: borderRadius['2xl'],
    borderWidth: 2,
    borderColor: colors.gray[200],
    marginBottom: spacing.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalCardActive: {
    backgroundColor: colors.green[50],
    borderColor: colors.brand.DEFAULT,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 28,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontWeight: '600',
    marginBottom: 4,
    color: colors.gray[900],
    fontSize: 16,
  },
  goalTitleActive: {
    color: colors.brand.dark,
  },
  goalDescription: {
    color: colors.gray[500],
    fontSize: 14,
  },
  continueButton: {
    marginTop: spacing['3xl'],
    borderRadius: borderRadius['2xl'],
    paddingVertical: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.brand.DEFAULT,
  },
  continueButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
  continueText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
});
