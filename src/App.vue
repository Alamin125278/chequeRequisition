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
  /* padding: var(--spacing-md); */
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

/* Card Styles */
.role-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.role-card:hover {
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
}

/* Header Styles */
.role-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.role-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0;
}

/* Search Bar */
.role-search {
  width: 100%;
  max-width: 400px;
}

/* Table Styles */
.role-table {
  width: 100%;
}

.role-table .ant-table-thead > tr > th {
  background: #fafafa;
  font-weight: 600;
  color: #262626;
  padding: 12px 16px;
}

.role-table .ant-table-tbody > tr > td {
  padding: 12px 16px;
}

.role-table .ant-table-tbody > tr:hover {
  background: #fafafa;
}

/* Action Buttons */
.role-actions {
  display: flex;
  gap: 8px;
}

.role-btn-edit {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.role-btn-edit:hover {
  color: var(--primary-hover);
  border-color: var(--primary-hover);
}

.role-btn-delete {
  color: var(--error-color);
  border-color: var(--error-color);
}

.role-btn-delete:hover {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

/* Status Tags */
.role-tag-active {
  background: #f6ffed;
  color: var(--success-color);
  border-color: #b7eb8f;
}

.role-tag-inactive {
  background: #fff1f0;
  color: var(--error-color);
  border-color: #ffa39e;
}

.role-tag-override {
  background: #fff7e6;
  color: var(--warning-color);
  border-color: #ffd591;
}

/* Permission Checkboxes */
.role-permission-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.role-permission-item {
  min-width: 120px;
}

/* Modal Styles */
.role-modal .ant-modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.role-modal .ant-modal-body {
  padding: 24px;
}

.role-modal .ant-modal-footer {
  padding: 10px 16px;
  border-top: 1px solid #f0f0f0;
}

/* Form Styles */
.role-form-item {
  margin-bottom: 16px;
}

.role-form-label {
  font-weight: 500;
  color: #262626;
  margin-bottom: 8px;
  display: block;
}

/* Tree Select */
.role-tree-select {
  width: 100%;
}

/* Statistics Cards */
.role-stats-card {
  background: linear-gradient(
    135deg,
    var(--primary-color) 0%,
    var(--primary-active) 100%
  );
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.role-stats-number {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
}

.role-stats-label {
  font-size: 14px;
  opacity: 0.9;
}

/* Permission Matrix */
.permission-matrix {
  overflow-x: auto;
}

.permission-matrix-header {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: #fafafa;
  border-radius: 4px;
  margin-bottom: 8px;
}

.permission-matrix-row {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.permission-matrix-cell {
  flex: 1;
  min-width: 100px;
  text-align: center;
}

.permission-icon-allowed {
  color: var(--success-color);
  font-size: 18px;
}

.permission-icon-denied {
  color: #d9d9d9;
  font-size: 18px;
}

.permission-icon-override {
  color: var(--warning-color);
  font-size: 18px;
}

/* Loading State */
.role-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

/* Empty State */
.role-empty {
  text-align: center;
  padding: 48px 24px;
  color: #8c8c8c;
}

.role-empty-icon {
  font-size: 64px;
  color: #d9d9d9;
  margin-bottom: 16px;
}

.role-empty-text {
  font-size: 14px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .role-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .role-search {
    max-width: 100%;
  }

  .role-actions {
    flex-direction: column;
  }

  .permission-matrix-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .permission-matrix-cell {
    text-align: left;
    width: 100%;
  }
}

/* Utility Classes */
.role-mb-16 {
  margin-bottom: 16px;
}

.role-mt-16 {
  margin-top: 16px;
}

.role-p-24 {
  padding: 24px;
}

.role-text-center {
  text-align: center;
}

.role-flex {
  display: flex;
}

.role-flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.role-gap-8 {
  gap: 8px;
}

.role-gap-16 {
  gap: 16px;
}
</style>
