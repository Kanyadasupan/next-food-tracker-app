"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  gender?: string;
  avatar_url?: string;
}

interface GenderOption {
  value: string;
  label: string;
}

const genderOptions: GenderOption[] = [
  { value: "male", label: "ชาย" },
  { value: "female", label: "หญิง" },
  { value: "other", label: "อื่นๆ" },
];

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get user data from localStorage
        const userData = localStorage.getItem("user");

        if (!userData) {
          alert("กรุณาเข้าสู่ระบบก่อน");
          router.push("/login");
          return;
        }
        const parsedUser = JSON.parse(userData);

        // Get fresh user data from user_tb table
        const { data: userProfile, error } = await supabase
          .from("user_tb")
          .select("*")
          .eq("id", parsedUser.id)
          .single();

        if (error) {
          console.error("Error fetching user profile:", error);
          alert("เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้");
          router.push("/login");
          return;
        }

        if (userProfile) {
          const profile = {
            id: userProfile.id,
            email: userProfile.email,
            full_name: userProfile.fullname,
            gender: userProfile.gender,
            avatar_url: userProfile.user_image_url,
          };

          setUser(profile);
          setFullName(profile.full_name ?? "");
          setEmail(profile.email ?? "");
          setGender(profile.gender ?? "");
          setImagePreview(profile.avatar_url ?? null);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      if (!user) {
        alert("ไม่พบข้อมูลผู้ใช้");
        return;
      }

      //* Upload new image if selected
      let avatar_url = imagePreview;
      if (image) {
        const new_image_file_name = `${Date.now()}-${image.name}`;
        const { error: uploadError } = await supabase.storage
          .from("user_bk")
          .upload(new_image_file_name, image);

        if (uploadError) {
          alert("พบปัญหาในการอัปโหลดรูปภาพ");
          console.log(uploadError.message);
          return;
        } else {
          const { data } = await supabase.storage
            .from("user_bk")
            .getPublicUrl(new_image_file_name);
          avatar_url = data.publicUrl;
        }
      }

      // Update user profile in user_tb table
      const updateData: {
        email: string;
        fullname: string;
        gender: string;
        user_image_url: string | null;
        password?: string;
      } = {
        email: email,
        fullname: fullName,
        gender: gender,
        user_image_url: avatar_url,
      };

      // Only update password if provided
      if (password) {
        updateData.password = password;
      }

      const { error: updateError } = await supabase
        .from("user_tb")
        .update(updateData)
        .eq("id", user.id);

      if (updateError) {
        alert("พบปัญหาในการอัปเดตข้อมูลโปรไฟล์");
        console.log(updateError.message);
        return;
      }

      // Update localStorage with new data
      const updatedUserData = {
        id: user.id,
        fullname: fullName,
        email: user.email,
        gender: gender,
        user_image_url: avatar_url,
      };
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      alert("อัปเดตข้อมูลโปรไฟล์สำเร็จ");
      router.push("/dashboard");
    } catch (error) {
      console.error("Update profile error:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูลโปรไฟล์");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-300 via-blue-400 to-sky-500 p-4">
      <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-8">
          โปรไฟล์ผู้ใช้
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name Input */}
          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="name"
            >
              ชื่อ-นามสกุล
            </label>
            <input
              disabled={isLoading}
              type="text"
              id="name"
              name="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              placeholder="กรุณาป้อนชื่อ-นามสกุล"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="email"
            >
              อีเมล
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              placeholder="กรุณาป้อนอีเมล"
              required
            />
          </div>

          {/* Gender Selection */}
          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="gender"
            >
              เพศ
            </label>
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              required
            >
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Profile Image Upload and Preview */}
          <div className="flex flex-col items-center justify-center">
            {imagePreview ? (
              <div className="relative w-48 h-48 mb-4">
                <Image
                  src={imagePreview}
                  alt="Image Preview"
                  width={192}
                  height={192}
                  className="rounded-full w-full h-full object-cover border-4 border-indigo-500 shadow-lg"
                />
              </div>
            ) : (
              <div className="w-48 h-48 mb-4 bg-gray-200 rounded-full flex items-center justify-center border-4 border-gray-400 shadow-inner text-gray-500">
                ไม่มีรูปภาพ
              </div>
            )}
            <label
              htmlFor="image-upload"
              className="bg-indigo-500 text-white font-bold py-2 px-6 rounded-full cursor-pointer hover:bg-indigo-600 transition duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2 shadow-md"
            >
              <span>อัปโหลดรูปภาพ</span>
            </label>
            <input
              id="image-upload"
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Form Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="w-full sm:w-auto bg-gray-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>ย้อนกลับ</span>
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>บันทึก</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
