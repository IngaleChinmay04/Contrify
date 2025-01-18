function generateFileExtensionRegex(languages) {
  const languageExtensions = {
    JavaScript: "js",
    Python: "py",
    Java: "java",
    "C++": "cpp",
    C: "c",
    "C#": "cs",
    HTML: "html",
    CSS: "css",
    PHP: "php",
    Ruby: "rb",
    Go: "go",
    Swift: "swift",
    Kotlin: "kt",
    TypeScript: "ts",
    Shell: "sh",
    R: "r",
    Perl: "pl",
    Rust: "rs",
    Scala: "scala",
    Haskell: "hs",
    Lua: "lua",
  };

  const extensions = languages
    .map((lang) => languageExtensions[lang])
    .filter((ext) => ext);
  if (extensions.length === 0) {
    return null;
  }
  return new RegExp(`\\.(${extensions.join("|")})$`);
}

module.exports = { generateFileExtensionRegex };
