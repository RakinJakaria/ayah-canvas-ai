interface QuranResponse {
  data: {
    text: string;
    surah: {
      number: number;
      name: string;
      englishName: string;
      englishNameTranslation: string;
    };
    numberInSurah: number;
  };
}

interface AyahData {
  arabic: string;
  english: string;
  reference: string;
  surahName: string;
  surahNameEnglish: string;
}

export class QuranAPI {
  private static readonly BASE_URL = 'https://api.alquran.cloud/v1/ayah';

  static async getAyah(surah: number, ayah: number): Promise<AyahData> {
    try {
      // Fetch Arabic text (Uthmani script)
      const arabicResponse = await fetch(
        `${this.BASE_URL}/${surah}:${ayah}/quran-uthmani`
      );
      
      // Fetch English translation 
      const englishResponse = await fetch(
        `${this.BASE_URL}/${surah}:${ayah}/en.asad`
      );

      if (!arabicResponse.ok || !englishResponse.ok) {
        throw new Error('Failed to fetch verse');
      }

      const arabicData: QuranResponse = await arabicResponse.json();
      const englishData: QuranResponse = await englishResponse.json();

      return {
        arabic: arabicData.data.text,
        english: englishData.data.text,
        reference: `${surah}:${ayah}`,
        surahName: arabicData.data.surah.name,
        surahNameEnglish: arabicData.data.surah.englishName
      };
    } catch (error) {
      console.error('Error fetching Quran verse:', error);
      throw new Error('Could not fetch the verse. Please check the reference and try again.');
    }
  }

  static parseReference(reference: string): { surah: number; ayah: number } | null {
    const match = reference.match(/^(\d+):(\d+)$/);
    if (!match) return null;
    
    const surah = parseInt(match[1]);
    const ayah = parseInt(match[2]);
    
    if (surah < 1 || surah > 114 || ayah < 1) return null;
    
    return { surah, ayah };
  }

  static getPopularVerses() {
    return [
      { reference: '2:255', name: 'Ayat al-Kursi' },
      { reference: '1:1-7', name: 'Al-Fatiha' },
      { reference: '112:1-4', name: 'Al-Ikhlas' },
      { reference: '2:286', name: 'Last verse of Al-Baqarah' },
      { reference: '3:26-27', name: 'Dua from Ali Imran' }
    ];
  }
}