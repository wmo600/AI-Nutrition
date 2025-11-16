import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../theme';

export const storesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: spacing['2xl'],
    paddingBottom: spacing.lg,
    backgroundColor: colors.white,
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
  mapPlaceholder: {
    height: 200,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mapIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
    opacity: 0.3,
  },
  mapText: {
    fontSize: 16,
    color: colors.gray[400],
  },
  locationButton: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  locationIcon: {
    fontSize: 24,
  },
  storesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  storesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
  },
  filterText: {
    fontSize: 14,
    color: colors.brand.DEFAULT,
    fontWeight: '500',
  },
  storesList: {
    flex: 1,
  },
  storesContent: {
    paddingHorizontal: spacing['2xl'],
  },
  storeCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius['2xl'],
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 4,
  },
  storeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    fontSize: 12,
    color: colors.brand.DEFAULT,
    fontWeight: '500',
  },
  distance: {
    fontSize: 12,
    color: colors.gray[500],
    marginLeft: 4,
  },
  locationPinContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.green[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationPin: {
    fontSize: 20,
  },
  storeDetails: {
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
    width: 20,
  },
  detailText: {
    fontSize: 13,
    color: colors.gray[600],
  },
  storeActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    color: colors.gray[700],
    fontWeight: '500',
  },
  shopButton: {
    flex: 1,
    backgroundColor: colors.brand.DEFAULT,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  shopButtonText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
  },
});
