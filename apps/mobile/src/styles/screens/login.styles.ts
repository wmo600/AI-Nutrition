import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../theme';

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: spacing['2xl'],
    paddingTop: 64,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: spacing.sm,
    color: colors.gray[900],
  },
  subtitle: {
    color: colors.gray[500],
    marginBottom: spacing['3xl'],
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: spacing.sm,
  },
  inputContainer: {
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.gray[900],
  },
  signInButton: {
    backgroundColor: colors.brand.DEFAULT,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  signInText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray[200],
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.gray[400],
    fontSize: 12,
  },
  googleButton: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.gray[200],
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  googleIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  googleText: {
    fontWeight: '500',
    fontSize: 16,
    color: colors.gray[900],
  },
  guestText: {
    textAlign: 'center',
    color: colors.gray[500],
    fontSize: 16,
  },
});
