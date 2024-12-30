import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface ExerciseInstructionsProps {
  instructions: string[];
  onChange: (instructions: string[]) => void;
}

export default function ExerciseInstructions({ instructions, onChange }: ExerciseInstructionsProps) {
  const addInstruction = () => onChange([...instructions, '']);
  const removeInstruction = (index: number) => {
    onChange(instructions.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">Instructions</label>
        <button
          type="button"
          onClick={addInstruction}
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      {instructions.map((instruction, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            value={instruction}
            onChange={(e) => {
              const newInstructions = [...instructions];
              newInstructions[index] = e.target.value;
              onChange(newInstructions);
            }}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={`Step ${index + 1}`}
          />
          <button
            type="button"
            onClick={() => removeInstruction(index)}
            className="text-gray-400 hover:text-red-500"
          >
            <Minus className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
}