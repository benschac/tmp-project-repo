# Prerequisite
First install the dependencies running `yarn install`, then make sure to build the package using `yarn build` and add the package as a dependency to the package/app you want to consume it from (could be the `app` or `ui` package) like so:
```
"dependencies": {
  "@tamagui-google-fonts/playfair-display": "*"
}
```
## Usage
### Expo
  
Add this to the root of your file:
    
```ts
import { useFonts } from 'expo-font'

export default function App() {
  const [loaded] = useFonts({
    PlayfairDisplay: require('@tamagui-google-fonts/playfair-display/fonts/static/PlayfairDisplay-Regular.ttf'),
    PlayfairDisplayMedium: require('@tamagui-google-fonts/playfair-display/fonts/static/PlayfairDisplay-Medium.ttf'),
    PlayfairDisplaySemiBold: require('@tamagui-google-fonts/playfair-display/fonts/static/PlayfairDisplay-SemiBold.ttf'),
    PlayfairDisplayBold: require('@tamagui-google-fonts/playfair-display/fonts/static/PlayfairDisplay-Bold.ttf'),
    PlayfairDisplayExtraBold: require('@tamagui-google-fonts/playfair-display/fonts/static/PlayfairDisplay-ExtraBold.ttf'),
    PlayfairDisplayBlack: require('@tamagui-google-fonts/playfair-display/fonts/static/PlayfairDisplay-Black.ttf'),
    PlayfairDisplayItalic: require('@tamagui-google-fonts/playfair-display/fonts/static/PlayfairDisplay-Italic.ttf'),
    PlayfairDisplayMediumItalic: require('@tamagui-google-fonts/playfair-display/fonts/static/PlayfairDisplay-MediumItalic.ttf'),
    PlayfairDisplaySemiBoldItalic: require('@tamagui-google-fonts/playfair-display/fonts/static/PlayfairDisplay-SemiBoldItalic.ttf'),
    PlayfairDisplayBoldItalic: require('@tamagui-google-fonts/playfair-display/fonts/static/PlayfairDisplay-BoldItalic.ttf'),
    PlayfairDisplayExtraBoldItalic: require('@tamagui-google-fonts/playfair-display/fonts/static/PlayfairDisplay-ExtraBoldItalic.ttf'),
    PlayfairDisplayBlackItalic: require('@tamagui-google-fonts/playfair-display/fonts/static/PlayfairDisplay-BlackItalic.ttf'),
  })
// ...
```

## Web

Get the font's script (`<link>` or `@import`) and add it to `<head>` from [here](https://fonts.google.com/specimen/Playfair+Display)


## Next.js Font (next/font/google)

Import the font from `next/font/google` and give it a variable name in your `_app.tsx` like so:

```ts
import { PlayfairDisplay } from 'next/font/google' // the casing might differ

const font = PlayfairDisplay({
  variable: '--my-font',
})
```

Add the variable style in `_app.tsx`:

```tsx
<div className={font.variable}>
  {*/ ...rest of your _app.tsx tree */}
</div>
```

Then go to the generated font package and update `family` with the variable.

So, change it from:
```ts
return createFont({
    family: isWeb
      ? '"Playfair Display", -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      : 'Playfair Display',
```

To:
```ts
return createFont({
    family: isWeb
      ? 'var(--my-font), -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      : 'Playfair Display',
```


## Usage in config

```ts
import { createPlayfairDisplayFont } from '@tamagui-google-fonts/playfair-display' 

export const myFont = createPlayfairDisplayFont(
  {
    face: {
    "400": {
        "normal": "PlayfairDisplay",
        "italic": "PlayfairDisplayItalic"
    },
    "500": {
        "normal": "PlayfairDisplayMedium",
        "italic": "PlayfairDisplayMediumItalic"
    },
    "600": {
        "normal": "PlayfairDisplaySemiBold",
        "italic": "PlayfairDisplaySemiBoldItalic"
    },
    "700": {
        "normal": "PlayfairDisplayBold",
        "italic": "PlayfairDisplayBoldItalic"
    },
    "800": {
        "normal": "PlayfairDisplayExtraBold",
        "italic": "PlayfairDisplayExtraBoldItalic"
    },
    "900": {
        "normal": "PlayfairDisplayBlack",
        "italic": "PlayfairDisplayBlackItalic"
    }
}
        },
  {
    // customize the size and line height scaling to your own needs
    // sizeSize: (size) => Math.round(size * 1.1),
    // sizeLineHeight: (size) => size + 5,
  }
)
```

NOTE: these instructions are auto-generated and might not be accurate with some fonts since not all fonts share the same conventions. you may need to edit them out to get them to work.
