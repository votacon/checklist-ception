const styleMap = {
  "card":           ["border border-black", "rounded-2xl shadow-sm border border-slate-200"],
  "modal":          ["border border-black", "rounded-2xl shadow-lg"],
  "input":          ["border border-black bg-white", "rounded-xl border border-slate-200 bg-slate-50"],
  "input-inline":   ["border border-black", "rounded-lg border border-blue-300"],
  "btn-primary":    ["bg-blue-600 border border-blue-800", "rounded-xl bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-colors"],
  "btn-secondary":  ["border border-black", "rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"],
  "btn-outline":    ["border border-black hover:bg-blue-50", "rounded-xl hover:bg-blue-50 transition-colors"],
  "btn-icon":       ["", "transition-colors"],
  "row":            ["", "rounded-xl transition-colors"],
  "row-hover":      ["", "hover:bg-slate-50"],
  "checkbox":       ["", "rounded-lg transition-colors"],
  "border-subtle":  ["border-black", "border-slate-200"],
  "sidebar-border": ["border-r border-black", "border-r border-slate-200"],
  "hover-reveal":   ["", "opacity-0 group-hover:opacity-100 transition-opacity"],
  "badge":          ["border border-black", "rounded-full bg-slate-100"],
  "btn-export":     ["border border-black", "rounded-xl border border-slate-200 hover:bg-white hover:border-slate-300 transition-colors"],
  "barebones-toggle": ["border border-black text-gray-600", "rounded-xl text-slate-500 hover:text-slate-700 transition-colors"],
  "tooltip":          ["border border-black bg-white text-gray-800", "rounded-lg bg-slate-800 text-white shadow-lg"],
  "kbd":              ["border border-black bg-gray-100 text-gray-600", "rounded bg-slate-600 text-slate-200"],
} as const;

export function s(barebones: boolean, key: keyof typeof styleMap): string {
  return styleMap[key][barebones ? 0 : 1];
}
