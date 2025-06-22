// This script initializes the theme settings
document.addEventListener('DOMContentLoaded', function() {
  // Remove any high contrast settings
  document.documentElement.classList.remove('high-contrast');
  localStorage.removeItem('accessibility-preference');
  
  // Apply the base theme from the theme.css file
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const savedTheme = localStorage.getItem('theme') || systemTheme;
  
  // Apply the theme
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});
