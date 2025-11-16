import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../theme';

export const preferencesStyles = StyleSheet.create({
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.sm,
    color: colors.gray[900],
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing['2xl'],
  },
  tag: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.gray[300],
    marginBottom: spacing.sm,
    marginRight: spacing.sm,
    backgroundColor: colors.white,
  },
  tagActive: {
    backgroundColor: colors.brand.DEFAULT,
    borderColor: colors.brand.DEFAULT,
  },
  tagText: {
    color: colors.gray[800],
    fontSize: 14,
  },
  tagTextActive: {
    color: colors.white,
    fontWeight: '500',
  },
  continueButton: {
    borderRadius: borderRadius['2xl'],
    paddingVertical: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.brand.DEFAULT,
    marginTop: spacing['4xl'],
    marginBottom: spacing['4xl'],
  },
  continueText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
});
