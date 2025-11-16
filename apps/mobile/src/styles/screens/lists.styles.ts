import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../theme';

export const listsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: spacing['2xl'],
    paddingBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  backIcon: {
    fontSize: 24,
    color: colors.gray[900],
  },
  headerContent: {},
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
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing['2xl'],
    marginBottom: spacing['3xl'],
    gap: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  tabActive: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.brand.DEFAULT,
  },
  tabText: {
    fontSize: 14,
    color: colors.gray[600],
    fontWeight: '500',
  },
  tabTextActive: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  addIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  addIcon: {
    fontSize: 40,
    color: colors.gray[300],
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.gray[500],
  },
});
