"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUpload, FaChevronLeft, FaSave } from 'react-icons/fa';
import Link from 'next/link';

/**
 * @fileoverview The Add Food page component for the Food Tracker application.
 * This component provides a form to add a new food item to the tracker.
 * It's built with Next.js using TypeScript and styled with Tailwind CSS.
 */

interface FoodItem {
  name: string;
  meal: string;
  date: string;
  image: string;
}

export default function AddFoodPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<FoodItem, 'image'>>({
    name: '',
    meal: '',
    date: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const mealOptions = [
    { value: '', label: 'เลือกมื้ออาหาร' },
    { value: 'breakfast', label: 'มื้อเช้า' },
    { value: 'lunch', label: 'มื้อกลางวัน' },
    { value: 'dinner', label: 'มื้อเย็น' },
    { value: 'snack', label: 'ของว่าง' },
  ];

  /**
   * Handles changes to the form input fields.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e The change event.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  /**
   * Handles the form submission (currently a placeholder).
   * @param {React.FormEvent<HTMLFormElement>} e The form submit event.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement logic to save the food item to a database or state.
    const newFoodItem: Omit<FoodItem, 'image'> = {
      ...formData,
    };
    console.log('Adding new food item:', newFoodItem);
    console.log('Image file:', imageFile);
    
    // Redirect to the dashboard after submission
    router.push('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-300 via-teal-400 to-cyan-500 p-4">
      <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-8">
          เพิ่มอาหาร
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Food Name Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
              ชื่ออาหาร
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              placeholder="กรุณาป้อนชื่ออาหาร"
              required
            />
          </div>

          {/* Meal Selection */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="meal">
              มื้ออาหาร
            </label>
            <select
              id="meal"
              name="meal"
              value={formData.meal}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              required
            >
              {mealOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="date">
              วันที่
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              required
            />
          </div>

          {/* Image Upload and Preview */}
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
        
          {/* Form Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="w-full sm:w-auto bg-gray-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <FaChevronLeft />
              <span>ย้อนกลับ</span>
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <FaSave />
              <span>บันทึก</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
