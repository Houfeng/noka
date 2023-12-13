module.exports = {
  content: ["./views/**/*.html", "./app/**/*.tsx"],
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