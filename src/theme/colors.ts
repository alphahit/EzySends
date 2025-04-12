// COLOR COLLECTIONS

import { DefaultTheme } from "@react-navigation/native";

export const COLORS = {
  // DONOT REMOVE
  screenBackgroundColor: "#fff",
  statusBarColor: "#fff",
  // #D7A674
  primary: "#D7A674",
  primaryLight0: "#F8E6D1",
  primaryLight: "#EBD3B9",
  primaryLight1: "#b58b61",
  primaryLight2: "#E5D7BC",
  primaryDark: "#18698C",
  primaryDark1: "#a68057",
  primaryDark2: "#B68452",
  primaryDark3: "#A2794F",
  primaryDark4: "#B0865E",
  primaryDark5: "#997148",
  primaryDark6: "#5d4630",
  transparentPrimary: "#EEF7FC",
  secondary: "#090909",
  secondaryLight: "#21222D",
  secondaryDark: "#1B1C26",
  transparentSecondary: "#404355",
  translucentPrimary: "rgba(215,166,116,0.5)",

  // GREY COLORS SHADES
  whiteGray: "#F3F5F7",
  gray: "#888888",
  darkGray: "#CFCFCF",
  lightGray: "#F9F9F9",
  lightGray1: "#dddddd",
  collpasableGray: "#F9FAFB",
  borderGray: "#F1F1F1",
  appGray: "#344054",
  textGray: "#667085",

  // RESPONSE COLORS SHADES
  warning: "#FFAB07",
  warningDark: "#B54708",
  danger: "#E43E3E",
  dangerDark: "#B42318",
  success: "#12B76A",
  successDark: "#027A48",

  darkBlack: "#000",
  black: "#1E1F20",
  white: "#FFFFFF",

  transparent: "transparent",
  transparentBlack: "rgba(0, 0, 0, 0.1)",
  transparentWhite: "rgba(255, 255, 255, 0.4)",
  transparentDarkBlack: "#00000040",
  transparentWhiteBlur: "rgba(255, 255, 255, 0.15)",
  translucentWhiteBlur: "rgba(255, 255, 255,0.8)",
  loaderBg: "rgba(0, 0, 0, 0.6)",

  gray1: "#D0D5DD",
  gray2: "#101828",
  gray3: "#EEEEEE",
  gray4: "#f0f0f0",
  gray5: "#E5E5E5",
  gray6: "#d6d6d6",
  darkGray1: "#AAAAAA",
  tooltip: "#0F1828",
  featuredColorInner: "#DCF0F9",

  // blue
  lightBlue: "#adddf7",

  fadeGreen: "#66A534",
  translucentBlack: "rgba(0, 0, 0, 0.5)",
  colorGrades: {
    primaryGradeDark: "#DCF0F9",
    primaryGradeLight: "#EEF7FC",
    greenGradeDark: "#D1FADF",
    greenGradeLight: "#ECFDF3",
    redDark: "#FEF3F2",
    orangeDark: "#FFFAEB",
    grayDark: "#F2F4F7",
  },
};

export const statusBarStyle = "dark-content"; // light-content || dark-content

export const NavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.screenBackgroundColor,
  },
};
