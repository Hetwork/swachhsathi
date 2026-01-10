import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

const AppTextInput: React.FC<TextInputProps> = (props) => {
  const [show, setShow] = useState(false);
  const isPassword = props.secureTextEntry;
  const { secureTextEntry, ...restProps } = props;
  
  return (
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.textSecondary}
        {...restProps}
        secureTextEntry={isPassword && !show}
      />
      {isPassword && (
        <TouchableOpacity style={styles.eyeIcon} onPress={() => setShow(s => !s)}>
          <Ionicons 
            name={show ? 'eye-outline' : 'eye-off-outline'} 
            size={22} 
            color={colors.textSecondary} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    position: 'relative',
    width: '100%',
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    paddingRight: 40,
    backgroundColor: colors.white,
    fontSize: 16,
    color: colors.textPrimary,
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 0,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppTextInput;
