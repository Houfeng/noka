module.exports = {
  content: ["./views/**/*.html"],
  plugins: [
    require("daisyui"),
    require('@tailwindcss/typography'),
  ],
  daisyui: {
    themes: [
      "night",
      "winter",
      "retro",
      "coffee"
    ],
  },
  theme: {}
}