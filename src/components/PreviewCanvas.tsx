import { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Square, Smartphone, Monitor } from 'lucide-react';

interface PreviewCanvasProps {
  ayah: {
    arabic: string;
    english: string;
    reference: string;
    surahNameEnglish: string;
  } | null;
  design: {
    arabicFontSize: number;
    englishFontSize: number;
    textColor: string;
    backgroundColor: string;
    backgroundImage: string | null;
  };
  ratio: '1:1' | '4:5' | '9:16';
  onRatioChange: (ratio: '1:1' | '4:5' | '9:16') => void;
}

export const PreviewCanvas = ({ ayah, design, ratio, onRatioChange }: PreviewCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [backgroundImageLoaded, setBackgroundImageLoaded] = useState<HTMLImageElement | null>(null);

  const ratioConfigs = {
    '1:1': { width: 1080, height: 1080, icon: Square, label: 'Instagram Post' },
    '4:5': { width: 1080, height: 1350, icon: Smartphone, label: 'Instagram Portrait' },
    '9:16': { width: 1080, height: 1920, icon: Monitor, label: 'Story' }
  };

  const currentConfig = ratioConfigs[ratio];

  // Load background image when design.backgroundImage changes
  useEffect(() => {
    if (design.backgroundImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setBackgroundImageLoaded(img);
      };
      img.onerror = () => {
        console.error('Failed to load background image');
        setBackgroundImageLoaded(null);
      };
      img.src = design.backgroundImage;
    } else {
      setBackgroundImageLoaded(null);
    }
  }, [design.backgroundImage]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !ayah) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = currentConfig.width;
    canvas.height = currentConfig.height;

    // Draw background
    if (backgroundImageLoaded) {
      // Draw background image
      ctx.drawImage(backgroundImageLoaded, 0, 0, canvas.width, canvas.height);
      
      // Add a semi-transparent overlay for better text readability
      ctx.fillStyle = design.backgroundColor + '80'; // Add transparency
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      // Draw solid background color
      ctx.fillStyle = design.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Set text properties
    ctx.fillStyle = design.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const padding = 80;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw Arabic text
    ctx.font = `${design.arabicFontSize * 2}px Amiri, serif`;
    ctx.direction = 'rtl';
    
    const arabicLines = wrapText(ctx, ayah.arabic, canvas.width - padding * 2);
    const arabicHeight = arabicLines.length * design.arabicFontSize * 2.5;
    
    let currentY = centerY - arabicHeight / 2;
    arabicLines.forEach((line) => {
      ctx.fillText(line, centerX, currentY);
      currentY += design.arabicFontSize * 2.5;
    });

    // Draw English text
    ctx.direction = 'ltr';
    ctx.font = `${design.englishFontSize * 2}px Poppins, sans-serif`;
    
    const englishLines = wrapText(ctx, ayah.english, canvas.width - padding * 2);
    currentY += 40;
    
    englishLines.forEach((line) => {
      ctx.fillText(line, centerX, currentY);
      currentY += design.englishFontSize * 2.2;
    });

    // Draw reference
    currentY += 40;
    ctx.font = `${design.englishFontSize * 1.2}px Poppins, sans-serif`;
    ctx.globalAlpha = 0.8;
    ctx.fillText(`Quran ${ayah.reference} - ${ayah.surahNameEnglish}`, centerX, currentY);
    ctx.globalAlpha = 1;
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `quran-${ayah?.reference || 'verse'}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  useEffect(() => {
    drawCanvas();
  }, [ayah, design, ratio, backgroundImageLoaded]);

  const scale = 0.3; // Scale down for preview

  return (
    <Card className="p-6 space-y-6 shadow-card">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-primary">Live Preview</h2>
        
        {/* Ratio Selection */}
        <div className="flex gap-2">
          {Object.entries(ratioConfigs).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <Button
                key={key}
                onClick={() => onRatioChange(key as any)}
                variant={ratio === key ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{config.label}</span>
                <span className="text-xs">{key}</span>
              </Button>
            );
          })}
        </div>

        {/* Canvas Preview */}
        <div 
          ref={containerRef}
          className="flex justify-center items-center bg-muted/20 rounded-lg p-4 min-h-[400px]"
        >
          {ayah ? (
            <canvas
              ref={canvasRef}
              style={{
                width: currentConfig.width * scale,
                height: currentConfig.height * scale,
                maxWidth: '100%',
                maxHeight: '60vh',
                objectFit: 'contain',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                background: 'white'
              }}
            />
          ) : (
            <div className="text-center text-muted-foreground p-8">
              <div className="w-16 h-16 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Square className="h-8 w-8" />
              </div>
              <p>Enter a verse reference to see preview</p>
            </div>
          )}
        </div>

        {/* Export Options */}
        {ayah && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Export Quality</span>
              <span className="text-xs text-muted-foreground">
                {currentConfig.width} × {currentConfig.height}px
              </span>
            </div>
            <Button 
              onClick={downloadImage}
              variant="gradient"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PNG
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
