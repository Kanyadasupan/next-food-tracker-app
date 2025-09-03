"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import router from 'next/router';
import { FaUpload, FaChevronLeft, FaSave } from 'react-icons/fa';


export default function RegisterPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  /**
   * Handles the change event for the image file input.
   * @param {React.ChangeEvent<HTMLInputElement>} e The file input change event.
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log('Form data:', FormData);

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-300 via-sky-400 to-teal-500 p-4">
      <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-8">
          Register
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="fullname">
              ชื่อ-สกุล
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              placeholder="กรุณาป้อนชื่อและนามสกุล"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
              อีเมล
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              placeholder="กรุณาป้อนอีเมล"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">
              รหัสผ่าน
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              placeholder="กรุณาป้อนรหัสผ่าน"
              required
            />
          </div>

          {/* Gender and Image Section */}
            <div className=" md:grid-cols-2 gap-6">
            {/* Gender Select */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="gender">
                เพศ
              </label>
              <select
                id="gender"
                name="gender"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                required
              >
                <option value="">เลือกเพศ</option>
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
                <option value="other">อื่น ๆ</option>
              </select>
            </div>
            </div>
        

           <div className="flex flex-col items-center justify-center">
                       {imagePreview ? (
                         <div className="relative w-48 h-48 mb-4">
                           <img
                             src={imagePreview}
                             alt="Image Preview"
                             className="rounded-full w-full h-full object-cover border-4 border-green-500 shadow-lg"
                           />
                         </div>
                       ) : (
                         <div className="w-48 h-48 mb-4 bg-gray-200 rounded-full flex items-center justify-center border-4 border-gray-400 shadow-inner text-gray-500">
                           ไม่มีรูปภาพ
                         </div>
                       )}
                       <label
                         htmlFor="image-upload"
                         className="bg-green-500 text-white font-bold py-2 px-6 rounded-full cursor-pointer hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2 shadow-md"
                       >
                         <FaUpload />
                         <span>อัปโหลดรูปภาพ</span>
                       </label>
                       <input
                         id="image-upload"
                         type="file"
                         name="image"
                         accept="image/*"
                         onChange={handleImageChange}
                         className="hidden"
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
          Already have an account?{' '}
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
