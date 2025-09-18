'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface Option<T> {
  value: T;
  label: string;
}

interface OptionFilterProps<T> {
  label: string;
  value?: T;
  onValueChange: (value: T) => void;
  options: Option<T>[];
  placeholder?: string;
  className?: string;
}

export function OptionFilter<T>({
  label,
  value,
  onValueChange,
  options,
  placeholder = 'Select option',
  className = 'min-w-[200px]',
}: OptionFilterProps<T>) {
  return (
    <div className={`flex ${className} flex-col gap-1`}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select
        value={value ? String(value) : ''}
        onValueChange={(stringValue: string) => {
          if (stringValue === '') {
            return; // Don't trigger change for empty value
          }
          const option = options.find(
            (opt) => String(opt.value) === stringValue,
          );
          if (option) {
            onValueChange(option.value);
          }
        }}
      >
        <SelectTrigger className="h-9 w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={String(option.value)} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
