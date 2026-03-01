const styleMap = {
  "card":           ["border-2 border-gray-400", "rounded-2xl shadow-sm border border-slate-200"],
  "modal":          ["border-2 border-gray-400", "rounded-2xl shadow-lg"],
  "input":          ["border-2 border-gray-400 bg-white", "rounded-xl border border-slate-200 bg-slate-50"],
  "input-inline":   ["border-2 border-gray-400", "rounded-lg border border-blue-300"],
  "btn-primary":    ["bg-blue-600 border-2 border-blue-800", "rounded-xl bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-colors"],
  "btn-secondary":  ["border-2 border-gray-400", "rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"],
  "btn-outline":    ["border-2 border-gray-400 hover:bg-blue-50", "rounded-xl hover:bg-blue-50 transition-colors"],
  "btn-icon":       ["", "transition-colors"],
  "row":            ["", "rounded-xl transition-colors"],
  "row-hover":      ["", "hover:bg-slate-50"],
  "checkbox":       ["", "rounded-lg transition-colors"],
  "border-subtle":  ["border-gray-400", "border-slate-200"],
  "sidebar-border": ["border-r-2 border-gray-400", "border-r border-slate-200"],
  "hover-reveal":   ["", "opacity-0 group-hover:opacity-100 transition-opacity"],
  "badge":          ["border border-gray-400", "rounded-full bg-slate-100"],
  "btn-export":     ["border-2 border-gray-400", "rounded-xl border border-slate-200 hover:bg-white hover:border-slate-300 transition-colors"],
  "barebones-toggle": ["border-2 border-gray-400 text-gray-600", "rounded-xl text-slate-500 hover:text-slate-700 transition-colors"],
  "tooltip":          ["border border-gray-400 bg-white text-gray-800", "rounded-lg bg-slate-800 text-white shadow-lg"],
  "kbd":              ["border border-gray-400 bg-gray-100 text-gray-600", "rounded bg-slate-600 text-slate-200"],
} as const;

export function s(barebones: boolean, key: keyof typeof styleMap): string {
  return styleMap[key][barebones ? 0 : 1];
}
