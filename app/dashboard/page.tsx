"use client";

import React, { useMemo, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Food {
  id: number;
  foodname: string;
  meal: string;
  fooddate_at: string;
  food_image_url: string | null;
  created_at: string;
  update_at: string;
}

export default function Page() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      router.push("/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    async function fetchFoods() {
      const { data, error } = await supabase
        .from("food_tb")
        .select(
          "id, foodname, meal, fooddate_at, food_image_url, created_at, update_at",
        )
        .order("created_at", { ascending: false });

      //หลังจากดึงข้อมูลมาตรวจสอบ error
      if (error) {
        alert("พบปัญหาในการดึงข้อมูลจาก");
        console.log(error.message);
        return;
      }
      //ถ้าไม่มี error ให้เก็บข้อมูลที่ดึงมาไว้ใน state tasks
      if (data) {
        setFoods(data as Food[]);
      }
    }

    fetchFoods();
  }, []);
  const filteredFoods = useMemo(() => {
    return foods.filter((food) =>
      food.foodname.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [foods, searchTerm]);

  //* calculate total pages and current foods
  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);

  //* get current foods
  const currentFoods = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredFoods.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredFoods]);

  //* handle search
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
  };

  async function deleteFood(id: number, image_url: string) {
    //แสดงconfirm dialogเพื่อให้ผู้ใช้ยืนยันการลบข้อมูล
    if (confirm("คุณต้องการลบรายการอาหารนี้ใช่หรือไม่?")) {
      //ลบรูปออกจาก stroage (ถ้ามีรูป)
      if (image_url != "") {
        //เอาเฉพาะชื่อรูปจาก image_url เก็บในตัวแปล
        const image_name = image_url.split("/").pop() as string;
        //ลบรูปออกจาก storage
        const { data, error } = await supabase.storage
          .from("food_bk")
          .remove([image_name]);
        //ตรวจสอบ error
        if (error) {
          alert("พบปัญหาในการลบรูปภาพ");
          console.log(error.message);
          return;
        }
      }
      //ลบข้อมูลออกจากตาราง supabase
      const { data, error } = await supabase
        .from("food_tb")
        .delete()
        .eq("id", id);

      //ตรวจสอบ error
      if (error) {
        alert("พบปัญหาในการลบข้อมูล");
        console.log(error.message);
        return;
      }
      //ลบข้อมูลออกจากรายการที่แสดงบนหน้าจอ
      setFoods(foods.filter((food) => food.id !== id));
    }
  }

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
              suppressHydrationWarning
              type="text"
              placeholder="ค้นหาชื่ออาหาร..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch();
              }}
              className="w-full px-5 py-3 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div className="absolute top-4 right-7 ">
            <Link href="/profile" className="inline-flex items-center">
              <button
                aria-label="โปรไฟล์"
                className="w-full sm:w-auto bg-gray-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
              >
                <span className="text-xl font-medium text-white hidden sm:inline">
                  โปรไฟล์
                </span>
              </button>
            </Link>
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
                <th className="py-3 px-6 text-left text-sm font-semibold">
                  รูปภาพ
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold">
                  ชื่ออาหาร
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold">
                  มื้ออาหาร
                </th>
                <th className="py-3 px-6 text-center text-sm font-semibold">
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              {currentFoods.length > 0 ? (
                currentFoods.map((food) => (
                  <tr
                    key={food.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 whitespace-nowrap">
                      <Image
                        src={food.food_image_url ?? "/placeholder.png"}
                        alt={food.foodname}
                        width={40}
                        height={40}
                        unoptimized={true}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="py-3 px-6 whitespace-nowrap">
                      {food.foodname}
                    </td>
                    <td className="py-3 px-6 whitespace-nowrap">{food.meal}</td>
                    <td className="py-3 px-6 text-center whitespace-nowrap">
                      <button
                        onClick={() => router.push(`/updatafood/${food.id}`)}
                        className="bg-yellow-500 text-white py-1 px-3 rounded-full text-xs font-bold hover:bg-yellow-600 mr-2"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() =>
                          deleteFood(food.id, food.food_image_url ?? "")
                        }
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
                onClick={() => setCurrentPage(index + 1)}
                className={`py-2 px-4 rounded-full font-semibold transition duration-200 ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
