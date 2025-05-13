<template>
  <div class="app-container">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<style>
:root {
  /* Primary color - Navy */
  --primary-color: #0a192f;
  --primary-light: #172a45;
  --primary-dark: #020c1b;

  /* Secondary color - Teal */
  --secondary-color: #0d9488;
  --secondary-light: #14b8a6;
  --secondary-dark: #0f766e;

  /* Neutral colors */
  --neutral-50: #f8fafc;
  --neutral-100: #f1f5f9;
  --neutral-200: #e2e8f0;
  --neutral-300: #cbd5e1;
  --neutral-400: #94a3b8;
  --neutral-500: #64748b;
  --neutral-600: #475569;
  --neutral-700: #334155;
  --neutral-800: #1e293b;
  --neutral-900: #0f172a;
}

html,
body {
  margin: 0;
  padding: 0;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--neutral-50);
  color: var(--neutral-800);
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Tailwind utility classes for the color scheme */
.bg-primary {
  background-color: var(--primary-color) !important;
}

.bg-primary-light {
  background-color: var(--primary-light) !important;
}

.bg-primary-dark {
  background-color: var(--primary-dark) !important;
}

.bg-secondary {
  background-color: var(--secondary-color) !important;
}

.bg-secondary-light {
  background-color: var(--secondary-light) !important;
}

.bg-secondary-dark {
  background-color: var(--secondary-dark) !important;
}

.text-primary {
  color: var(--primary-color) !important;
}

.text-secondary {
  color: var(--secondary-color) !important;
}

.border-primary {
  border-color: var(--primary-color) !important;
}

.border-secondary {
  border-color: var(--secondary-color) !important;
}

/* Button styling */
.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: var(--primary-light);
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: white;
  border: none;
  transition: background-color 0.3s;
}

.btn-secondary:hover {
  background-color: var(--secondary-light);
}

/* Responsive utilities */
@media (max-width: 768px) {
  .hide-on-mobile {
    display: none !important;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .hide-on-tablet {
    display: none !important;
  }
}

@media (min-width: 1025px) {
  .hide-on-desktop {
    display: none !important;
  }
}
</style>
