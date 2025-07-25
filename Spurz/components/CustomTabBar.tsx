import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  
  const getIconConfig = (routeName: string) => {
    switch (routeName) {
      case 'index':
        return { 
          name: 'home-outline', 
          activeName: 'home'
        };
      case 'chat':
        return { 
          name: 'chatbubble-outline', 
          activeName: 'chatbubble'
        };
      case 'advert-feed':
        return { 
          name: 'megaphone-outline', 
          activeName: 'megaphone'
        };
      case 'dashboard':
        return { 
          name: 'grid-outline', 
          activeName: 'grid'
        };
      case 'profile':
        return { 
          name: 'person-outline', 
          activeName: 'person'
        };
      default:
        return { 
          name: 'home-outline', 
          activeName: 'home'
        };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const iconConfig = getIconConfig(route.name);
          const { name, activeName } = iconConfig;
          const iconName = isFocused ? activeName : name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={styles.tabButton}
            >
              <Ionicons
                name={iconName as any}
                size={24}
                color={isFocused ? '#FFA500' : '#666666'}
              />
              {isFocused && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    flex: 1,
  },
  activeIndicator: {
    width: 30,
    height: 3,
    backgroundColor: '#FFA500',
    borderRadius: 2,
    marginTop: 8,
  },
});
