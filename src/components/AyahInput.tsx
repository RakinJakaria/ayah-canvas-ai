import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Search, BookOpen } from 'lucide-react';
import { QuranAPI } from '@/services/quranApi';
import { useToast } from '@/hooks/use-toast';

interface AyahInputProps {
  onAyahFetched: (ayah: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const AyahInput = ({ onAyahFetched, isLoading, setIsLoading }: AyahInputProps) => {
  const [reference, setReference] = useState('');
  const { toast } = useToast();

  const fetchAyah = async (ref: string) => {
    const parsed = QuranAPI.parseReference(ref);
    if (!parsed) {
      toast({
        title: "Invalid Reference",
        description: "Please enter in format: surah:ayah (e.g., 2:255)",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const ayahData = await QuranAPI.getAyah(parsed.surah, parsed.ayah);
      onAyahFetched(ayahData);
      toast({
        title: "Verse Loaded",
        description: `${ayahData.surahNameEnglish} ${ayahData.reference}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch verse",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reference.trim()) {
      fetchAyah(reference.trim());
    }
  };

  return (
    <Card className="p-6 space-y-6 shadow-card">
      <div className="flex items-center gap-2 text-primary">
        <BookOpen className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Ayah Selection</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reference" className="text-sm font-medium">
            Enter Surah:Ayah Reference
          </Label>
          <div className="flex gap-2">
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g., 2:255"
              className="flex-1 font-english"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !reference.trim()}
              variant="gradient"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};