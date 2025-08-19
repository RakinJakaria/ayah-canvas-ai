import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Palette, Type, Image as ImageIcon, Upload, MoreHorizontal } from 'lucide-react';

interface DesignControlsProps {
  design: {
    arabicFontSize: number;
    englishFontSize: number;
    textColor: string;
    backgroundColor: string;
    backgroundImage: string | null;
  };
  onDesignChange: (design: any) => void;
}

export const DesignControls = ({ design, onDesignChange }: DesignControlsProps) => {
  const [imageSearch, setImageSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMoreImages, setHasMoreImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateDesign = (updates: Partial<typeof design>) => {
    onDesignChange({ ...design, ...updates });
  };

  const searchUnsplash = async (page: number = 1) => {
    if (!imageSearch.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(imageSearch)}&per_page=12&page=${page}&client_id=5x9TZKKhbSb-2KKhrHK9XQ84ZDkzNSCh8fHZ_P3JrZc`
      );
      const data = await response.json();
      
      if (page === 1) {
        setSearchResults(data.results || []);
      } else {
        setSearchResults(prev => [...prev, ...(data.results || [])]);
      }
      
      setCurrentPage(page);
      setTotalPages(data.total_pages || 0);
      setHasMoreImages(page < (data.total_pages || 0));
    } catch (error) {
      console.error('Failed to search images:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const loadMoreImages = () => {
    if (hasMoreImages && !isSearching) {
      searchUnsplash(currentPage + 1);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateDesign({ backgroundImage: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const presetThemes = [
    {
      name: 'Classic',
      arabicFontSize: 32,
      englishFontSize: 18,
      textColor: '#1a365d',
      backgroundColor: '#f7fafc'
    },
    {
      name: 'Golden',
      arabicFontSize: 36,
      englishFontSize: 20,
      textColor: '#744210',
      backgroundColor: '#fffbeb'
    },
    {
      name: 'Emerald',
      arabicFontSize: 34,
      englishFontSize: 19,
      textColor: '#064e3b',
      backgroundColor: '#f0fdf4'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Typography Controls */}
      <Card className="p-6 space-y-4 shadow-card">
        <div className="flex items-center gap-2 text-primary">
          <Type className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Typography</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Arabic Font Size</Label>
            <Slider
              value={[design.arabicFontSize]}
              onValueChange={([value]) => updateDesign({ arabicFontSize: value })}
              min={24}
              max={48}
              step={2}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground text-center">
              {design.arabicFontSize}px
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">English Font Size</Label>
            <Slider
              value={[design.englishFontSize]}
              onValueChange={([value]) => updateDesign({ englishFontSize: value })}
              min={14}
              max={28}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground text-center">
              {design.englishFontSize}px
            </div>
          </div>
        </div>
      </Card>

      {/* Color Controls */}
      <Card className="p-6 space-y-4 shadow-card">
        <div className="flex items-center gap-2 text-primary">
          <Palette className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Colors</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Text Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={design.textColor}
                onChange={(e) => updateDesign({ textColor: e.target.value })}
                className="w-12 h-10 p-1 rounded-md"
              />
              <Input
                value={design.textColor}
                onChange={(e) => updateDesign({ textColor: e.target.value })}
                className="flex-1 text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Background</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={design.backgroundColor}
                onChange={(e) => updateDesign({ backgroundColor: e.target.value })}
                className="w-12 h-10 p-1 rounded-md"
              />
              <Input
                value={design.backgroundColor}
                onChange={(e) => updateDesign({ backgroundColor: e.target.value })}
                className="flex-1 text-xs font-mono"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Background Image */}
      <Card className="p-6 space-y-4 shadow-card">
        <div className="flex items-center gap-2 text-primary">
          <ImageIcon className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Background Image</h3>
        </div>

        <div className="space-y-3">
          {/* Upload and Search Options */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Image
            </Button>
            <Button 
              onClick={() => searchUnsplash(1)} 
              variant="outline"
              disabled={isSearching || !imageSearch.trim()}
              className="flex items-center gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              {isSearching ? 'Searching...' : 'Search Online'}
            </Button>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Search input */}
          <Input
            placeholder="Search Islamic art, nature, calligraphy..."
            value={imageSearch}
            onChange={(e) => setImageSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchUnsplash(1)}
          />

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {searchResults.map((image) => (
                  <div
                    key={image.id}
                    className="cursor-pointer rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                    onClick={() => updateDesign({ backgroundImage: image.urls.regular })}
                  >
                    <img
                      src={image.urls.small}
                      alt={image.alt_description}
                      className="w-full h-20 object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMoreImages && (
                <Button
                  onClick={loadMoreImages}
                  variant="outline"
                  size="sm"
                  disabled={isSearching}
                  className="w-full flex items-center gap-2"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  {isSearching ? 'Loading...' : 'Load More Images'}
                </Button>
              )}

              <div className="text-xs text-muted-foreground text-center">
                Showing {searchResults.length} images {hasMoreImages && `(Page ${currentPage} of ${totalPages})`}
              </div>
            </div>
          )}
          
          {/* Remove Background Button */}
          {design.backgroundImage && (
            <Button
              onClick={() => updateDesign({ backgroundImage: null })}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Remove Background Image
            </Button>
          )}
        </div>
      </Card>

      {/* Preset Themes */}
      <Card className="p-6 space-y-4 shadow-card">
        <h3 className="text-lg font-semibold text-primary">Preset Themes</h3>
        <div className="grid grid-cols-3 gap-2">
          {presetThemes.map((theme) => (
            <Button
              key={theme.name}
              onClick={() => updateDesign(theme)}
              variant="outline"
              size="sm"
              className="h-auto py-3 flex flex-col"
            >
              <div
                className="w-full h-8 rounded mb-2"
                style={{ backgroundColor: theme.backgroundColor }}
              />
              <span className="text-xs">{theme.name}</span>
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};