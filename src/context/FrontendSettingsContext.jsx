
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const FrontendSettingsContext = createContext();

export const FrontendSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    bannerUrl: null,
    bannerBlur: false,
    cintaTexto: "",
    cintaVisible: true,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/frontend-settings`);
        if (res.data) {
          const sanitized = {
            bannerUrl: res.data.bannerUrl || null,
            bannerBlur: Boolean(res.data.bannerBlur),
            cintaTexto: res.data.cintaTexto || "",
            cintaVisible: res.data.cintaVisible ?? true,
          };
          setSettings(sanitized);
        }
      } catch (error) {
        console.error("Error cargando settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  return (
    <FrontendSettingsContext.Provider
      value={{ settings, updateSettings, loading }}
    >
      {children}
    </FrontendSettingsContext.Provider>
  );
};

export const useFrontendSettings = () => useContext(FrontendSettingsContext);
