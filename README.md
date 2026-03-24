# 🥗 Food Tracker App

**Food Tracker** เป็นเว็บแอปพลิเคชันสำหรับบันทึกและติดตามมื้ออาหารในแต่ละวัน พัฒนาด้วย **Next.js** และใช้งาน **Supabase** เป็นระบบจัดการฐานข้อมูลและ Storage เหมาะสำหรับผู้ที่ต้องการจดบันทึกสิ่งที่รับประทานในแต่ละวันพร้อมรูปภาพประกอบ

## ✨ คุณสมบัติหลัก (Features)

* 🔐 **Authentication**: ระบบสมัครสมาชิกและเข้าสู่ระบบ (Login/Register)
* 👤 **User Profile**: จัดการข้อมูลส่วนตัว แก้ไขชื่อ อีเมล และอัปโหลดรูปโปรไฟล์ได้
* 🍱 **Food Dashboard**: หน้าแสดงรายการอาหารทั้งหมด พร้อมระบบค้นหา (Search) ตามชื่ออาหาร
* ➕ **Meal Logging**: เพิ่มรายการอาหารใหม่ โดยระบุชื่อมื้ออาหาร (เช้า, กลางวัน, เย็น, ขนม) และวันที่
* 🖼️ **Image Upload**: รองรับการอัปโหลดรูปภาพอาหารและรูปโปรไฟล์ขึ้นสู่ Cloud Storage (Supabase)
* 🔄 **Full CRUD**: สามารถเพิ่ม (Create), ดู (Read), แก้ไข (Update) และลบ (Delete) ข้อมูลอาหารได้สมบูรณ์
* 📱 **Responsive Design**: แสดงผลได้สวยงามทั้งบนคอมพิวเตอร์และมือถือด้วย Tailwind CSS

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

* **Frontend**: [Next.js 14+](https://nextjs.org/) (App Router & Client Components)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Modern UI with Gradients & Glassmorphism)
* **Database & Auth**: [Supabase](https://supabase.com/)
* **Language**: TypeScript

## 🚀 การติดตั้งและใช้งาน (Getting Started)

1.  **Clone โปรเจกต์:**
    ```bash
    git clone [https://github.com/KanyadaSupan/food-tracker.git](https://github.com/KanyadaSupan/food-tracker.git)
    cd food-tracker
    ```

2.  **ติดตั้ง Dependencies:**
    ```bash
    npm install
    ```

3.  **ตั้งค่า Environment Variables:**
    สร้างไฟล์ `.env.local` ใน Root directory และเพิ่มค่าจาก Supabase ของคุณ:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **เตรียมฐานข้อมูลบน Supabase:**
    * สร้าง Table `user_tb`: (id, fullname, email, password, gender, user_image_url)
    * สร้าง Table `food_tb`: (id, foodname, meal, fooddate_at, food_image_url, created_at)
    * สร้าง Storage Buckets: `user_bk` และ `food_bk` (ตั้งค่าเป็น Public)

5.  **รันโปรเจกต์:**
    ```bash
    npm run dev
    ```
    เข้าใช้งานผ่าน `http://localhost:3000`

## 📁 โครงสร้างโฟลเดอร์ที่สำคัญ

* `/app/login` & `/app/register` - ระบบจัดการสมาชิก
* `/app/dashboard` - หน้าหลักแสดงรายการอาหารและระบบค้นหา
* `/app/addfood` - ฟอร์มเพิ่มข้อมูลอาหารใหม่
* `/app/updatafood/[id]` - ระบบแก้ไขข้อมูลอาหารเดิม
* `/app/profile` - หน้าจัดการข้อมูลส่วนตัวผู้ใช้
* `/lib/supabaseClient.ts` - การตั้งค่าการเชื่อมต่อกับ Supabase

---
**Developed by [Kanyada](https://github.com/KanyadaSupan)**
*Student at Southeast Asia University | Digital Technology and Innovation*
