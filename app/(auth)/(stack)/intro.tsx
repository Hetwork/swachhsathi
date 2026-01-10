
import AppButton from '@/component/AppButton';
import Container from '@/component/Container';
import { colors } from '@/utils/colors';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Dimensions, Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PAGES = [
  {
    image: require('../../../assets/appimages/ob-1-bg.png'),
    title: 'Spot Garbage Easily',
    description: 'Click photos of garbage around your area',
  },
  {
    image: require('../../../assets/appimages/ob-2-bg.png'),
    title: 'Auto Location Detection',
    description: 'Your report automatically includes your GPS Location',
  },
  {
    image: require('../../../assets/appimages/ob-3-bg.png'),
    title: 'Corporation Takes Actions',
    description: 'Your reports reach municipal workers instantly',
  },
];

export default function Intro() {
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);
  const insets = useSafeAreaInsets();

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const currentPage = Math.round(offsetX / SCREEN_WIDTH);
    setPage(currentPage);
  };

  const scrollToPage = (pageIndex: number) => {
    scrollRef.current?.scrollTo({ x: pageIndex * SCREEN_WIDTH, animated: true });
  };

  return (
    <Container bottom={1} top={1}>
      <ScrollView 
        ref={scrollRef}
        horizontal 
        pagingEnabled 
        style={styles.pagerView} 
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {PAGES.map((item, idx) => (
          <View key={idx} style={[styles.page, styles.fullWidth]}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dotsContainer}>
        {PAGES.map((_, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => scrollToPage(idx)}
            style={[styles.dot, page === idx && styles.activeDot]}
          />
        ))}
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom}]}> 
        <AppButton title='Get Started' onPress={()=>router.push('/(auth)/(stack)/login')} />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({

  pagerView: {
    flex: 1,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background || '#E3F2FD',
    paddingHorizontal: 20,
  },
  fullWidth: {
    width: SCREEN_WIDTH,
  },
  image: {
    height: 220,
    width: 220,
    marginTop: 40,
    marginBottom: 10,
    borderRadius: 24,
    backgroundColor: colors.white || '#fff',
  },
  textContainer: {
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    color: colors.textPrimary,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
    marginHorizontal: 5,
    opacity: 0.4,
  },
  activeDot: {
    backgroundColor: colors.primary,
    opacity: 1,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
    backgroundColor: colors.white,
  },
  getStartedButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  getStartedButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});