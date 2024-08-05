import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface ImageUploadProps {
  onImageUpload: (image: string | null) => void;
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState('https://pub-61f02d1ee03940ac97179fb027f0b9a2.r2.dev/image.png');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const handleImageUpload = () => {
    setIsLoading(true);
    setError(null);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setIsLoading(false);
      setIsLoaded(true);
      onImageUpload(imageUrl);
    };
    img.onerror = () => {
      setIsLoading(false);
      setError('Falha ao carregar a imagem. Verifique a URL e tente novamente. Se o erro persistir, tente hospedar a imagem em outro serviço.');
      onImageUpload(null);
    };
    img.src = imageUrl;
  };

  return (
    <div className="my-4">
      <Input
        type="text"
        value={imageUrl}
        onChange={(e) => {
          setImageUrl(e.target.value);
          setIsLoaded(false);
        }}
        placeholder="Cole a URL da imagem aqui"
        className="block w-full p-2.5 text-sm"
      />
      
      <Button
        onClick={handleImageUpload}
        disabled={isLoading || isLoaded}
        className="mt-2 px-4 py-2"
      >
        {isLoaded ? 'Imagem Carregada' : (isLoading ? 'Carregando...' : 'Carregar Imagem')}
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};