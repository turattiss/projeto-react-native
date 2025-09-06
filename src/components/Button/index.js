import { styles } from "./styles";
import { Text, TouchableOpacity } from "react-native";
import { currencies } from "../../constants/currencies";

export function Button({ variant = "primary", onPress, currency, isSelected}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        isSelected && (variant === "primary" ? styles.buttonPrimary : styles.buttonSecondary),
      ]}
    >
      <Text style={styles.buttonText}>
        {currency.code}
      </Text>
    </TouchableOpacity>
  );
}
