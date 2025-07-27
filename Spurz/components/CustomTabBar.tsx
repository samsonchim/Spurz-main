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
          name: 'grid-outline', 
          activeName: 'grid'
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
          name: 'stats-chart-outline', 
          activeName: 'stats-chart'
        };
      case 'profile':
        return { 
          name: 'person-outline', 
          activeName: 'person'
        };
      default:
        return { 
          name: 'grid-outline', 
          activeName: 'grid'
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
              style={[
                styles.tabButton,
                isFocused && styles.activeTabButton
              ]}
            >
              <View style={[
                styles.iconContainer,
                isFocused && styles.activeIconContainer
              ]}>
                <Ionicons
                  name={iconName as any}
                  size={22}
                  color={isFocused ? '#FFFFFF' : '#8E8E93'}
                />
              </View>
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
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    flex: 1,
  },
  activeTabButton: {
    transform: [{ translateY: -2 }],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  activeIconContainer: {
    backgroundColor: '#FFA500',
    shadowColor: '#FFA500',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
