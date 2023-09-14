
export interface ErrorResponse {
    title: string;
    message: string;
    resolution: string;
  }
  
  export interface WordData {
    word: string;
    phonetic?: string;
    phonetics: {
      audio: string;
      sourceUrl: string;
      license: {
        name: string;
        url: string;
      };
      text?: string;
    }[];
    meanings: {
      partOfSpeech: string;
      definitions: {
        definition: string;
        synonyms: string[];
        antonyms: string[];
        example?: string;
      }[];
      synonyms: string[];
      antonyms: string[];
    }[];
    license: {
      name: string;
      url: string;
    };
    sourceUrls: string[];
  }
  