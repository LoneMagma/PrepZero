import { createContext, useContext } from 'react'

export const lightColors = {
  bg:      '#ede9e3',
  surf:    '#f7f4f0',
  surfAlt: '#f0ece5',
  ink:     '#2c2825',
  sage:    '#6b8f72',
  sageDk:  '#5a7d61',
  sageLt:  '#e8f0ea',
  terra:   '#c17f60',
  terraLt: '#f5e8df',
  muted:   '#8a7d72',
  faint:   '#b0a298',
  border:  '#ddd5cb',
  soft:    '#e6dfd7',
  navBg:   'rgba(247,244,240,0.92)',
  shadow:  'rgba(44,40,37,0.1)',
  shadowMd:'rgba(44,40,37,0.14)',
}

export const darkColors = {
  bg:      '#1c1916',
  surf:    '#252119',
  surfAlt: '#2e2a24',
  ink:     '#ede8e0',
  sage:    '#7aaa82',
  sageDk:  '#6b9872',
  sageLt:  '#1e2d22',
  terra:   '#d4916e',
  terraLt: '#2c1e18',
  muted:   '#9a8e82',
  faint:   '#6a5f57',
  border:  '#3d3630',
  soft:    '#2e2a26',
  navBg:   'rgba(28,25,22,0.94)',
  shadow:  'rgba(0,0,0,0.25)',
  shadowMd:'rgba(0,0,0,0.35)',
}

const ThemeCtx = createContext({ C: lightColors, dark: false })
export const useTheme = () => useContext(ThemeCtx)
export default ThemeCtx
