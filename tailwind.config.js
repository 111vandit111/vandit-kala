import plugin from "tailwindcss/plugin";

export const colors = {
  primary: {
    DEFAULT: "#011D33",
    25: "#F7F7FD",
    100: "#EFEDF9",
    400: "#3522AC",
    500: "#695ACC",
    600: "#3522AC",
    700: "#180C68",
    800: "#180C68",
    900: "#050026",
  },
  secondary: {
    DEFAULT: "#13161A",
    25: "#FAFBFC",
    50: "#F5F7FA",
    100: "#DDE4EB",
    200: "#C3CED9",
    400: "#818D99",
    600: "#606A73",
    900: "#13161A",
    500: "#DA47D4",
    700: "#5ACCBE",
    800: "#1E42C0",
  },
  framework: {
    DEFAULT: "#DDE4EB",
    gray: "#DDE4EB",
    blue: "#CCF3FF",
    orange: "#FFE1D4",
    yellow: "#FFF8E0",
    red: "#FFE0E8",
    green: "#E0FFEE",
    purple: "#6B38C8",
    white: "#FFFFFF",
    brown: "#9A431D",
    darkPurple: "#6A002C",
    darkRed: "#8B0000",
    violet: "#ECE0FF",
    darkViolet: "#39044C",
  },
  status: {
    DEFAULT: "#C2CBCF",
    notUploaded: "#C2CBCF",
    draft: "#FFCC47",
    approved: "#0C90F4",
    needsReview: "#FB5B4C",
    published: "#04BE8D",
    assessed: "#695ACC",
  },
  alert: {
    DEFAULT: "#B21709",
    successDark: "#056632",
    success: "#04BE8D",
    successLight: "#C3F3D9",
    errorDark: "#B21709",
    error: "#FB5B4C",
    errorLight: "#FADEDC",
    regularDark: "#B28D09",
    regular: "#FFCC47",
    regularLight: "#F3EBCF",
    warning: "#FF9A4B",
    warningLight: "#FFF5ED",
    warningDark: "#E06301",
    purpleLight: "#B39DDB10",
    darkBrown: "#483901",
  },
  text: {
    DEFAULT: "#232525",
    100: "#727677",
    500: "#4A4A4A",
    900: "#232525",
  },
  white: {
    DEFAULT: "#FFFFFF",
  },
  black: {
    DEFAULT: "#000000",
  },
  border: {
    DEFAULT: "#ECECEC",
    50: "#ECECEC",
  },
  background: {
    DEFAULT: "#ffffff",
    50: "#ffffff",
    "light-red": "#FB5B4C1A",
    gray: "#E6E6E6",
    orange: "#FFEFED",
  },
  base: {
    primary: "#695ACC",
  },
};

const rotateX = plugin(({ addUtilities }) => {
  addUtilities({
    ".rotate-x-90": {
      transform: "rotateX(90deg)",
    },
    ".rotate-x-180": {
      transform: "rotateX(180deg)",
    },
    ".rotate-x-270": {
      transform: "rotateX(270deg)",
    },
    ".rotate-x-360": {
      transform: "rotateX(360deg)",
    },
  });
});

const rotateY = plugin(({ addUtilities }) => {
  addUtilities({
    ".rotate-y-90": {
      transform: "rotateY(90deg)",
    },
    ".rotate-y-180": {
      transform: "rotateY(180deg)",
    },
    ".rotate-y-270": {
      transform: "rotateY(270deg)",
    },
    ".rotate-y-3600": {
      transform: "rotateY(360deg)",
    },
  });
});


const tailwindConfig = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  media: false,
  important: false,
  theme: {
    screens: {
      lg: { max: "1280px" },
      md: { max: "1100px" },
      sm: { max: "768px" },
      xs: { max: "350px" },
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      primary: colors.primary,
      secondary: colors.secondary,
      framework: colors.framework,
      status: colors.status,
      alert: colors.alert,
      background: colors.background,
    },
    fontFamily: {
      primary: "Rethink Sans",
      secondary: "Inter",
    },
    extend: {
      fontSize: {
        "heading-big": ["2.5rem", { lineHeight: "normal", fontWeight: "700" }],
        "heading-1": ["2rem", { lineHeight: "normal", fontWeight: "700" }],
        "heading-2": ["1.5rem", { lineHeight: "normal", fontWeight: "700" }],
        "heading-3": ["1.25rem", { lineHeight: "normal", fontWeight: "700" }],
        "heading-4": ["1rem", { lineHeight: "normal", fontWeight: "700" }],
        "heading-5": ["0.875rem", { lineHeight: "normal", fontWeight: "700" }],
        "heading-6": ["0.75rem", { lineHeight: "normal", fontWeight: "700" }],
        para: ["1rem", { lineHeight: "normal", fontFamily: "Inter" }],
        "para-2": ["0.875rem", { lineHeight: "normal", fontFamily: "Inter" }],
        "para-3": ["0.75rem", { lineHeight: "normal", fontFamily: "Inter" }],
        "text-xxs": ["0.625rem", { lineHeight: "normal" }],
      },
      fontWeight: {
        para: 400,
        "para-medium": 500,
        "para-semi": 600,
        "para-bold": 700,
      },
      animation: {
        "spin-slow": "spin-360 2s linear 0s infinite normal none running",
        "caret-blink": "caret-blink 0.7s ease-out infinite",
        "wave-segment": "wave-segment 1.5s ease-in-out infinite",
      },
      keyframes: {
        "spin-360": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        // fake cursor required for otp input
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "wave-segment": {
          "0%, 100%": { transform: "scaleY(1) scaleX(1)", borderRadius: "50%" },
          "50%": { transform: "scaleY(2.5) scaleX(0.6)", borderRadius: "25%" },
        },
      },
      backgroundColor: {
        default: colors.background,
      },
      textColor: {
        default: colors.text,
      },
      placeholderColor: {
        default: colors.text,
      },
      borderColor: {
        default: colors.border,
      },
      divideColor: {
        default: colors.border,
      },
      ringColor: {
        default: colors.border,
      },
      ringOffsetColor: {
        default: colors.border,
      },
      extendedSpacing: {
        13: "3.25rem",
        15: "3.75rem",
        50: "12.5rem",
        100: "25rem",
      },
      lineHeight: {
        0: "0rem",
        11: "2.75rem",
        12: "3rem",
        13: "3.25rem",
        14: "3.5rem",
        15: "3.75rem",
        16: "4rem",
        20: "5rem",
      },
      transitionProperty: {
        height: "height",
        width: "width",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.23, 1, 0.320, 1)",
      },
      height: (theme) => ({
        ...theme("extendedSpacing"),
      }),
      width: (theme) => ({
        ...theme("extendedSpacing"),
      }),
      minWidth: (theme) => ({
        screen: "100vw",
        ...theme("spacing"),
        ...theme("extendedSpacing"),
      }),
      maxWidth: (theme) => ({
        screen: "100vw",
        ...theme("spacing"),
        ...theme("extendedSpacing"),
      }),
      minHeight: (theme) => ({
        screen: "100vh",
        ...theme("spacing"),
        ...theme("extendedSpacing"),
      }),
      maxHeight: (theme) => ({
        screen: "100vh",
        ...theme("spacing"),
        ...theme("extendedSpacing"),
      }),
      zIndex: {
        "-1": -1,
        max: 99999999999,
      },
      boxShadow: {
        DEFAULT: "0 5px 15px 0 rgb(0 0 0 / 10%)",
        purple: "0 0 0 5px #EFEDF9",
        chatbotVariant: "0px 30px 50px 0px #13161A14",
      },
      order: {
        1: "1",
        2: "2",
      },
      position: {
        inherit: "inherit",
      },
      borderWidth: {
        1: "1px",
      },
    },
  },
  variants: {
    extend: {
      transitionProperty: ["hover", "focus"],
      transitionDuration: ["hover", "focus"],
      backgroundColor: ["even", "odd"],
      textAlign: ["important", "first", "last"],
      display: ["group-hover", "important", "hover"],
      borderColor: ["important"],
      maxWidth: ["important"],
      maxHeight: ["important"],
      minWidth: ["important"],
      minHeight: ["important"],
      width: ["important"],
      height: ["important"],
      padding: ["important", "last"],
      margin: ["important", "last"],
      backgroundOpacity: ["even", "odd"],
      fontSize: ["important"],
      fontWeight: ["important"],
      borderRadius: ["first", "last"],
      borderWidth: ["first", "last"],
      textColor: ["important"],
    },
  },
  plugins: [rotateX, rotateY],
};

export default tailwindConfig;
