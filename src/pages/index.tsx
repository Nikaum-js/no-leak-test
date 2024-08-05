import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { DataInput } from '@/components/DataInput';
import { Heatmap } from '@/components/Heatmap';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [objectType, setObjectType] = useState<string>('');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-2">
      <h1 className="text-3xl font-bold">Mapa de Calor</h1>
      <div className="w-full max-w-4xl p-4">
        <ImageUpload onImageUpload={setImage} />
        <DataInput onDataSubmit={setData} onObjectTypeSubmit={setObjectType} />

        {image && data && (
          <Heatmap image={image} data={data} objectType={objectType} />
        )}
      </div>
    </div>
  );
};