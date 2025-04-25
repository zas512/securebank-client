"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import apiClient from "@/lib/interceptor";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  securityQuestions: Array<{
    question: string;
    answer: string;
  }>;
}

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  transactionAlerts: boolean;
}

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.user);
  const [activeTab, setActiveTab] = useState("personal");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    securityQuestions: [
      { question: "What is your mother's maiden name?", answer: "" },
      { question: "What was your first pet's name?", answer: "" }
    ]
  });

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    push: true,
    transactionAlerts: true
  });

  useEffect(() => {
    if (user) {
      console.log("User data from Redux:", user);
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        securityQuestions: [
          { question: "What is your mother's maiden name?", answer: "" },
          { question: "What was your first pet's name?", answer: "" }
        ]
      }));
    } else {
      console.log("User data from Redux is null or undefined.");
    }
  }, [user]);

  const isFormDataDirty = () => {
    return (
      formData.name !== user.name ||
      formData.email !== user.email ||
      formData.phone !== user.phone ||
      formData.address !== user.address
    );
  };

  const isSecurityDirty = () => {
    return formData.securityQuestions.some((q) => q.answer.trim() !== "");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSecurityAnswerChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.securityQuestions];
      updated[index].answer = value;
      return { ...prev, securityQuestions: updated };
    });
  };

  const handlePreferenceChange = (key: keyof NotificationPreferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = async (type: "personal" | "security" | "preferences") => {
    try {
      let payload = {};

      if (type === "personal" && isFormDataDirty()) {
        payload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        };
      } else if (type === "security" && isSecurityDirty()) {
        payload = {
          securityQuestions: formData.securityQuestions.filter((q) => q.answer.trim() !== "")
        };
      } else {
        return;
      }

      await apiClient.put("/api/user/profile", payload);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <div className="container p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Personal Tab */}
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={formData.name} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleInputChange} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={formData.phone} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={formData.address} onChange={handleInputChange} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSubmit("personal")} disabled={!isFormDataDirty()}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Security Questions</h3>
                {formData.securityQuestions.map((q, i) => (
                  <div key={q.question} className="space-y-2">
                    <Label>{q.question}</Label>
                    <Input
                      type="text"
                      value={q.answer}
                      onChange={(e) => handleSecurityAnswerChange(i, e.target.value)}
                      placeholder="Enter your answer"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSubmit("security")} disabled={!isSecurityDirty()}>
                Update Security Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "email", label: "Email Notifications", desc: "Receive updates via email" },
                { key: "push", label: "Push Notifications", desc: "Receive push notifications" },
                { key: "transactionAlerts", label: "Transaction Alerts", desc: "Get notified about transactions" }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{item.label}</Label>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                  <Switch
                    checked={preferences[item.key as keyof NotificationPreferences]}
                    onCheckedChange={() => handlePreferenceChange(item.key as keyof NotificationPreferences)}
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSubmit("preferences")}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
