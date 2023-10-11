import { createTheme, MantineColorsTuple, DefaultMantineColor } from "@mantine/core";
import { purple } from "./colors";

export const theme = createTheme({
  colors: {
    pcsPurple: purple
  }
})

type ExtendedCustomColors = 'pcsPurple' | DefaultMantineColor;

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, MantineColorsTuple>;
  }
}