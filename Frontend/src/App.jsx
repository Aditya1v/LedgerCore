import AppRouter from "./routes/AppRouter";
import { useSettings } from "./context/SettingsContext";

function App() {
  const { settings } = useSettings();
  return <AppRouter key={`${settings.theme}-${settings.currency}`} />;
}

export default App;
