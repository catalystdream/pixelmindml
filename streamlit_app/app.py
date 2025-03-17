import streamlit as st
import numpy as np
import plotly.graph_objects as go
from scipy.integrate import solve_ivp

# Page configuration
st.set_page_config(
    page_title="Satellite Orbit Simulation",
    layout="wide"
)

# Header
st.title("3D Satellite Orbit Simulation")
st.markdown("This simulation shows a satellite orbiting Earth based on orbital mechanics.")

# Earth constants
EARTH_RADIUS = 6371.0  # km
EARTH_MU = 398600.0  # km³/s²

# Sidebar for orbital parameters
st.sidebar.header("Orbital Parameters")
semi_major_axis = st.sidebar.slider("Semi-major axis (km)", 6500.0, 20000.0, 8000.0)
eccentricity = st.sidebar.slider("Eccentricity", 0.0, 0.9, 0.1, 0.01)
inclination = st.sidebar.slider("Inclination (degrees)", 0.0, 90.0, 30.0)
simulation_time = st.sidebar.slider("Simulation time (seconds)", 1000, 20000, 10000)
time_steps = st.sidebar.slider("Resolution (points)", 100, 2000, 1000)

# Orbital dynamics equations
def orbital_dynamics(t, state):
    x, y, z, vx, vy, vz = state
    r = np.sqrt(x**2 + y**2 + z**2)
    
    # Acceleration due to gravity
    ax = -EARTH_MU * x / r**3
    ay = -EARTH_MU * y / r**3
    az = -EARTH_MU * z / r**3
    
    return [vx, vy, vz, ax, ay, az]

# Calculate orbit
@st.cache_data
def calculate_orbit(a, e, inc, sim_time, steps):
    # Convert inclination to radians
    inclination_rad = np.radians(inc)
    
    # Perigee distance and velocity
    r_p = a * (1 - e)
    v_p = np.sqrt(EARTH_MU * (2/r_p - 1/a))
    
    # Initial state [x, y, z, vx, vy, vz]
    # Starting at perigee along x-axis
    initial_state = [
        r_p, 0, 0,
        0, v_p * np.cos(inclination_rad), v_p * np.sin(inclination_rad)
    ]
    
    # Time span for the simulation
    t_span = [0, sim_time]
    t_eval = np.linspace(0, sim_time, steps)
    
    # Solve the differential equations
    solution = solve_ivp(
        orbital_dynamics, 
        t_span, 
        initial_state, 
        method='RK45',
        t_eval=t_eval
    )
    
    return solution

# Run simulation
solution = calculate_orbit(semi_major_axis, eccentricity, inclination, simulation_time, time_steps)

# Extract position data
x = solution.y[0]
y = solution.y[1]
z = solution.y[2]

# Create Earth sphere
u, v = np.mgrid[0:2*np.pi:20j, 0:np.pi:10j]
earth_x = EARTH_RADIUS * np.cos(u) * np.sin(v)
earth_y = EARTH_RADIUS * np.sin(u) * np.sin(v)
earth_z = EARTH_RADIUS * np.cos(v)

# Create 3D plot
fig = go.Figure()

# Add Earth
fig.add_trace(go.Surface(
    x=earth_x, y=earth_y, z=earth_z,
    colorscale='Blues',
    showscale=False,
    opacity=0.8
))

# Add orbit path
fig.add_trace(go.Scatter3d(
    x=x, y=y, z=z,
    mode='lines',
    line=dict(color='white', width=3),
    name='Orbit'
))

# Add satellite (last point)
fig.add_trace(go.Scatter3d(
    x=[x[-1]], y=[y[-1]], z=[z[-1]],
    mode='markers',
    marker=dict(size=5, color='red'),
    name='Satellite'
))

# Configure layout
fig.update_layout(
    title="",
    scene=dict(
        xaxis_title="X (km)",
        yaxis_title="Y (km)",
        zaxis_title="Z (km)",
        aspectratio=dict(x=1, y=1, z=1),
        camera=dict(
            eye=dict(x=1.5, y=1.5, z=1.5)
        )
    ),
    margin=dict(l=0, r=0, b=0, t=0),
    height=700,
    width=800,
    template="plotly_dark"
)

# Display plot
st.plotly_chart(fig, use_container_width=True)

# Add info
with st.expander("About This Simulation"):
    st.markdown("""
    This simulation calculates a satellite's orbit using these key concepts:
    
    - **Orbital Mechanics**: Uses Newton's laws of motion and universal gravitation
    - **Numerical Integration**: Solves the differential equations of motion
    - **Keplerian Elements**: Defines the orbit using standard orbital parameters
    
    The simulation shows how different orbital parameters affect the satellite's path around Earth.
    """)