import {
  verticalScale as RH,
  moderateVerticalScale as RHA,
  moderateScale as RPH,
  scale as RW,
} from "react-native-size-matters";

export const FONTS = {
  PB: "Poppins-Bold",
  PEB: "Poppins-ExtraBold",
  PL: "Poppins-Light",
  PM: "Poppins-Medium",
  PR: "Poppins-Regular",
  PSB: "Poppins-SemiBold",
};

const RT = (size: any) => RW(size);

export const SIZES = {
  xs: RW(11),
  s: RW(13),
  sl: RW(14),
  sm: RW(16),
  m: RW(18),
  l: RW(20),
  xl: RW(25),
  xxl: RW(29),
  xxxl: RW(31),
};

export { RW, RH, RPH, RHA, RT };
