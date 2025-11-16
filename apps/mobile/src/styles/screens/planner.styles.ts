import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../theme';

export const plannerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingTop: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing['2xl'],
    marginBottom: spacing.lg,
  },
  backIcon: {
    fontSize: 24,
    color: colors.gray[900],
  },
  header: {
    paddingHorizontal: spacing['2xl'],
    marginBottom: spacing['2xl'],
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray[500],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
    paddingHorizontal: spacing['2xl'],
    color: colors.gray[900],
  },
  mealTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing['2xl'],
  },
  mealTypeButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  mealTypeButtonLeft: {
    marginRight: spacing.sm,
    width: '48%',
  },
  mealTypeButtonRight: {
    marginLeft: spacing.sm,
    width: '48%',
  },
  mealTypeText: {
    fontSize: 16,
    color: colors.gray[900],
    textAlign: 'center',
    fontWeight: '500',
  },
  customItemContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing['2xl'],
    marginBottom: spacing['2xl'],
    alignItems: 'center',
  },
  customItemInput: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.gray[900],
    marginRight: spacing.md,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.brand.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  addButtonText: {
    fontSize: 24,
    color: colors.white,
    fontWeight: '600',
  },
  tipsCard: {
    backgroundColor: colors.blue[50],
    borderRadius: borderRadius['2xl'],
    padding: spacing.lg,
    marginHorizontal: spacing['2xl'],
    marginBottom: spacing['3xl'],
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tipsIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[900],
  },
  tipText: {
    fontSize: 13,
    color: colors.gray[700],
    marginBottom: 4,
  },
  generateButton: {
    backgroundColor: colors.brand.light,
    borderRadius: borderRadius['2xl'],
    paddingVertical: spacing.lg,
    marginHorizontal: spacing['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  generateIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  generateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  spacer: {
    height: spacing['3xl'],
  },
});
