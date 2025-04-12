import { Platform, StyleSheet } from "react-native";
import { COLORS, FONTS, RH, RHA, RW } from "../../theme";

const styles = StyleSheet.create({
  appHRinnerwrapper: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary,
    borderRadius: RW(8),
    flexDirection: "row",
    height: RHA(28),
    marginHorizontal: RW(4),
    marginVertical: RW(5),
    paddingHorizontal: RHA(12),
  },
  appHRwrapper: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: -5,
  },
  btnWrapper: {
    alignItems: "center",
  },
  buttonStyle: {
    alignItems: "center",
    borderRadius: 8,
    height: RW(30),
    justifyContent: "center",
    width: "100%",
  },
  buttonTextStyle: {
    alignItems: "center",
    color: COLORS.gray,
    fontFamily: FONTS.PR,
    fontSize: 18,
    lineHeight: 22,
  },
  buttonWithArrowWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: RH(10),
  },
  floatingButtonWrapper: {
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderColor: COLORS.white,
    borderRadius: RHA(30),
    borderWidth: 1,
    bottom: RW(16),
    elevation: 5,
    height: RHA(60),
    justifyContent: "center",
    paddingHorizontal: RW(20),
    paddingVertical: RW(10),
    position: "absolute",
    right: RW(16),
    shadowColor: COLORS.darkBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    width: RHA(60),
    ...Platform.select({
      ios: {
        shadowColor: COLORS.darkBlack,
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});

export default styles;
