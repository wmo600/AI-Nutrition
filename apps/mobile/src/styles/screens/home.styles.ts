import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../theme';

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing['2xl'],
    marginBottom: spacing.lg,
  },
  goalContainer: {
    flex: 1,
  },
  goalLabel: {
    fontSize: 12,
    color: colors.gray[400],
    marginBottom: 4,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  goalText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    fontSize: 20,
  },
  searchContainer: {
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginHorizontal: spacing['2xl'],
    marginBottom: spacing['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.gray[900],
  },
  tilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing['2xl'],
  },
  tile: {
    width: '50%',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.lg,
  },
  tileContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius['2xl'],
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  tileIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  tileIconText: {
    fontSize: 32,
  },
  tileTitle: {
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
    color: colors.gray[900],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
    paddingHorizontal: spacing['2xl'],
    color: colors.gray[900],
  },
  dealCard: {
    borderRadius: borderRadius['2xl'],
    padding: spacing.lg,
    marginHorizontal: spacing['2xl'],
    marginBottom: spacing.md,
  },
  greenDeal: {
    backgroundColor: colors.green[50],
  },
  blueDeal: {
    backgroundColor: colors.blue[50],
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: colors.gray[900],
  },
  dealStore: {
    fontSize: 14,
    color: colors.gray[600],
  },
  spacer: {
    height: spacing['3xl'],
  },
});
