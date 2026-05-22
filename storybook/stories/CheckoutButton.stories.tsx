import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

// ─── Component ────────────────────────────────────────────────────────────────

interface CheckoutButtonProps {
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  label = 'Place Order',
  disabled = false,
  loading = false,
  onPress,
}) => (
  <TouchableOpacity
    testID="checkout-button"
    accessibilityRole="button"
    accessibilityLabel={label}
    accessibilityState={{ disabled }}
    style={[styles.button, disabled && styles.disabled]}
    onPress={onPress}
    disabled={disabled || loading}
  >
    <Text style={styles.label}>{loading ? 'Processing…' : label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#9e9e9e',
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

// ─── Stories ──────────────────────────────────────────────────────────────────

const meta: Meta<typeof CheckoutButton> = {
  title: 'Checkout/CheckoutButton',
  component: CheckoutButton,
  argTypes: {
    onPress: { action: 'pressed' },
  },
};

export default meta;
type Story = StoryObj<typeof CheckoutButton>;

export const Default: Story = {
  args: {
    label: 'Place Order',
    disabled: false,
    loading: false,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Place Order',
    disabled: true,
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    label: 'Place Order',
    disabled: false,
    loading: true,
  },
};

export const CustomLabel: Story = {
  args: {
    label: 'Complete Purchase',
    disabled: false,
    loading: false,
  },
};
