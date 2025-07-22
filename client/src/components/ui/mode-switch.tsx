import React from "react";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface ModeSwitchProps {
  onModeChange?: (mode: "light" | "pro") => void;
}

export function ModeSwitch({ onModeChange }: ModeSwitchProps) {
  const [isProMode, setIsProMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedMode = localStorage.getItem("resumeBuilderMode");
    if (savedMode) {
      setIsProMode(savedMode === "pro");
    }
  }, []);

  const handleModeChange = (checked: boolean) => {
    if (checked) {
      // Here you would check for pro access
      const hasProAccess = false; // Replace with actual check
      if (!hasProAccess) {
        toast({
          title: "Pro Access Required",
          description: "Upgrade to access advanced resume building features.",
          variant: "destructive",
        });
        return;
      }
    }
    
    const newMode = checked ? "pro" : "light";
    setIsProMode(checked);
    localStorage.setItem("resumeBuilderMode", newMode);
    onModeChange?.(newMode);
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="mode-switch"
        checked={isProMode}
        onCheckedChange={handleModeChange}
      />
      <Label htmlFor="mode-switch" className="text-sm font-medium">
        {isProMode ? "Pro Suite" : "Simple Builder"}
      </Label>
    </div>
  );
}
