import { useState } from 'react';
import { AyahInput } from '@/components/AyahInput';
import { DesignControls } from '@/components/DesignControls';
import { PreviewCanvas } from '@/components/PreviewCanvas';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen } from 'lucide-react';

const Index = () => {
  const [ayah, setAyah] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ratio, setRatio] = useState<'1:1' | '4:5' | '9:16'>('1:1');
  const [design, setDesign] = useState({
    arabicFontSize: 32,
    englishFontSize: 18,
    textColor: '#1a365d',
    backgroundColor: '#f7fafc',
    backgroundImage: null
  });

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Qur'an Quote Generator
              </h1>
              <p className="text-sm text-muted-foreground">
                Create beautiful social media posts with Qur'an verses
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-6">
              <AyahInput 
                onAyahFetched={setAyah}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
              
              <Separator />
              
              <DesignControls 
                design={design}
                onDesignChange={setDesign}
              />
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-3">
            <div className="sticky top-32">
              <PreviewCanvas 
                ayah={ayah}
                design={design}
                ratio={ratio}
                onRatioChange={setRatio}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card/50 mt-16">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            May Allah accept this humble effort to spread His words
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
