// **1a.** Keep your original as `lightColors`
export const lightColors = {
  screenBackgroundColor: '#fff',
  statusBarColor: '#fff',
  indicatorStyle: '#d7d7d7',
  primary: '#2190C0',
  primaryLight: '#14FF72',
  primaryDark: '#18698C',
  BorderPrimary: '#EEF7FC',
  secondary: '#090909',
  secondaryLight: '#21222D',
  secondaryDark: '#1B1C26',
  BorderSecondary: '#404355',
  whiteText: '#FFFFFF',

  // Dashboard colors

  primaryColor: '#274940', // Dark green

  // Staff box (dark green)
  dashboardPayout: '#558479', // Payout box (medium green)
  dashboardFwd: '#1B7A65', // FWD box (teal)
  dashboardRvp: '#7D9D9C', // RVP box (gray-green)
  dashboardAction: '#2190C0', // Action button color (blue)

  // Table colors
  // Table header background
  tableRowEvenBg: '#EAEAEA', // Even row background
  tableRowOddBg: '#FFFFFF', // Odd row background
  tableTextDark: '#282828', // Dark text color for table
  tableTextLight: '#FFFFFF', // Light text color for table
  tableBorder: '#D7D7D7', // Table border color

  /* … all your other keys … */
  transparentBorder: 'rgba(255,255,255,0)',
};

// **1b.** Create a matching object with dark-mode values.
export const darkColors = {
  screenBackgroundColor: '#121212', // dark background
  statusBarColor: '#121212', // match BG
  indicatorStyle: '#444', // darker thumb
  primary: '#2190C0', // keep brand blue
  primaryLight: '#0F637F', // darker tint
  primaryDark: '#0F637F', // darker tint
  BorderPrimary: '#1E2A33', // inverted light border
  secondary: '#fff', // white text on dark
  secondaryLight: '#e0e0e0',
  secondaryDark: '#ccc',
  BorderSecondary: '#3C3F4A',
  whiteText: '#FFFFFF',

  // Dashboard colors (darkened for dark mode)
  primaryColor: '#1A302A',
  dashboardPayout: '#3D605A',
  dashboardFwd: '#145A4B',
  dashboardRvp: '#5A7372',
  dashboardAction: '#1B7A9B',

  // Table colors for dark mode
  tableRowEvenBg: '#2A2A2A', // Even row background
  tableRowOddBg: '#333333', // Odd row background
  tableTextDark: '#E0E0E0', // Dark text color becomes light in dark mode
  tableTextLight: '#FFFFFF', // Light text color for table
  tableBorder: '#444444', // Table border color

  /* … and so on for each key … */
  transparentBorder: 'rgba(0,0,0,0)', // still transparent
};
