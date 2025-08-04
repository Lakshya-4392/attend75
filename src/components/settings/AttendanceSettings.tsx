import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AttendanceSettingsState {
  defaultRequiredAttendance: number;
  includeDutyLeaves: boolean;
  showWarningAt: number;
  showCriticalAt: number;
  autoMarkWeekends: boolean;
  notificationsEnabled: boolean;
  reminderTime: string;
}

export function AttendanceSettings() {
  const [settings, setSettings] = useState<AttendanceSettingsState>({
    defaultRequiredAttendance: 75,
    includeDutyLeaves: true,
    showWarningAt: 80,
    showCriticalAt: 75,
    autoMarkWeekends: false,
    notificationsEnabled: true,
    reminderTime: "09:00"
  });

  const handleSave = () => {
    // Save settings to localStorage or API
    localStorage.setItem('attendanceSettings', JSON.stringify(settings));
    console.log('Settings saved:', settings);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Preferences</CardTitle>
        <CardDescription>
          Configure your attendance tracking preferences and thresholds
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Default Required Attendance */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Default Required Attendance</Label>
            <Badge variant="secondary">{settings.defaultRequiredAttendance}%</Badge>
          </div>
          <Slider
            value={[settings.defaultRequiredAttendance]}
            onValueChange={(value) => setSettings(prev => ({ 
              ...prev, 
              defaultRequiredAttendance: value[0] 
            }))}
            max={100}
            min={50}
            step={5}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            This will be the default attendance requirement for new subjects
          </p>
        </div>

        {/* Warning Thresholds */}
        <div className="space-y-4">
          <Label>Alert Thresholds</Label>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Show warning at</Label>
              <Badge variant="outline" className="text-warning border-warning">
                {settings.showWarningAt}%
              </Badge>
            </div>
            <Slider
              value={[settings.showWarningAt]}
              onValueChange={(value) => setSettings(prev => ({ 
                ...prev, 
                showWarningAt: value[0] 
              }))}
              max={100}
              min={70}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Show critical at</Label>
              <Badge variant="destructive">
                {settings.showCriticalAt}%
              </Badge>
            </div>
            <Slider
              value={[settings.showCriticalAt]}
              onValueChange={(value) => setSettings(prev => ({ 
                ...prev, 
                showCriticalAt: value[0] 
              }))}
              max={settings.showWarningAt}
              min={50}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Include Duty Leaves in Attendance</Label>
              <p className="text-xs text-muted-foreground">
                Count duty leaves as present when calculating percentages
              </p>
            </div>
            <Switch
              checked={settings.includeDutyLeaves}
              onCheckedChange={(checked) => setSettings(prev => ({ 
                ...prev, 
                includeDutyLeaves: checked 
              }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-mark Weekends</Label>
              <p className="text-xs text-muted-foreground">
                Automatically skip weekend days in attendance tracking
              </p>
            </div>
            <Switch
              checked={settings.autoMarkWeekends}
              onCheckedChange={(checked) => setSettings(prev => ({ 
                ...prev, 
                autoMarkWeekends: checked 
              }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Daily Reminders</Label>
              <p className="text-xs text-muted-foreground">
                Get notified about today's classes and attendance status
              </p>
            </div>
            <Switch
              checked={settings.notificationsEnabled}
              onCheckedChange={(checked) => setSettings(prev => ({ 
                ...prev, 
                notificationsEnabled: checked 
              }))}
            />
          </div>
        </div>

        {/* Reminder Time */}
        {settings.notificationsEnabled && (
          <div className="space-y-2">
            <Label htmlFor="reminderTime">Daily Reminder Time</Label>
            <Input
              id="reminderTime"
              type="time"
              value={settings.reminderTime}
              onChange={(e) => setSettings(prev => ({ 
                ...prev, 
                reminderTime: e.target.value 
              }))}
              className="w-32"
            />
          </div>
        )}

        {/* Save Button */}
        <div className="pt-4">
          <Button onClick={handleSave} className="w-full sm:w-auto">
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}