import {
  verticalScale as RH,
  moderateVerticalScale as RHA,
  moderateScale as RPH,
  scale as RW,
} from 'react-native-size-matters';

export const FONTS = {
  PL: 'Poppins-Light', // 300
  PR: 'Poppins-Regular', // 400
  PM: 'Poppins-Medium', // 500
  PSM: 'Poppins-SemiBold', // 600
  PB: 'Poppins-Bold', // 700
  PEB: 'Poppins-ExtraBold', // 800
};

export const SIZES = {
  xs: RW(12),
  s: RW(14),
  m: RW(16),
  ml: RW(18),
  l: RW(20),
  xl: RW(22),
  xml: RW(24),
  xxl: RW(26),
  xxxl: RW(31),
};

export {RW, RH, RPH, RHA};
