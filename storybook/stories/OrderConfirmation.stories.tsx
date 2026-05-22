import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

// ─── Component ────────────────────────────────────────────────────────────────

interface OrderConfirmationProps {
  orderNumber?: string;
  email?: string;
  estimatedDelivery?: string;
  total?: string;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  orderNumber = 'ORD-2024-001234',
  email = 'customer@example.com',
  estimatedDelivery = 'May 27 – May 29',
  total = '$89.99',
}) => (
  <View testID="order-confirmation-screen" style={styles.container}>
    <Text style={styles.checkmark}>✓</Text>
    <Text style={styles.title}>Order Confirmed</Text>
    <Text style={styles.subtitle}>Thank you for your purchase</Text>

    <View style={styles.card}>
      <Row label="Order Number" value={orderNumber} testID="order-number" />
      <Row label="Confirmation sent to" value={email} />
      <Row label="Estimated Delivery" value={estimatedDelivery} />
      <Row label="Total Charged" value={total} bold />
    </View>
  </View>
);

const Row: React.FC<{
  label: string;
  value: string;
  bold?: boolean;
  testID?: string;
}> = ({ label, value, bold = false, testID }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text testID={testID} style={[styles.value, bold && styles.bold]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  checkmark: {
    fontSize: 64,
    color: '#2e7d32',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#666666',
  },
  value: {
    fontSize: 14,
    color: '#333333',
  },
  bold: {
    fontWeight: '700',
    color: '#1a1a2e',
  },
});

// ─── Stories ──────────────────────────────────────────────────────────────────

const meta: Meta<typeof OrderConfirmation> = {
  title: 'Checkout/OrderConfirmation',
  component: OrderConfirmation,
};

export default meta;
type Story = StoryObj<typeof OrderConfirmation>;

export const Default: Story = {
  args: {
    orderNumber: 'ORD-2024-001234',
    email: 'customer@example.com',
    estimatedDelivery: 'May 27 – May 29',
    total: '$89.99',
  },
};

export const ExpressDelivery: Story = {
  args: {
    orderNumber: 'ORD-2024-001235',
    email: 'express@example.com',
    estimatedDelivery: 'May 23 (Tomorrow)',
    total: '$124.98',
  },
};

export const LargeOrder: Story = {
  args: {
    orderNumber: 'ORD-2024-001236',
    email: 'bulk@example.com',
    estimatedDelivery: 'May 28 – June 1',
    total: '$1,249.95',
  },
};
