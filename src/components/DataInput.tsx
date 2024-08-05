import React, { useState } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

interface DataInputProps {
  onDataSubmit: (data: any) => void;
  onObjectTypeSubmit: (objectType: string) => void;
}

export function DataInput({ onDataSubmit, onObjectTypeSubmit }: DataInputProps) {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [objectType, setObjectType] = useState<string>('');

  const handleSubmit = () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      onDataSubmit(parsedData);
      onObjectTypeSubmit(objectType);
    } catch (error) {
      alert('Invalid JSON');
    }
  };

  return (
    <div className="my-4">
      <Textarea
        value={jsonInput}
        onChange={(e: any) => setJsonInput(e.target.value)}
        placeholder="Cole o JSON aqui"
        className="block w-full p-2.5"
        rows={10}
      />

      <Input
        type="text"
        value={objectType}
        onChange={(e: any) => setObjectType(e.target.value)}
        placeholder="Tipo de objeto"
        className="block w-full p-2.5 mt-2"
      />
      
      <Button onClick={handleSubmit} className="mt-2">
        Enviar
      </Button>
    </div>
  );
};