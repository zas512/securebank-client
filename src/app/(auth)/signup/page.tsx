"use client";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import apiClient from "@/lib/interceptor";

interface FormData {
  name: string;
  email: string;
  password: string;
  cpassword: string;
  pin: string;
  confirmPin: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    pin: "",
    confirmPin: ""
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({
    password: false,
    cpassword: false
  });
  const [showPin, setShowPin] = useState<Record<string, boolean>>({
    pin: false,
    confirmPin: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if ((name === "pin" || name === "confirmPin") && value !== "") {
      if (!/^\d+$/.test(value) || value.length > 4) return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Must be at least 8 characters";
    }
    if (formData.password !== formData.cpassword) {
      newErrors.cpassword = "Passwords do not match";
    }
    if (!formData.pin) {
      newErrors.pin = "PIN is required";
    } else if (formData.pin.length !== 4) {
      newErrors.pin = "PIN must be 4 digits";
    }
    if (formData.pin !== formData.confirmPin) {
      newErrors.confirmPin = "PINs do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await apiClient.post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        pin: formData.pin
      });
      toast.success("Account created! Redirecting...");
      router.push("/login");
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message ?? "Signup failed.");
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full">
        <div className="mb-6 flex justify-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Shield className="h-6 w-6" />
            <span>SecureBank</span>
          </Link>
        </div>
        <Card className="w-96">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>Enter your information to start banking securely</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Full Name + Email */}
              {(
                [
                  { id: "name", label: "Full Name", type: "text" },
                  { id: "email", label: "Email", type: "email" }
                ] as const
              ).map(({ id, label, type }) => (
                <div className="space-y-2" key={id}>
                  <Label htmlFor={id}>{label}</Label>
                  <Input
                    id={id}
                    name={id}
                    type={type}
                    placeholder={label}
                    value={formData[id]}
                    onChange={handleChange}
                    required
                  />
                  {errors[id] && <p className="text-sm text-red-500">{errors[id]}</p>}
                </div>
              ))}

              {/* Password + Confirm Password */}
              {(["password", "cpassword"] as const).map((field) => (
                <div className="space-y-2" key={field}>
                  <Label htmlFor={field}>{field === "cpassword" ? "Confirm Password" : "Password"}</Label>
                  <div className="relative">
                    <Input
                      id={field}
                      name={field}
                      type="text"
                      className={!showPassword[field] ? "input-mask" : ""}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 h-full px-3"
                      onClick={() => setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }))}
                    >
                      {showPassword[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors[field] && <p className="text-sm text-red-500">{errors[field]}</p>}
                </div>
              ))}
              {/* PIN + Confirm PIN */}
              {(["pin", "confirmPin"] as const).map((field) => (
                <div className="space-y-2" key={field}>
                  <Label htmlFor={field}>{field === "confirmPin" ? "Confirm PIN" : "Create 4-Digit PIN"}</Label>
                  <div className="relative">
                    <Input
                      id={field}
                      name={field}
                      type="text"
                      maxLength={4}
                      className={!showPin[field] ? "input-mask" : ""}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 h-full px-3"
                      onClick={() => setShowPin((prev) => ({ ...prev, [field]: !prev[field] }))}
                    >
                      {showPin[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors[field] && <p className="text-sm text-red-500">{errors[field]}</p>}
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="mt-6 w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
              <p className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="font-medium underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
