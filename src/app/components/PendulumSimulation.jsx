"use client";

import React, { useEffect, useRef } from 'react';

const PendulumSimulation = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    // Only run on the client side
    if (typeof window === 'undefined') return;
    
    // Dynamically import p5 (it's a client-side only library)
    import('p5').then((p5Module) => {
      const p5 = p5Module.default;
      
      const sketch = (p) => {
        let length = 180;       // Length of pendulum
        let gravity = 0.4;      // Gravity constant
        let angle = Math.PI/4;  // Initial angle
        let angleVelocity = 0;  // Angular velocity
        let angleAcceleration;  // Angular acceleration
        let damping = 0.995;    // Damping factor
        let ballRadius = 20;    // Radius of pendulum ball
        let dragging = false;   // Is the user dragging the pendulum?
        let origin;             // Origin point
        let position;           // Position of ball
        
        p.setup = () => {
          // Create canvas that fits the container
          const width = containerRef.current.clientWidth;
          const height = 400;
          p.createCanvas(width, height);
          origin = p.createVector(width/2, 100);
        };
        
        p.draw = () => {
          p.background(240);
          
          // Update angle acceleration
          angleAcceleration = (-gravity / length) * Math.sin(angle);
          
          // If user is dragging the pendulum
          if (dragging) {
            // Calculate angle based on mouse position
            const mouseVector = p.createVector(p.mouseX - origin.x, p.mouseY - origin.y);
            angle = Math.atan2(mouseVector.x, -mouseVector.y);
            angleVelocity = 0;
          } else {
            // Apply physics
            angleVelocity += angleAcceleration;
            angleVelocity *= damping;
            angle += angleVelocity;
          }
          
          // Calculate position of pendulum ball
          position = p.createVector(
            origin.x + length * Math.sin(angle),
            origin.y + length * Math.cos(angle)
          );
          
          // Draw pendulum string
          p.stroke(0);
          p.strokeWeight(2);
          p.line(origin.x, origin.y, position.x, position.y);
          
          // Draw origin point
          p.fill(127);
          p.noStroke();
          p.ellipse(origin.x, origin.y, 10, 10);
          
          // Draw pendulum ball
          p.fill(45, 123, 182);
          p.ellipse(position.x, position.y, ballRadius*2, ballRadius*2);
          
          // Draw instruction text
          p.fill(0);
          p.noStroke();
          p.textAlign(p.CENTER);
          p.text('Click and drag to move the pendulum', p.width/2, 30);
        };
        
        p.mousePressed = () => {
          // Check if mouse is over the pendulum ball
          const d = p.dist(p.mouseX, p.mouseY, position.x, position.y);
          if (d < ballRadius) {
            dragging = true;
          }
        };
        
        p.mouseReleased = () => {
          dragging = false;
        };
        
        // Handle window resize
        p.windowResized = () => {
          if (containerRef.current) {
            p.resizeCanvas(containerRef.current.clientWidth, 400);
            origin.x = p.width/2;
          }
        };
      };
      
      // Create new p5 instance
      const myP5 = new p5(sketch, containerRef.current);
      
      // Cleanup function
      return () => {
        myP5.remove();
      };
    });
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full aspect-video bg-gray-100 border rounded-lg shadow-inner"
      style={{ touchAction: 'none' }} // Prevents scrolling while touching the canvas on mobile
    />
  );
};

export default PendulumSimulation;