import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "./src/components/Button";
import { styles } from "./App.styles";
import { Platform } from "react-native";
import { currencies } from "./src/constants/currencies";
import { Input } from "./src/components/Input";
import { ResultCard } from "./src/components/ResultCard";
import { exchangeRateApi } from "./src/services/api";
import { useState } from "react";
import { convertCurrency } from "./src/utils/ConvertCurrency";

export default function App() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("BRL");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(null);

  async function fetchExchangeRate(fromCurrency) {
    try {
      setLoading(true);
      if (!amount) return;

      const data = await exchangeRateApi(fromCurrency);
      const rate = data.rates[toCurrency];
      setExchangeRate(rate);
      const convertedAmount = convertCurrency(amount, rate);
      setResult(convertedAmount);
    } catch (error) {
      alert("Erro ao buscar a taxa de câmbio. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function swapCurrencies() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult("");
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <StatusBar style="light" />

          <View style={styles.header}>
            <Text style={styles.title}>Conversor de Moedas</Text>
            <Text style={styles.subtitle}>
              Converta valores entre diferentes moedas
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>De:</Text>
            <View style={styles.currencyGrid}>
              {currencies.map((currency) => (
                <Button
                  variant="primary"
                  key={currency.code}
                  currency={currency}
                  onPress={() => setFromCurrency(currency.code)}
                  isSelected={fromCurrency === currency.code}
                ></Button>
              ))}
            </View>

            <Input label="Valor: " value={amount} onChangeText={setAmount} />

            <TouchableOpacity style={styles.switchButton} onPress={swapCurrencies}>
              <Text style={styles.switchButtonText}>↑↓</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Para:</Text>
            <View style={styles.currencyGrid}>
              {currencies.map((currency) => (
                <Button
                  variant="secondary"
                  key={currency.code}
                  currency={currency}
                  onPress={() => setToCurrency(currency.code)}
                  isSelected={toCurrency === currency.code}
                ></Button>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.convertButton,
              (!amount || loading) && styles.convertButtonDisabled,
            ]}
            onPress={() => fetchExchangeRate(fromCurrency)}
            disabled={!amount || loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.switchButtonText}>Converter</Text>
            )}
          </TouchableOpacity>

          <ResultCard
            exchangeRate={exchangeRate}
            result={result}
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            currencies={currencies}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
