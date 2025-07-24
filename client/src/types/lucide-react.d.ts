declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';
  
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    strokeWidth?: number | string;
    color?: string;
  }
  
  export type Icon = ComponentType<IconProps>;
  
  // Common icons used in the project
  export const ArrowLeft: Icon;
  export const ArrowRight: Icon;
  export const Check: Icon;
  export const CheckCircle: Icon;
  export const ChevronDown: Icon;
  export const ChevronUp: Icon;
  export const ChevronRight: Icon;
  export const X: Icon;
  export const Plus: Icon;
  export const Minus: Icon;
  export const Edit: Icon;
  export const Edit2: Icon;
  export const Trash: Icon;
  export const Trash2: Icon;
  export const Eye: Icon;
  export const EyeOff: Icon;
  export const Download: Icon;
  export const Upload: Icon;
  export const FileText: Icon;
  export const FileUp: Icon;
  export const FileType: Icon;
  export const Printer: Icon;
  export const Mail: Icon;
  export const Lock: Icon;
  export const User: Icon;
  export const Users: Icon;
  export const Chrome: Icon;
  export const Star: Icon;
  export const Settings: Icon;
  export const Settings2: Icon;
  export const HelpCircle: Icon;
  export const Lightbulb: Icon;
  export const Monitor: Icon;
  export const RotateCcw: Icon;
  export const PlusCircle: Icon;
  export const Briefcase: Icon;
  export const GraduationCap: Icon;
  export const FolderKanban: Icon;
  export const Award: Icon;
  export const Languages: Icon;
  export const Linkedin: Icon;
  export const Globe: Icon;
  export const Car: Icon;
  export const Sparkles: Icon;
  export const TrendingUp: Icon;
  export const Sidebar: Icon;
  export const Image: Icon;
  export const Palette: Icon;
  export const Zap: Icon;
  export const Code: Icon;
  export const Layers: Icon;
  export const FileEdit: Icon;
  export const Database: Icon;
  export const Server: Icon;
  export const Shield: Icon;
  export const BookText: Icon;
  export const Search: Icon;
  export const BrainCircuit: Icon;
  
  // Add more icons as needed
  const lucideReact: {
    [key: string]: Icon;
  };
  
  export default lucideReact;
}