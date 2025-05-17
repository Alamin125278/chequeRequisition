<template>
  <div class="app-container">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Lato:wght@300;400;700&family=Roboto+Mono&display=swap");

:root {
  /* Color Palette */
  --primary-ui: #2e2e2e;
  --accent-cta: #6b8e23;
  --success: #228b22;
  --success-dark: #1a6b1a;
  --blue: #3f21e9;
  --blue-dark: #5e0bd2;
  --teal: #00b7a5;
  --teal-dark: #067c6a;
  --error: #c0392b;
  --error-dark: #a93226;
  --error-light: #fadbd8;
  --background: #f5f5f5;
  --card-bg: #ffffff;
  --text-primary: #1a1a1a;
  --text-secondary: #6e6e6e;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
}

html,
body {
  margin: 0;
  padding: 0;
  font-family: "Lato", "Open Sans", -apple-system, BlinkMacSystemFont,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--background);
  color: var(--text-primary);
  font-size: 16px;
  line-height: 1.5;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Poppins", "Montserrat", sans-serif;
  font-weight: 600;
  color: var(--text-primary);
  margin-top: 0;
}

h1 {
  font-size: 24px;
}
h2 {
  font-size: 22px;
}
h3 {
  font-size: 20px;
}
h4 {
  font-size: 18px;
}
h5 {
  font-size: 16px;
}
h6 {
  font-size: 14px;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Typography */
.text-small {
  font-size: 12px;
}

.text-body {
  font-size: 16px;
}

.text-mono {
  font-family: "Roboto Mono", monospace;
}

/* Utility classes for the color scheme */
.bg-primary {
  background-color: var(--primary-ui) !important;
}

.bg-accent {
  background-color: var(--accent-cta) !important;
}

.bg-success {
  background-color: var(--success) !important;
}
.bg-blue {
  background-color: var(--blue) !important;
}

.bg-error {
  background-color: var(--error) !important;
}

.bg-error-light {
  background-color: var(--error-light) !important;
}

.bg-background {
  background-color: var(--background) !important;
}

.bg-card {
  background-color: var(--card-bg) !important;
}

.text-primary {
  color: var(--text-primary) !important;
}

.text-secondary {
  color: var(--text-secondary) !important;
}
.text-success {
  color: var(--success) !important;
}

.text-error {
  color: var(--error) !important;
}

.text-white {
  color: white !important;
}

.border-primary {
  border-color: var(--primary-ui) !important;
}

.border-accent {
  border-color: var(--accent-cta) !important;
}
.border-blue {
  border-color: var(--blue) !important;
}
.border-blue-dark {
  border-color: var(--blue-dark) !important;
}

.bg-accent-dark {
  background-color: #5a7a1f !important;
}

.border-accent-dark {
  border-color: #5a7a1f !important;
}

.bg-success-dark {
  background-color: var(--success-dark) !important;
}

.border-success-dark {
  border-color: var(--success-dark) !important;
}

.bg-error-dark {
  background-color: var(--error-dark) !important;
}

.border-error-dark {
  border-color: var(--error-dark) !important;
}

/* Button styling */
.btn {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background-color: var(--accent-cta);
  color: white;
}

.btn-primary:hover {
  background-color: #5a7a1f;
}

.btn-secondary {
  background-color: transparent;
  border: 1px solid var(--accent-cta);
  color: var(--accent-cta);
}

.btn-secondary:hover {
  background-color: rgba(107, 142, 35, 0.1);
}

/* Card styling */
.card {
  background-color: var(--card-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-lg);
}

/* Alert styling */
.alert {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
}

.alert-success {
  background-color: var(--success);
  color: white;
}

.alert-error {
  background-color: var(--error-light);
  color: var(--error);
  border-left: 4px solid var(--error);
}

/* Sidebar styling */
.sidebar {
  background-color: var(--primary-ui);
  color: var(--background);
  min-height: 100vh;
  padding: var(--spacing-md);
}

.sidebar-link {
  color: var(--background);
  text-decoration: none;
  padding: var(--spacing-sm) 0;
  display: block;
}

.sidebar-link:hover {
  color: white;
}

.sidebar-link.active {
  color: white;
  font-weight: 600;
}

/* Form elements */
input,
select,
textarea {
  border: 1px solid var(--text-secondary);
  border-radius: var(--radius-sm);
  padding: 0.5rem;
  font-family: "Lato", "Open Sans", sans-serif;
  font-size: 14px;
  width: 100%;
  background-color: white;
  color: var(--text-primary);
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--accent-cta);
  box-shadow: 0 0 0 2px rgba(107, 142, 35, 0.2);
}

label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
  color: var(--text-primary);
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
