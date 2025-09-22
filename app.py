import streamlit as st
import pandas as pd
import plotly.express as px
import io
from datetime import datetime

st.set_page_config(page_title="HeartTrack", layout="wide")

# -------------------------
# Helpers
# -------------------------
def ensure_state():
    if "users" not in st.session_state:
        # Default admin account
        st.session_state.users = [
            {"id": 1, "email": "admin@hearttrack.com", "password": "admin123", "role": "admin"}
        ]
        st.session_state.next_user_id = 2

    if "records" not in st.session_state:
        # Each record: {"id": int, "user_id": int, "heart_rate": int, "blood_pressure": str, "notes": str, "timestamp": iso}
        st.session_state.records = []
        st.session_state.next_record_id = 1

    if "current_user" not in st.session_state:
        st.session_state.current_user = None

def find_user_by_email(email):
    for u in st.session_state.users:
        if u["email"].lower() == email.lower():
            return u
    return None

def register_user(email, password, role="patient"):
    if find_user_by_email(email):
        return False, "User already exists"
    new = {"id": st.session_state.next_user_id, "email": email, "password": password, "role": role}
    st.session_state.users.append(new)
    st.session_state.next_user_id += 1
    return True, new

def login_user(email, password):
    u = find_user_by_email(email)
    if not u or u["password"] != password:
        return False, "Invalid credentials"
    st.session_state.current_user = {"id": u["id"], "email": u["email"], "role": u["role"]}
    return True, st.session_state.current_user

def logout_user():
    st.session_state.current_user = None

def add_record(user_id, heart_rate, blood_pressure, notes):
    record = {
        "id": st.session_state.next_record_id,
        "user_id": user_id,
        "heart_rate": int(heart_rate),
        "blood_pressure": blood_pressure,
        "notes": notes,
        "timestamp": datetime.utcnow().isoformat()
    }
    st.session_state.records.append(record)
    st.session_state.next_record_id += 1
    return record

def get_user_records(user_id):
    return [r for r in st.session_state.records if r["user_id"] == user_id]

def get_all_records():
    return st.session_state.records

def records_to_df(records):
    if not records:
        return pd.DataFrame(columns=["id","user_id","heart_rate","blood_pressure","notes","timestamp"])
    return pd.DataFrame(records)

def create_csv_download(df, filename="hearttrack.csv"):
    buffer = io.BytesIO()
    df.to_csv(buffer, index=False)
    buffer.seek(0)
    return buffer

# -------------------------
# Initialize session state
# -------------------------
ensure_state()

# -------------------------
# Layout: sidebar navigation
# -------------------------
st.sidebar.title("HeartTrack")
if st.session_state.current_user:
    st.sidebar.write(f"Signed in as: **{st.session_state.current_user['email']}**")
    if st.sidebar.button("Logout"):
        logout_user()
        st.experimental_rerun()
else:
    st.sidebar.write("Not signed in")

page = st.sidebar.radio("Navigate", ["Home", "Register", "Login", "Log Data", "My Dashboard", "Admin Dashboard"])

# Optional settings for alerts/thresholds
st.sidebar.markdown("---")
st.sidebar.subheader("Alert thresholds")
high_threshold = st.sidebar.number_input("High BPM threshold", min_value=40, max_value=300, value=120)
low_threshold = st.sidebar.number_input("Low BPM threshold", min_value=20, max_value=120, value=40)
st.sidebar.markdown("---")
st.sidebar.caption("Data is stored in-memory for demo. For persistence, connect a DB.")

# -------------------------
# Pages
# -------------------------

if page == "Home":
    st.title("❤️ HeartTrack")
    st.write("Welcome to HeartTrack — simple vitals logging and monitoring.")
    st.markdown(
        """
        **Quick start**
        - Register a patient account or use default admin: `admin@hearttrack.com / admin123`
        - Patients can log vitals under *Log Data* and view personal trends under *My Dashboard*.
        - Admin can view all users and all vitals under *Admin Dashboard*.
        """
    )
    st.info("This demo stores everything in memory (session). For production, connect to a database.")

elif page == "Register":
    st.title("Register")
    with st.form("register_form"):
        email = st.text_input("Email")
        password = st.text_input("Password", type="password")
        role = st.selectbox("Role", ["patient", "admin"])
        submitted = st.form_submit_button("Register")
        if submitted:
            if not email or not password:
                st.error("Provide email and password.")
            else:
                ok, res = register_user(email.strip(), password.strip(), role)
                if ok:
                    st.success("Registered successfully. You can now log in.")
                else:
                    st.error(res)

elif page == "Login":
    st.title("Login")
    with st.form("login_form"):
        email = st.text_input("Email")
        password = st.text_input("Password", type="password")
        submitted = st.form_submit_button("Login")
        if submitted:
            ok, res = login_user(email.strip(), password.strip())
            if ok:
                st.success(f"Welcome, {res['email']}!")
                # Redirect to dashboard
                if res["role"] == "admin":
                    st.experimental_rerun()
                else:
                    st.experimental_rerun()
            else:
                st.error(res)

elif page == "Log Data":
    if not st.session_state.current_user:
        st.warning("You must be logged in to log vitals. Please login or register.")
    else:
        if st.session_state.current_user["role"] != "patient":
            st.info("Only patients log vitals here. Admins can view all vitals in Admin Dashboard.")
        st.title("Log Vitals")
        with st.form("log_form"):
            heart_rate = st.number_input("Heart Rate (BPM)", min_value=20, max_value=300, value=72)
            blood_pressure = st.text_input("Blood Pressure (e.g. 120/80)")
            notes = st.text_area("Notes (symptoms, meds, etc.)")
            submitted = st.form_submit_button("Save Vitals")
            if submitted:
                rec = add_record(st.session_state.current_user["id"], heart_rate, blood_pressure, notes)
                st.success("Saved vitals.")
                # Alert logic
                if rec["heart_rate"] >= high_threshold:
                    st.warning(f"High heart rate detected: {rec['heart_rate']} bpm. Consider contacting a doctor.")
                elif rec["heart_rate"] <= low_threshold:
                    st.warning(f"Low heart rate detected: {rec['heart_rate']} bpm. Consider contacting a doctor.")

elif page == "My Dashboard":
    if not st.session_state.current_user:
        st.warning("Please login to view your dashboard.")
    else:
        st.title("My Dashboard")
        uid = st.session_state.current_user["id"]
        recs = get_user_records(uid)
        df = records_to_df(recs)
        if df.empty:
            st.info("No vitals yet. Use 'Log Data' to add entries.")
        else:
            # Convert timestamp to readable
            df_display = df.copy()
            df_display["timestamp"] = pd.to_datetime(df_display["timestamp"])
            df_display = df_display.sort_values("timestamp")
            st.subheader("Recent records")
            st.dataframe(df_display[["timestamp", "heart_rate", "blood_pressure", "notes"]].rename(columns={"heart_rate":"BPM","blood_pressure":"BP"}))

            # Stats
            st.subheader("Statistics")
            stats_col1, stats_col2, stats_col3 = st.columns(3)
            stats_col1.metric("Latest BPM", int(df_display.iloc[-1]["heart_rate"]))
            stats_col2.metric("Average BPM", round(df_display["heart_rate"].mean(),1))
            stats_col3.metric("Records", len(df_display))

            # Plot
            st.subheader("Trends")
            fig = px.line(df_display, x="timestamp", y="heart_rate", markers=True, title="Heart Rate Over Time")
            fig.update_layout(xaxis_title="Time", yaxis_title="BPM")
            st.plotly_chart(fig, use_container_width=True)

            # CSV export
            csv_buffer = create_csv_download(df_display)
            st.download_button("Download my vitals (CSV)", data=csv_buffer, file_name="my_vitals.csv", mime="text/csv")

elif page == "Admin Dashboard":
    if not st.session_state.current_user:
        st.warning("Please login as admin to view admin dashboard.")
    elif st.session_state.current_user["role"] != "admin":
        st.error("Forbidden — admin access only.")
    else:
        st.title("Admin Dashboard")
        # Users list
        st.subheader("Users")
        users_df = pd.DataFrame([{k:v for k,v in u.items() if k!="password"} for u in st.session_state.users])
        st.dataframe(users_df)

        # All vitals
        st.subheader("All Vitals")
        all_df = records_to_df(get_all_records())
        if all_df.empty:
            st.info("No vitals recorded yet.")
        else:
            all_df["timestamp"] = pd.to_datetime(all_df["timestamp"])
            all_df = all_df.sort_values("timestamp", ascending=False)
            st.dataframe(all_df[["timestamp","user_id","heart_rate","blood_pressure","notes"]].rename(columns={"heart_rate":"BPM","blood_pressure":"BP"}))

            # Aggregates
            st.subheader("Aggregates / Analytics")
            agg = all_df.groupby("user_id")["heart_rate"].agg(["count","mean","min","max"]).reset_index().rename(columns={"count":"records","mean":"avg_bpm","min":"min_bpm","max":"max_bpm"})
            st.dataframe(agg)

            # Simple alerting: list recent dangerous readings
            st.subheader("Recent Alerts")
            alerts = all_df[(all_df["heart_rate"] >= high_threshold) | (all_df["heart_rate"] <= low_threshold)]
            if alerts.empty:
                st.info("No alerts.")
            else:
                st.dataframe(alerts[["timestamp","user_id","heart_rate","blood_pressure","notes"]].rename(columns={"heart_rate":"BPM","blood_pressure":"BP"}))

            # Download all vitals
            csv_buffer = create_csv_download(all_df)
            st.download_button("Download all vitals (CSV)", data=csv_buffer, file_name="all_vitals.csv", mime="text/csv")

# -------------------------
# Footer / quick info
# -------------------------
st.sidebar.markdown("---")
st.sidebar.write("Demo app — in-memory storage. For production, connect to a persistent database (Postgres, Supabase, etc.).")
