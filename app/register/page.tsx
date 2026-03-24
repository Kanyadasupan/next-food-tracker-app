"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Page() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.onerror = () => {
        alert("Error reading the file");
        setImagePreview(null);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //* upload image to supabase storage
    let image_url = "";
    if (image) {
      // named new image file
      const new_image_file_name = `${Date.now()}-${image.name}`;
      // upload it
      const { data, error } = await supabase.storage
        .from("user_bk")
        .upload(new_image_file_name, image);
      // after upload, check if the upload is successful
      if (error) {
        alert("พบปัญหาในการอัปโหลดรูปภาพ");
        console.log(error.message);
      } else {
        const { data } = await supabase.storage
          .from("user_bk")
          .getPublicUrl(new_image_file_name);
        image_url = data.publicUrl;
      }
    }

    //* submit form data to supabase
    const { data, error } = await supabase.from("user_tb").insert({
      email: email,
      password: password,
      gender: gender,
      user_image_url: image_url,
      fullname: fullName,
    });

    // after submit, check if the submission is successful
    if (error) {
      alert("พบปัญหาในการลงทะเบียน");
      console.log(error.message);
      return;
    } else {
      alert("ลงทะเบียนสำเร็จ");
      // clear form
      setFullName("");
      setEmail("");
      setPassword("");
      setGender("");
      setImage(null);
      setImagePreview(null);
      // redirect to login page
      router.push("/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-300 via-sky-400 to-teal-500 p-4">
      <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-8">
          Register
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="fullname"
            >
              ชื่อ-สกุล
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              placeholder="กรุณาป้อนชื่อและนามสกุล"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              placeholder="กรุณาป้อนอีเมล"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="password"
            >
              รหัสผ่าน
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              placeholder="กรุณาป้อนรหัสผ่าน"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Gender and Image Section */}
          <div className=" md:grid-cols-2 gap-6">
            {/* Gender Select */}
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
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                required
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="" hidden>
                  เลือกเพศ
                </option>
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
                <option value="other">อื่น ๆ</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            {imagePreview && (
              <div className="mt-3">
                <Image
                src={imagePreview}
                alt="Image Preview"
                width={128}
                height={128}
                className="w-32 h-32 object-cover rounded-full border-4 border-purple-500 shadow-md"
                unoptimized={true}
              />
              </div>
            )}
            <label
              htmlFor="image-upload"
              className="mt-3 bg-green-500 text-white font-bold py-2 px-6 rounded-full cursor-pointer hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2 shadow-md"
            >
              <span>อัปโหลดรูปภาพ</span>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            ลงทะเบียน
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login">
            <span className="text-indigo-600 hover:text-indigo-800 font-semibold transition duration-200">
              Login here
            </span>
          </Link>
        </div>
      </div>
    </div>

  );

}
