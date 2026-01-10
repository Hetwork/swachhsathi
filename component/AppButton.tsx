import { colors } from '@/utils/colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';

interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  style?: ViewStyle;
  textStyle?: any;
}

const AppButton: React.FC<AppButtonProps> = ({ title, style, textStyle, ...props }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} {...props}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default AppButton;
