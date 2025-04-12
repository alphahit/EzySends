import { StyleSheet } from "react-native";
import { COLORS, FONTS, RH, RW, RPH } from "../../theme";

const styles = StyleSheet.create({
  welcomeText: {
    color: COLORS.white,
    fontFamily: FONTS.PSB,
    fontSize: RW(24),
    textAlign: "center",
    marginVertical: RH(20),
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: RH(20),
    marginBottom: RPH(10),
  },
  loginLogoSize: {
    width: RPH(160),
    height: RPH(160),
  },
  forgotPasswordContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: RH(10),
    width: "100%",
  },
  forgotPasswordText: {
    color: COLORS.white,
    fontFamily: FONTS.PSB,
    fontSize: RW(14),
    textDecorationLine: "underline",
  },
  buttonContainer: {
    alignItems: "center",
    alignSelf: "center",
    marginVertical: RH(20),
    width: "100%",
  },
});

export default styles;
