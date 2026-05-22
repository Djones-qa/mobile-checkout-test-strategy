import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

// ─── Component ────────────────────────────────────────────────────────────────

interface PaymentFormProps {
  showSaveCard?: boolean;
  error?: string | null;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  showSaveCard = true,
  error = null,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Details</Text>

      <TextInput
        testID="payment-card-number"
        accessibilityLabel="Card number"
        style={styles.input}
        placeholder="Card Number"
        keyboardType="numeric"
        maxLength={19}
        value={cardNumber}
        onChangeText={setCardNumber}
      />

      <View style={styles.row}>
        <TextInput
          testID="payment-card-expiry"
          accessibilityLabel="Expiry date"
          style={[styles.input, styles.halfInput]}
          placeholder="MM/YY"
          keyboardType="numeric"
          maxLength={5}
          value={expiry}
          onChangeText={setExpiry}
        />
        <TextInput
          testID="payment-card-cvv"
          accessibilityLabel="CVV"
          style={[styles.input, styles.halfInput]}
          placeholder="CVV"
          keyboardType="numeric"
          maxLength={4}
          secureTextEntry
          value={cvv}
          onChangeText={setCvv}
        />
      </View>

      <TextInput
        testID="payment-card-name"
        accessibilityLabel="Name on card"
        style={styles.input}
        placeholder="Name on Card"
        value={name}
        onChangeText={setName}
      />

      {error && (
        <Text testID="payment-error-message" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1a1a2e',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#333333',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  error: {
    color: '#d32f2f',
    fontSize: 14,
    marginTop: 4,
  },
});

// ─── Stories ──────────────────────────────────────────────────────────────────

const meta: Meta<typeof PaymentForm> = {
  title: 'Checkout/PaymentForm',
  component: PaymentForm,
};

export default meta;
type Story = StoryObj<typeof PaymentForm>;

export const Default: Story = {
  args: {
    showSaveCard: true,
    error: null,
  },
};

export const WithError: Story = {
  args: {
    showSaveCard: true,
    error: 'Your card was declined. Please try a different payment method.',
  },
};

export const WithoutSaveCard: Story = {
  args: {
    showSaveCard: false,
    error: null,
  },
};
