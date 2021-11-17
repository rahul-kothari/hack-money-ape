import { extendTheme } from "@chakra-ui/react"

export default extendTheme({
  fonts: {
    heading: "Urbanist",
    body: "Urbanist"
  },
  colors: {
    indigo: {
        50: "#EEF2FF",
        100: "#E0E7FF",
        200: "#C7D2FE",
        300: "#A5B4FC",
        400: "#818CF8",
        500: "#6366F1",
        600: "#4F46E5",
        700: "#4338CA",
        800: "#3730A3",
        900: "#312E81"
    },
    main: {
      primary: "#0850D1",
      primary_hover: "#3973da",
      primary_text: "",
      secondary: "",
      secondary_hover: ""
    },
    component: {
      blue: "#0850D1",
      red: "#FF1D36",
      green: "#01B26F",
      yellow: "#F1DC00",
      orange: "#FF9433",
      black: "#1C1C1C",
    },
    text: {
      primary: "#1C1C1C",
      secondary: "#EDE9E3"
    },
    background: "#FFFFFF",
    card: "#FFFFFF",
    card_border: "#1C1C1C",
    input_bg: "#e0e0e0",
    dark_card: "#8f8a88",
    light_card: "#bdbdbd"
  },
})

