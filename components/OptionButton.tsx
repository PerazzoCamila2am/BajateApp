import { Pressable, StyleSheet, Text } from 'react-native';

type OptionButtonProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  compact?: boolean;
};

export function OptionButton({
  label,
  selected,
  onPress,
  disabled = false,
  compact = false,
}: OptionButtonProps) {
  return (
    <Pressable
      style={[
        styles.button,
        compact && styles.compactButton,
        selected && styles.selectedButton,
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: '#223142',
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: 'center',
  },
  compactButton: {
    flex: 0,
    paddingHorizontal: 18,
  },
  selectedButton: {
    backgroundColor: '#5DE2A3',
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  selectedText: {
    color: '#101820',
  },
});