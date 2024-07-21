import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import Meniusus from "./Meniusus";
import Meniujos from "./Meniujos";
import googleIcon from "./poze/googlelogin.png";
import supabase from "./supabaseClient";
import facebookIcon from './poze/facebooklogin.png'

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  useEffect(() => {
    const session = localStorage.getItem("session");
    if (session) {
      navigate("/Acasa");
    }
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/Acasa",
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        console.error("Google Login Error:", error);
        throw error;
      }

      if (data) {
        const session = data.session;
        const user = data.user;

        localStorage.setItem("session", JSON.stringify(session));
        localStorage.setItem("userEmail", user.email);

        const { error: insertError } = await supabase
          .from("users")
          .upsert({ adresa_email: user.email });

        if (insertError) {
          console.error(
            "Error inserting user into database:",
            insertError.message
          );
        }
      } else {
        console.error("Google Login Failed: No valid session data received");
      }
    } catch (error) {
      console.error("Exception in Google Login:", error.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: window.location.origin + "/Acasa",
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        console.error("Eroare conectare facebook", error);
        throw error;
      }

      if (data) {
        const session = data.session;
        const user = data.user;

        localStorage.setItem("session", JSON.stringify(session));
        localStorage.setItem("userEmail", user.email);

        const { error: insertError } = await supabase
          .from("users")
          .upsert({ adresa_email: user.email });

        if (insertError) {
          console.error("Eroare conectare facebook", insertError.message);
        }
      } else {
        console.error("Eroare conectare facebook");
      }
    } catch (error) {
      console.error("Eroare conectare facebook", error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data) {
        const session = data.session;
        localStorage.setItem("session", JSON.stringify(session));
        localStorage.setItem("userEmail", email);
        navigate("/Acasa");
      } else {
        console.error("Login failed: User or session data missing.");
        setLoginMessage(
          "Logare eșuată. Verifică datele de autentificare și încearcă din nou."
        );
      }
    } catch (error) {
      console.error("Login error:", error.message);
      setLoginMessage("Nume sau parolă greșită");
    }
  };

  return (
    <div>
      <Meniusus />
      <div className={styles.container}>
        <div className={styles.form}>
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Adresă de e-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Parolă</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <button type="submit5">Conectare</button>
            </div>
            {loginMessage && (
              <div className={styles.loginMessage}>{loginMessage}</div>
            )}
          </form>
          <div className={styles.socialLogin}>
            
            <div className={styles.socialLoginText}>sau folositi una dintre opțiunile:</div>
            <div className={styles.loginIcons}>
              <img src={googleIcon} alt="Google" className={styles.loginIcon} onClick={handleGoogleLogin} />
              <img src={facebookIcon} alt="Facebook" className={styles.loginIcon} onClick={handleFacebookLogin} />
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <span>
            <Link to="/Resetareparola">Ți-ai uitat parola?</Link>
          </span>
          <span>
            <Link to="/Inregistrare">Nu ai cont? Înregistrează-te</Link>
          </span>
        </div>
      </div>
      <Meniujos />
    </div>
  );
};

export default Login;
