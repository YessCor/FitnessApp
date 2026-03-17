import { IconSymbol } from '@/components/ui/icon-symbol';
import type { AppPalette } from '@/constants/theme';
import { useAppTheme } from '@/hooks/ThemeContext';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabIconName = 'house.fill' | 'dumbbell.fill' | 'fork.knife' | 'chart.bar.fill';

const TAB_CONFIG: Record<string, { icon: TabIconName; label: string }> = {
  index:     { icon: 'house.fill',     label: 'Inicio'     },
  exercises: { icon: 'dumbbell.fill',  label: 'Ejercicios' },
  nutrition: { icon: 'fork.knife',     label: 'Nutrición'  },
  progress:  { icon: 'chart.bar.fill', label: 'Progreso'   },
};

// ── Animated Tab Item ──────────────────────────────────────────────────────
function TabItem({
  route,
  isFocused,
  palette,
  onPress,
  accessibilityLabel,
}: {
  route: { key: string; name: string };
  isFocused: boolean;
  palette: AppPalette;
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  const config    = TAB_CONFIG[route.name] ?? { icon: 'house.fill' as TabIconName, label: route.name };

  // Animate opacity of the label (fade in/out)
  const labelAnim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
  // Animate background opacity
  const bgAnim    = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(labelAnim, {
        toValue: isFocused ? 1 : 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }),
      Animated.spring(bgAnim, {
        toValue: isFocused ? 1 : 0,
        useNativeDriver: false,   // false because we animate backgroundColor
        tension: 80,
        friction: 10,
      }),
    ]).start();
  }, [isFocused]);

  const animBg = bgAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ['transparent', palette.primary],
  });

  const iconColor = isFocused ? '#FFFFFF' : palette.textMuted;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={s.tab}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View
        style={[
          s.pill,
          { backgroundColor: animBg },
        ]}
      >
        <IconSymbol name={config.icon} size={20} color={iconColor} />
        <Animated.Text
          style={[
            s.pillLabel,
            {
              opacity:   labelAnim,
              // Animate width from 0→auto by scaling X from 0→1
              transform: [{ scaleX: labelAnim }],
              // Prevent invisible text from taking up horizontal space when collapsed
              maxWidth: isFocused ? 100 : 0,
            },
          ]}
          numberOfLines={1}
        >
          {config.label}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ── Main Tab Bar ───────────────────────────────────────────────────────────
export default function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { palette } = useAppTheme();

  return (
    <View style={[s.outerWrapper, { backgroundColor: palette.bgDeep }]}>
      <View
        style={[
          s.bar,
          {
            backgroundColor: palette.bgCard,
            borderColor:     palette.borderLight,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused   = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type:             'tabPress',
              target:           route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabItem
              key={route.key}
              route={route}
              isFocused={isFocused}
              palette={palette}
              onPress={onPress}
              accessibilityLabel={options.tabBarAccessibilityLabel}
            />
          );
        })}
      </View>

      {/* iOS home indicator spacer */}
      <SafeAreaView style={{ backgroundColor: palette.bgDeep }} />
    </View>
  );
}

// ── Static Styles ──────────────────────────────────────────────────────────
const s = StyleSheet.create({
  outerWrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'android' ? 10 : 0,
  },
  bar: {
    flexDirection: 'row',
    borderRadius: 36,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 14,
    gap: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 28,
    overflow: 'hidden',
  },
  pillLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});
