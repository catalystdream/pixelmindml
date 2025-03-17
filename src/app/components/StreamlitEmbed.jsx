"use client";

import React from 'react';

export default function StreamlitEmbed({ src, title, height = "800px" }) {
  return (
    <div className="streamlit-container w-full">
      <iframe
        src={src}
        height={height}
        width="100%"
        title={title}
        style={{ border: 'none', borderRadius: '8px' }}
        allow="camera;microphone"
      ></iframe>
    </div>
  );
}