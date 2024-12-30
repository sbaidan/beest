import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface ExerciseEquipmentProps {
  equipment: string[];
  onChange: (equipment: string[]) => void;
}

export default function ExerciseEquipment({ equipment, onChange }: ExerciseEquipmentProps) {
  const addEquipment = () => onChange([...equipment, '']);
  const removeEquipment = (index: number) => {
    onChange(equipment.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">Equipment Needed</label>
        <button
          type="button"
          onClick={addEquipment}
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      {equipment.map((item, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const newEquipment = [...equipment];
              newEquipment[index] = e.target.value;
              onChange(newEquipment);
            }}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., Dumbbells"
          />
          <button
            type="button"
            onClick={() => removeEquipment(index)}
            className="text-gray-400 hover:text-red-500"
          >
            <Minus className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
}