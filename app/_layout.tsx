import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

// Define the type for the props, specifying that 'children' is a ReactNode
type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Layout;
