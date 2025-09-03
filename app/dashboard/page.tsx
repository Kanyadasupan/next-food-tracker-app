"use client";

import { useState } from 'react';
import Link from 'next/link';

/**
 * @fileoverview The Dashboard page for the Food Tracker application.
 * This component displays a list of food items with pagination and search functionality.
 */

// Mock data for demonstration purposes. In a real application, this would come from an API or database.
const mockFoods = [
  { id: 1, name: 'ส้มตำ', meal: 'มื้อกลางวัน', image: 'https://placehold.co/50x50/f0f0f0/666?text=ตำ', date: '2023-10-27' },
  { id: 2, name: 'ผัดไทย', meal: 'มื้อเย็น', image: 'https://placehold.co/50x50/f0f0f0/666?text=ผัด', date: '2023-10-26' },
  { id: 3, name: 'ข้าวผัด', meal: 'มื้อกลางวัน', image: 'https://placehold.co/50x50/f0f0f0/666?text=ข้าว', date: '2023-10-25' },
  { id: 4, name: 'ต้มยำกุ้ง', meal: 'มื้อเย็น', image: 'https://placehold.co/50x50/f0f0f0/666?text=ต้ม', date: '2023-10-24' },
  { id: 5, name: 'ก๋วยเตี๋ยว', meal: 'มื้อกลางวัน', image: 'https://placehold.co/50x50/f0f0f0/666?text=ก๋วย', date: '2023-10-23' },
  { id: 6, name: 'แกงเขียวหวาน', meal: 'มื้อเย็น', image: 'https://placehold.co/50x50/f0f0f0/666?text=แกง', date: '2023-10-22' },
  { id: 7, name: 'ไข่เจียว', meal: 'มื้อเช้า', image: 'https://placehold.co/50x50/f0f0f0/666?text=ไข่', date: '2023-10-21' },
  { id: 8, name: 'ผัดกะเพรา', meal: 'มื้อกลางวัน', image: 'https://placehold.co/50x50/f0f0f0/666?text=กระ', date: '2023-10-20' },
  { id: 9, name: 'ยำวุ้นเส้น', meal: 'มื้อเย็น', image: 'https://placehold.co/50x50/f0f0f0/666?text=ยำ', date: '2023-10-19' },
  { id: 10, name: 'ข้าวเหนียวมะม่วง', meal: 'ของว่าง', image: 'https://placehold.co/50x50/f0f0f0/666?text=มะ', date: '2023-10-18' },
];

const ITEMS_PER_PAGE = 5;

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter food items based on the search term
  const filteredFoods = mockFoods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the food items to display on the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const foodsToDisplay = filteredFoods.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredFoods.length / ITEMS_PER_PAGE);

  /**
   * Handles the click event for pagination.
   * @param {number} pageNumber The page number to navigate to.
   */
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  /**
   * Handles the action for editing a food item.
   * @param {number} id The ID of the food item to edit.
   */
  const handleEdit = (id: number) => {
    // TODO: Implement edit functionality. Maybe navigate to a page with a form.
    console.log(`Edit item with ID: ${id}`);
  };

  /**
   * Handles the action for deleting a food item.
   * @param {number} id The ID of the food item to delete.
   */
  const handleDelete = (id: number) => {
    // TODO: Implement delete functionality.
    console.log(`Delete item with ID: ${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-cyan-400 to-green-500 p-4 sm:p-8">
      <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm p-6 md:p-10 rounded-3xl shadow-2xl max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-6">
          Food Dashboard
        </h1>

        {/* Search Bar and Add Food Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="w-full sm:w-2/3">
            <input
              type="text"
              placeholder="ค้นหาชื่ออาหาร..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on new search
              }}
              className="w-full px-5 py-3 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <Link href="/addfood">
            <button className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105">
              เพิ่มอาหาร
            </button>
          </Link>
        </div>

        {/* Food List Table */}
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full bg-white bg-opacity-90">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold">รูปภาพ</th>
                <th className="py-3 px-6 text-left text-sm font-semibold">ชื่ออาหาร</th>
                <th className="py-3 px-6 text-left text-sm font-semibold">มื้ออาหาร</th>
                <th className="py-3 px-6 text-center text-sm font-semibold">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {foodsToDisplay.length > 0 ? (
                foodsToDisplay.map((food) => (
                  <tr key={food.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 whitespace-nowrap">
                      <img src={food.image} alt={food.name} className="w-10 h-10 rounded-full object-cover" />
                    </td>
                    <td className="py-3 px-6 whitespace-nowrap">{food.name}</td>
                    <td className="py-3 px-6 whitespace-nowrap">{food.meal}</td>
                    <td className="py-3 px-6 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(food.id)}
                        className="bg-yellow-500 text-white py-1 px-3 rounded-full text-xs font-bold hover:bg-yellow-600 mr-2"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(food.id)}
                        className="bg-red-500 text-white py-1 px-3 rounded-full text-xs font-bold hover:bg-red-600"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-gray-500">
                    ไม่พบข้อมูลอาหาร
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`py-2 px-4 rounded-full font-semibold transition duration-200 ${
                  currentPage === index + 1
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
