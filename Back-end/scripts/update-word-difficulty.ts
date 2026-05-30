import axios from 'axios';

const HOST = 'https://learning-english-app-g5j7.onrender.com'; // thay bằng host của bạn

interface Word {
  engMeaning: string;
  vnMeaning: string;
  wordKind: string[];
  category: string | null;
  synonyms: string[] | null;
  difficulty: number;
}

async function main() {
  try {
    // Lấy toàn bộ từ vựng
    const { data } = await axios.get<{ words: Word[] }>(`${HOST}/words`);

    const words = data.words;

    console.log(`Found ${words.length} words`);

    for (const word of words) {
      try {
        await axios.put(`${HOST}/words`, {
          engMeaning: word.engMeaning,
          newEngMeaning: word.engMeaning,
          vnMeaning: word.vnMeaning,
          wordKind: word.wordKind,
          category: word.category,
        });

        console.log(`✓ Updated: ${word.engMeaning}`);
      } catch (error) {
        console.error(`✗ Failed: ${word.engMeaning}`, error);
        break;
      }
    }

    console.log('Done');
  } catch (error) {
    console.error('Failed to fetch words', error);
  }
}

main();
