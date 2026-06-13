import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

type CardProps = {
    children: ReactNode;
};

export function Card({ children }: CardProps) {
   return <View style={styles.card}>{children}</View>; 
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#17212B',
        borderRadius: 22,
        padding: 16,
        borderWidth: 1,
        borderColor: '#263544',
    },
});