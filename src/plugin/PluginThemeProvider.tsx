import { Theme as MuiTheme, createTheme } from "@mui/material/styles";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import OBR, { Theme } from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";

/**
 * Create a MUI theme based off of the current OBR theme
 * If no theme is provided create the base dark theme
 */
function getTheme(theme?: Theme) {
  // Ignoramos el tema de OBR para darle un diseño único a la app
  return createTheme({
    palette: {
      mode: "dark",
      primary: { main: "#f59e0b" }, // Amber/Gold accent
      secondary: { main: "#10b981" }, // Emerald accent
      background: {
        paper: "rgba(15, 17, 26, 0.8)", // Deep dark blue glass
        default: "transparent",
      },
      text: {
        primary: "#e2e8f0",
        secondary: "#94a3b8",
      }
    },
    typography: {
      fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      h6: { fontWeight: 600, color: "#f59e0b" },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: "transparent",
          },
          // Custom scrollbar
          "::-webkit-scrollbar": { width: "6px" },
          "::-webkit-scrollbar-track": { background: "rgba(0,0,0,0.1)" },
          "::-webkit-scrollbar-thumb": { background: "rgba(245, 158, 11, 0.5)", borderRadius: "3px" },
        },
      },
      MuiButtonBase: { defaultProps: { disableRipple: true } },
      MuiIconButton: {
        styleOverrides: {
          root: {
            backgroundColor: "#ffffff",
            border: "2px solid #000000",
            color: "#000000",
            margin: "4px", // To prevent borders from touching
            boxShadow: "2px 2px 0px rgba(0,0,0,1)", // retro shadow
            transition: "all 0.1s ease-in-out",
            aspectRatio: "1/1",
            "&:hover": {
              backgroundColor: "#f59e0b", // Amber on hover
              color: "#000000",
              transform: "translateY(-2px)",
              boxShadow: "2px 4px 0px rgba(0,0,0,1)",
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: "rgba(0,0,0,0.85)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            fontSize: "0.8rem",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
            backgroundImage: "none",
          },
        },
      },
    },
  });
}

/**
 * Provide a MUI theme with the same palette as the parent OBR window
 */
export function PluginThemeProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [theme, setTheme] = useState<MuiTheme>(() => getTheme());
  const [ready, setReady] = useState(() => OBR.isReady);

  useEffect(() => {
    if (OBR.isAvailable) {
      OBR.onReady(() => setReady(true));
    }
  }, []);

  useEffect(() => {
    if (ready) {
      const updateTheme = (theme: Theme) => {
        setTheme(getTheme(theme));
      };
      OBR.theme.getTheme().then(updateTheme);
      return OBR.theme.onChange(updateTheme);
    }
  }, [ready]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
