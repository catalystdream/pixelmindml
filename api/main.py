from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import numpy as np
from scipy.integrate import solve_ivp

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OrbitalParameters(BaseModel):
    semi_major_axis: float = 8000.0  # km
    eccentricity: float = 0.1
    inclination: float = 30.0  # degrees
    simulation_time: float = 10000.0  # seconds
    time_steps: int = 1000

# Earth constants
EARTH_RADIUS = 6371.0  # km
EARTH_MU = 398600.0  # km³/s²

# Orbital dynamics equations
def orbital_dynamics(t, state):
    x, y, z, vx, vy, vz = state
    r = np.sqrt(x**2 + y**2 + z**2)
    
    # Acceleration due to gravity
    ax = -EARTH_MU * x / r**3
    ay = -EARTH_MU * y / r**3
    az = -EARTH_MU * z / r**3
    
    return [vx, vy, vz, ax, ay, az]

@app.post("/api/satellite-orbit")
async def calculate_orbit(params: OrbitalParameters):
    # Convert inclination to radians
    inclination_rad = np.radians(params.inclination)
    
    # Initial conditions based on orbital parameters
    a = params.semi_major_axis
    e = params.eccentricity
    
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
    t_span = [0, params.simulation_time]
    t_eval = np.linspace(0, params.simulation_time, params.time_steps)
    
    # Solve the differential equations
    solution = solve_ivp(
        orbital_dynamics, 
        t_span, 
        initial_state, 
        method='RK45',
        t_eval=t_eval
    )
    
    # Extract results
    positions = {
        'x': solution.y[0].tolist(),
        'y': solution.y[1].tolist(),
        'z': solution.y[2].tolist(),
        'time': solution.t.tolist()
    }
    
    return {
        "positions": positions,
        "earth_radius": EARTH_RADIUS
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)