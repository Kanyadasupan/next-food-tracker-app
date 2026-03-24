"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  const id = useParams().id;
  const router = useRouter();

  const [foodname, setFoodName] = useState("");
  const [meal, setMeal] = useState("");
  const [date, setDate] = useState("");
  const [image_File, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [old_image_file, setOldImageFile] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFoodData() {
      const { data, error } = await supabase
        .from("food_tb")
        .select("foodname, meal, fooddate_at, food_image_url")
        .eq("id", id)
        .single();

      if (error) {
        alert("พบปัญหาในการดึงข้อมูลจาก");
        console.log(error.message);
        return;
      }
      setFoodName(data.foodname);
      setMeal(data.meal);
      setDate(data.fooddate_at);
      setOldImageFile(data.food_image_url);
      setImagePreview(data.food_image_url);
    }
    fetchFoodData();
  }, [id]);

  function handleSelectImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;

    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file as Blob));
    }
  }

  async function handleuplodeAndUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let image_url = "";
    if (image_File) {
      if (old_image_file != "") {
        const image_name = old_image_file!.split("/").pop() as string;
        const { data, error } = await supabase.storage
          .from("food_bk")
          .remove([image_name]);
        if (error) {
          alert("พบปัญหาในการลบรูปภาพ");
          console.log(error.message);
          return;
        }
      }

      const new_image_file_name = `${Date.now()}-${image_File.name}`;

      const { data, error } = await supabase.storage
        .from("food_bk")
        .upload(new_image_file_name, image_File);

      if (error) {
        alert("พบปัญหาในการอัพโหลดรูปภาพ กรุณาลองใหม่อีกครั้ง");
        console.log(error.message);
        return;
      } else {
        const { data } = await supabase.storage
          .from("food_bk")
          .getPublicUrl(new_image_file_name);
        image_url = data.publicUrl;
      }
    }

    const { data, error } = await supabase
      .from("food_tb")
      .update({
        foodname: foodname,
        meal: meal,
        fooddate_at: date,
        food_image_url: image_url || old_image_file,
      })
      .eq("id", id);

    if (error) {
      alert("พบปัญหาในการอัพเดตข้อมูล");
      console.log(error.message);
      return;
    } else {
      alert("อัพเดตข้อมูลเรียบร้อยแล้ว");
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-300 via-pink-400 to-red-500 p-4">
      <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-8">
          แก้ไขอาหาร
        </h1>

        <form onSubmit={handleuplodeAndUpdate} className="space-y-6">
          {/* Food Name Input */}
          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="name"
            >
              ชื่ออาหาร
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={foodname}
              onChange={(e) => setFoodName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
              placeholder="กรุณาป้อนชื่ออาหาร"
              required
            />
          </div>

          {/* Meal Selection */}
          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="meal"
            >
              มื้ออาหาร
            </label>
            <select
              id="meal"
              name="meal"
              value={meal}
              onChange={(e) => setMeal(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
              required
            >
              {[
                { value: "breakfast", label: "เช้า" },
                { value: "lunch", label: "กลางวัน" },
                { value: "dinner", label: "เย็น" },
                { value: "snack", label: "ขนม" },
              ].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="date"
            >
              วันที่
            </label>
            <input
              type="date"
              id="date"
              value={date || ""}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
            />
          </div>

          {/* Image Upload and Preview */}
          <div className="flex flex-col items-center justify-center">
            {imagePreview ? (
              <div className="relative w-48 h-48 mb-4">
                <div className="relative w-48 h-48 mb-4">
                <Image
                  src={imagePreview}
                  alt="Image Preview"
                  width={192}
                  height={192}
                  unoptimized={true}
                  className="rounded-full w-full h-full object-cover border-4 border-purple-500 shadow-lg"
                />
              </div>
              </div>
            ) : (
              <div className="w-48 h-48 mb-4 bg-gray-200 rounded-full flex items-center justify-center border-4 border-gray-400 shadow-inner text-gray-500">
                ไม่มีรูปภาพ
              </div>
            )}
            <label
              htmlFor="image-upload"
              className="bg-purple-500 text-white font-bold py-2 px-6 rounded-full cursor-pointer hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2 shadow-md"
            >
              <span>อัปโหลดรูปภาพ</span>
            </label>
            <input
              id="image-upload"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleSelectImagePreview}
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
