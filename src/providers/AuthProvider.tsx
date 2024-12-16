import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";

type ProfileType = {
  id: string;
  name: string;
  last_name: string;
  area_de_atuacao: string;
  email: string;
};

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  profile: ProfileType | null;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  profile: null,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(() => {
    const storedSession = localStorage.getItem("session");
    return storedSession ? JSON.parse(storedSession) : null;
  });
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileType | null>(null);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      if (data.session) {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.session.user.id)
          .single();

        if (!error && profileData) {
          setProfile(profileData);
        }
      }
      setLoading(false);
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setLoading(true);
        setSession(session);
        localStorage.setItem("session", JSON.stringify(session));
        if (session) {
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (!error && profileData) {
            setProfile(profileData);
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

  useEffect(() => {
    if (!session) {
      localStorage.removeItem("session");
    }
  }, [session]);

  return (
    <AuthContext.Provider value={{ session, loading, profile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
