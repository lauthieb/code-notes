import languages from './assets/data/languages';

const converter = {
  languageToExtension(language) {
    if (languages.filter(l => l.name === language).length > 0) {
      return languages.filter(l => l.name === language)[0].extension;
    }
    return 'txt';
  }
};

export default converter;
