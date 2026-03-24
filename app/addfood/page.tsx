"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Page() {
  const [foodname, setFoodName] = useState("");
  const [meal, setMeal] = useState("");
  const [date, setDate] = useState("");
  const [image_File, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

 function handleSelecImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;

    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file as Blob));
    }
  }
  
//อัพโหลดรูปภาพและบันทึกข้อมูลลงฐานข้อมูลSupabase
  async function handleUplodeAndSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    //สร้างตัวแปร image_url เพื่อเก็บ URL ของรูปภาพที่อัพโหลด เพื่อเอาไปบันทึกลงตาราง task_tb
    let image_url = "";
    // validate image file
    if (image_File) {
      // if have image file, upload to supabase storage
      // named new file to avoid duplicate file name
      const new_image_file_name = `${Date.now()}-${image_File.name}`;

      // upload image to supabase storage
      const { data, error } = await supabase.storage
        .from("food_bk")
        .upload(new_image_file_name, image_File);

      // after upload image, check the result
      // if there is error, show alert and return, if no error, get the image url and stored in variable image_url
      if (error) {
        // show alert and return
        alert("พบปัญหาในการอัพโหลดรูปภาพ กรุณาลองใหม่อีกครั้ง");
        console.log(error.message);
        return;
      } else {
        // no error, get the image url and stored in variable image_url
        const { data } = await supabase.storage
          .from("food_bk")
          .getPublicUrl(new_image_file_name);
        image_url = data.publicUrl;
      }
    }
    const {data,error} = await supabase
      .from('food_tb')
      .insert({
        foodname: foodname,
        meal: meal,
        fooddate_at: date,
        food_image_url: image_url,

      })

      if(error){
        alert('พบปัญหาในการบันทึกข้อมูล');
        console.log(error.message);
        return;
      }else{
        alert('บันทึกข้อมูลเรียบร้อยแล้ว');
        //เคลียตัวแปร state ต่างๆให้เป็นค่าว่างเหมือนเดิม
        setFoodName("");
        setMeal("");
        setImage(null);
        setDate("");
        setImagePreview("");
        image_url = "";
        // redirect to all task page
        router.push('/dashboard');
      }
  
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-300 via-teal-400 to-cyan-500 p-4">
      <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-8">
          เพิ่มอาหาร
        </h1>

        <form onSubmit={handleUplodeAndSave} className="space-y-6" suppressHydrationWarning>
          {/* Food Name Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
              ชื่ออาหาร
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={foodname}
              onChange={(e) => setFoodName(e.target.value)}
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
              value={meal}
              onChange={(e) => setMeal(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              required
            >
              <option value="" disabled>
              Select Meal
            </option>
            <option value="Breakfast">เมื้อเช้า</option>
            <option value="Lunch">มื้อกลางวัน</option>
            <option value="Dinner">มื้อเย็น</option>
            <option value="Snack">ขนม</option>
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
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              required
            />
          </div>

          {/* Image Upload and Preview */}
          <div className="mt-5 flex flex-col ">
            <label className="text-xl font-bold ">อับโหลดรูปภาพ</label>
            <input
              id="fileInput"
              type="file"
              className="hidden"
              accept="image/"
              onChange={handleSelecImagePreview}
            ></input>
            <label
              htmlFor="fileInput"
              className="mt-2 bg-gray-200 hover:bg-gray-300 transition-all duration-300 text-gray-700 font-bold py-2 px-4 w-max rounded cursor-pointer"
            >
              เลือกไฟล์
            </label>
            {imagePreview && (
              <div className="mt-4">
                <Image
                  src={imagePreview}
                  alt="Image Preview"
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover rounded-md border-4 border-purple-500 shadow-md"
                  unoptimized={true}
                />
              </div>
            )}
          </div>
        
          {/* Form Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="w-full sm:w-auto bg-gray-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>ย้อนกลับ</span>
            </button>
            <button
              type="submit"

              className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2 "
            >
              <span>บันทึก</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
