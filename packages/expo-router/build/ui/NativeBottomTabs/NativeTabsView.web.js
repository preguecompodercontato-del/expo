"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeTabsView = NativeTabsView;
const radix_ui_1 = require("radix-ui");
const react_1 = __importDefault(require("react"));
const TabInfoContext_1 = require("./TabInfoContext");
function NativeTabsView(props) {
    const { builder } = props;
    const { state, descriptors, navigation } = builder;
    const { routes } = state;
    const items = routes
        .filter(({ key }) => !descriptors[key].options.hidden)
        .map((route, index) => (<TabItem key={route.key} isFocused={state.index === index} title={descriptors[route.key].options.title || route.name} onPress={() => {
            navigation.dispatch({
                type: 'JUMP_TO',
                target: state.key,
                payload: {
                    name: route.name,
                },
            });
        }}/>));
    const children = routes
        .filter(({ key }, index) => !descriptors[key].options.hidden && state.index === index)
        .map((route, index) => {
        return (<TabInfoContext_1.TabInfoContext value={{ tabKey: route.key }} key={route.key}>
          <div style={{
                flex: 1,
                display: 'flex',
            }}>
            {descriptors[route.key].render()}
          </div>
        </TabInfoContext_1.TabInfoContext>);
    });
    return (<div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
        }}>
      <radix_ui_1.NavigationMenu.Root style={{
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            position: 'fixed',
            zIndex: 10,
        }}>
        <radix_ui_1.NavigationMenu.List style={{
            display: 'flex',
            backgroundColor: '#272727',
            height: 40,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
            boxSizing: 'border-box',
            margin: 0,
        }}>
          {items}
        </radix_ui_1.NavigationMenu.List>
      </radix_ui_1.NavigationMenu.Root>
      <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 0,
            overflowY: 'auto',
        }}>
        {children}
      </div>
    </div>);
}
function TabItem(props) {
    const { isFocused, title, onPress } = props;
    const [isHovered, setIsHovered] = react_1.default.useState(false);
    return (<radix_ui_1.NavigationMenu.Item style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            listStylePosition: 'inside',
            height: '100%',
        }}>
      <radix_ui_1.NavigationMenu.Trigger onClick={onPress} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style={{
            backgroundColor: isFocused ? '#444444' : 'transparent',
            color: isFocused ? 'white' : isHovered ? '#666666' : '#8b8b8b',
            fontWeight: 500,
            border: 'none',
            margin: 0,
            height: '100%',
            borderRadius: 20,
            padding: '0 20px',
            cursor: 'pointer',
            fontSize: 15,
            outlineColor: '#444444',
        }}>
        {title}
      </radix_ui_1.NavigationMenu.Trigger>
    </radix_ui_1.NavigationMenu.Item>);
}
//# sourceMappingURL=NativeTabsView.web.js.map