import languages from "./assets/data/languages";

const converter = {
  filenameToKey(filename, language, type = "note") {
    // Build separator by type
    const separator = type === "gist" ? "." : "-";

    // Sanitize name for disallowed nedb characters
    // list of disallowed characters taken from https://github.com/louischatriot/nedb/issues/477
    let name = filename;
    if (type === "note" && typeof name === "string") {
      name = name.replace(/[.$]/, "_");
    }

    return `${name}${separator}${this.languageToExtension(language)}`;
  },
  languageToExtension(language) {
    if (languages.filter(l => l.name === language).length > 0) {
      return languages.filter(l => l.name === language)[0].extension;
    }
    return "txt";
  },
  extensionToLanguage(extension) {
    if (languages.filter(l => l.extension === extension).length > 0) {
      return languages.filter(l => l.extension === extension)[0].name;
    }
    return "text";
  },
  gistToNote(gist) {
    const files = [];

    Object.keys(gist.files).forEach(key => {
      files.push({
        name: key.split(".")[0],
        language: this.extensionToLanguage(key.split(".")[1]),
        content: gist.files[key].content
      });
    });

    return {
      id: gist.id,
      url: gist.html_url,
      public: gist.public,
      name: "Gist",
      description: gist.description,
      files
    };
  },
  noteToGist(note) {
    const files = {};
    Object.keys(note.files).forEach(key => {
      files[
        `${note.files[key].name}.${this.languageToExtension(
          note.files[key].language
        )}`
      ] = {
        content: note.files[key].content
      };
    });

    return {
      id: note.id,
      public: note.public,
      description: `${note.name} - ${note.description}`,
      files
    };
  }
};

export default converter;
