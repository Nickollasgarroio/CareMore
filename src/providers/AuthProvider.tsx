// src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";

// Define a type for the profile data
type ProfileType = {
  id: string;
  name: string;
  last_name: string;
  area_de_atuacao: string;
  email: string;
  // Adicione outros campos conforme necessário
};

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  profile: ProfileType | null; // Add profile to the context type
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  profile: null, // Initialize profile as null
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileType | null>(null); // State for profile data

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      if (data.session) {
        // Fetch profile data if session is valid
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.session.user.id)
          .single();

        if (!error && profileData) {
          setProfile(profileData); // Set profile data in state
        }
      }

      setLoading(false);
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setSession(session);

        if (session) {
          // Fetch profile data if session is valid
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (!error && profileData) {
            setProfile(profileData); // Update profile state
          } else {
            setProfile(null);
          }
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading, profile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
