import { Platform } from 'expo-modules-core';
import React from 'react';
import { BottomTabs, BottomTabsScreen, featureFlags } from 'react-native-screens';

// import { useBottomTabAccessory } from './NativeTabsViewContext';
import { TabInfoContext } from './TabInfoContext';
import type { NativeTabsViewProps } from './types';

const isControlledMode = Platform.OS === 'android';
featureFlags.experiment.controlledBottomTabs = isControlledMode;

export function NativeTabsView(props: NativeTabsViewProps) {
  const { builder, style } = props;
  const { state, descriptors, navigation } = builder;
  const { routes } = state;
  // const { bottomTabAccessory } = useBottomTabAccessory();

  // const focusedScreenKey = state.routes[state.index].key;

  const children = routes
    .filter(({ key }) => !descriptors[key].options.hidden)
    .map((route, index) => {
      const descriptor = descriptors[route.key];
      const isFocused = state.index === index;

      return (
        <TabInfoContext value={{ tabKey: route.key }} key={route.key}>
          <BottomTabsScreen
            {...descriptor.options}
            tabKey={route.key}
            isFocused={isFocused}
            onWillAppear={() => {
              console.log('On will appear', route.name);
              if (!isControlledMode) {
                navigation.dispatch({
                  type: 'JUMP_TO',
                  target: state.key,
                  payload: {
                    name: route.name,
                  },
                });
              }
            }}>
            {descriptor.render()}
          </BottomTabsScreen>
        </TabInfoContext>
      );
    });

  return (
    <BottomTabs
      tabBarItemTitleFontColor={style?.color}
      tabBarItemTitleFontFamily={style?.fontFamily}
      tabBarItemTitleFontSize={style?.fontSize}
      tabBarItemTitleFontWeight={style?.fontWeight}
      tabBarItemTitleFontStyle={style?.fontStyle}
      tabBarBackgroundColor={style?.backgroundColor}
      tabBarBlurEffect={style?.blurEffect}
      tabBarTintColor={style?.tintColor}
      tabBarItemBadgeBackgroundColor={style?.badgeBackgroundColor}
      onNativeFocusChange={({ nativeEvent: { tabKey } }) => {
        console.log('onNativeFocusChange', tabKey);
        if (isControlledMode) {
          const descriptor = descriptors[tabKey];
          const route = descriptor.route;
          navigation.dispatch({
            type: 'JUMP_TO',
            target: state.key,
            payload: {
              name: route.name,
            },
          });
        }
        // navigation.emit({ type: 'tabPress', target: tabKey });
      }}>
      {children}
      {/* {focusedTabAccessoryProps && (
        <BottomAccessory
          {...focusedTabAccessoryProps}
          onTabAccessoryEnvironmentChange={({ nativeEvent }) => {
            console.log('onTabAccessoryEnvironmentChange', nativeEvent);
          }}
        />
      )} */}
    </BottomTabs>
  );
}
