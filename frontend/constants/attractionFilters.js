export const ATTRACTION_FILTERS = {
  all: {
    label: "All",
    match: () => true,
  },

  historic: {
    label: "Historic",
    match: (category) =>
      category.includes("historic") ||
      category.includes("castle") ||
      category.includes("monument") ||
      category.includes("memorial"),
  },

  manMade: {
    label: "Man-made",
    match: (category) =>
      category.includes("building") ||
      category.includes("tower") ||
      category.includes("architecture"),
  },

  nature: {
    label: "Nature",
    match: (category) =>
      category.includes("park") ||
      category.includes("garden") ||
      category.includes("natural"),
  },

  wheelchair: {
    label: "Wheelchair Accessible",
    match: (category) => category.includes("wheelchair"),
  },
};
