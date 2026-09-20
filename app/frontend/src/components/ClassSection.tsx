import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface ClassSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function ClassSection({ title, icon, children, defaultOpen = false }: ClassSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader
        className="cursor-pointer flex flex-row items-center justify-between py-4 px-6 bg-lavender/50 hover:bg-lavender transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="text-purple">{icon}</div>
          <CardTitle className="font-heading text-lg">{title}</CardTitle>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </CardHeader>
      {isOpen && <CardContent className="pt-4 pb-6 px-6">{children}</CardContent>}
    </Card>
  );
}

interface ChecklistItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ChecklistItem({ label, checked, onChange }: ChecklistItemProps) {
  return (
    <label className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-lavender/30 cursor-pointer transition-colors">
      <Checkbox
        checked={checked}
        onCheckedChange={onChange}
        className="border-purple data-[state=checked]:bg-purple data-[state=checked]:border-purple"
      />
      <span className={`text-sm ${checked ? 'line-through text-muted-foreground' : ''}`}>
        {label}
      </span>
    </label>
  );
}