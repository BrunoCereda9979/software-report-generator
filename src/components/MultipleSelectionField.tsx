import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from "@/components/ui/select";
import { PlusCircle, X } from 'lucide-react';

interface Item {
    id: number;
    name: string;
}

interface MultipleSelectionFieldProps {
    label: string;
    items: Item[];
    selectedItems: Item[];
    onChange: (newItems: Item[]) => void;
}

const MultipleSelectionField: React.FC<MultipleSelectionFieldProps> = ({
    label,
    items,
    selectedItems = [],
    onChange,
}) => {
    const [localSelectedItems, setLocalSelectedItems] = useState<Item[]>(selectedItems);

    // Keep local state in sync with the parent component
    useEffect(() => {
        setLocalSelectedItems(selectedItems);
    }, [selectedItems]);

    const handleAddItem = () => {
        const newItems = [...localSelectedItems, { id: -1, name: '' }];
        setLocalSelectedItems(newItems);
        onChange(newItems);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = localSelectedItems.filter((_, i) => i !== index);
        setLocalSelectedItems(newItems);
        onChange(newItems);
    };

    const handleSelectItem = (value: string, index: number) => {
        const selectedItem = items.find(item => item.name === value);

        if (selectedItem) {
            const newItems = [...localSelectedItems];
            newItems[index] = selectedItem;
            setLocalSelectedItems(newItems);
            onChange(newItems);
        }
    };

    return (
        <div className="grid grid-cols-4 items-start gap-4">
            <label className="text-right text-sm font-medium mt-2">{label}</label>
            <div className="col-span-3 space-y-2">
                {localSelectedItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Select
                            value={item.name || ''}
                            onValueChange={(value) => handleSelectItem(value, index)}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                                {items.map(opt => (
                                    <SelectItem
                                        key={opt.id}
                                        value={opt.name}
                                        disabled={localSelectedItems.some(sel => sel.id === opt.id)}
                                    >
                                        {opt.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(index)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}

                <Button type="button" variant="outline" onClick={handleAddItem}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add {label}
                </Button>
            </div>
        </div>
    );
};

export default MultipleSelectionField;
