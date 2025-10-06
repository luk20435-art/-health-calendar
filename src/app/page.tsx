"use client";
import { useState } from "react";
import { Heart, User, Activity, ClipboardList, Calendar } from "lucide-react";

type BloodPressureEntry = { 
  date: string; 
  time: string; 
  systolic: string; 
  diastolic: string; 
  heartRate: string; 
  recorder: string; 
};

type FormDataState = {
  section1: Record<string, string>;
  section2: Record<string, string>;
  section3: Record<string, string>;
  section4: {
    bloodPressure: Record<string, BloodPressureEntry>;
  };
};

export default function HypertensionSurvey() {
  const [formData, setFormData] = useState<FormDataState>({
    section1: { fullName: "", ageYears: "", ageMonths: "", gender: "", weight: "", height: "" },
    section2: {},
    section3: {},
    section4: {
      bloodPressure: {
        beforeProgram1: { date: "", time: "", systolic: "", diastolic: "", heartRate: "", recorder: "" },
        beforeProgram2: { date: "", time: "", systolic: "", diastolic: "", heartRate: "", recorder: "" },
        afterProgram1: { date: "", time: "", systolic: "", diastolic: "", heartRate: "", recorder: "" },
        afterProgram2: { date: "", time: "", systolic: "", diastolic: "", heartRate: "", recorder: "" },
      },
    },
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleChange = (section: keyof FormDataState, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleSection2Change = (questionId: string, value: string) => {
    setFormData((prev) => ({ ...prev, section2: { ...prev.section2, [questionId]: value } }));
  };

  const handleSection3Change = (questionId: string, value: string) => {
    setFormData((prev) => ({ ...prev, section3: { ...prev.section3, [questionId]: value } }));
  };

  const handleBloodPressureChange = (period: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      section4: {
        bloodPressure: {
          ...prev.section4.bloodPressure,
          [period]: { ...prev.section4.bloodPressure[period], [field]: value } as BloodPressureEntry,
        },
      },
    }));
  };

  const motivationQuestions = [
    "ผู้ที่มีบุคคลในครอบครัวเป็นโรคความดันโลหิตสูงเสี่ยงต่อการป่วยมากกว่าบุคคลอื่น",
    "ผู้ที่มีน้ำหนักเกินหรืออ้วน มีความเสี่ยงต่อโรคความดันโลหิตสูงมากกว่าผู้ที่น้ำหนักปกติ",
    "ผู้ที่มีภาวะเครียดจากการทำงานเป็นประจำ มีโอกาสเสี่ยงต่อการเกิดโรคความดันโลหิตสูง",
    "การรับประทานอาหารไขมันสูง เช่น เนื้อสัตว์ติดมัน มีโอกาสเสี่ยงต่อโรคความดันโลหิตสูง",
    "การรับประทานอาหารรสเค็มเพิ่มความเสี่ยงต่อการเกิดโรคความดันโลหิตสูง",
    "การรับประทานอาหารประเภทผัด/ทอดเป็นประจำเสี่ยงต่อความดันโลหิตสูง",
    "การออกกำลังกายเป็นประจำ 3-5 ครั้งต่อสัปดาห์ ช่วยลดความเสี่ยงต่อความดันโลหิตสูง",
    "การสูบบุหรี่เป็นประจำเสี่ยงต่อความดันโลหิตสูง",
    "การดื่มแอลกอฮอล์เป็นประจำเสี่ยงต่อความดันโลหิตสูง",
    "โรคความดันโลหิตสูงไม่สามารถรักษาให้หายขาดได้",
    "โรคความดันโลหิตสูงสามารถป้องกันได้",
    "โรคความดันโลหิตสูงรุนแรง อาจทำให้เสียชีวิตได้",
    "โรคความดันโลหิตสูงเป็นปัจจัยเสี่ยงต่อหัวใจ",
    "โรคไตวายเรื้อรังเป็นภาวะแทรกซ้อนจากความดันโลหิตสูง",
    "ระดับความดันโลหิตสูงที่ควบคุมไม่ได้ อาจทำให้สมองตีบ/แตก",
    "ผลกระทบจากความดันโลหิตสูง เป็นภาระของครอบครัว",
    "การรับประทานผัก/ผลไม้ที่มีเส้นใยสูง ช่วยป้องกันความดันโลหิตสูง",
    "หลีกเลี่ยงเครื่องปรุงเช่น น้ำปลา/ซีอิ๊ว ช่วยลดความดันโลหิต",
    "หลีกเลี่ยงผัด/ทอด ใช้วิธีต้ม/นึ่ง/ย่างช่วยลดความดัน",
    "ออกกำลังกายสัปดาห์ละ 3 วัน ช่วยป้องกันความดันโลหิตสูง",
    "ออกกำลังกายต่อเนื่อง 30 นาที ช่วยป้องกันความดันโลหิตสูง",
    "หลีกเลี่ยงแกงกะทิช่วยลดความเสี่ยงความดันโลหิตสูง",
    "ผ่อนคลายความเครียดเช่น สวดมนต์/สมาธิ ช่วยลดความเสี่ยง",
    "นอน 6-8 ชั่วโมง ลดความเสี่ยงความดันโลหิตสูง",
    "ลดบุหรี่ช่วยลดสาเหตุความดันโลหิตสูง",
    "หลีกเลี่ยงแอลกอฮอล์/บุหรี่ช่วยป้องกันความดันโลหิตสูง",
    "เชื่อมั่นควบคุมการกินเค็มได้",
    "เชื่อมั่นกินผัก/ผลไม้เส้นใยสูงเป็นประจำ",
    "เชื่อมั่นปรุงอาหารวิธีต้ม/นึ่ง/ย่างได้",
    "มั่นใจออกกำลังกายสัปดาห์ละ 3 วัน",
    "มั่นใจออกกำลังกายต่อเนื่อง 30 นาที",
    "มั่นใจจัดการความเครียดได้",
    "มั่นใจลด/เลิกบุหรี่",
    "มั่นใจลด/เลิกแอลกอฮอล์",
  ];

  const behaviorQuestions = [
    "รับประทานอาหารเค็ม เช่น เนื้อเค็ม ไข่เค็ม ผักดอง",
    "เติมน้ำปลา/ซอสปรุงรสก่อนรับประทาน",
    "รับประทานผัก/ผลไม้เส้นใยสูง",
    "เลือกเนื้อสัตว์ไม่ติดหนัง/มัน",
    "ใช้วิธีต้ม/นึ่ง/ย่างแทนผัด/ทอด",
    "ออกกำลังกายสัปดาห์ละ 3 วัน",
    "ออกกำลังกายต่อเนื่อง 30 นาที",
    "มีกิจกรรมทางกายอื่น ๆ เช่น เดินขึ้นบันได",
    "หางานอดิเรกทำเมื่อมีเวลาว่าง",
    "นอนวันละ 7-8 ชั่วโมง",
    "ผ่อนคลายความเครียดด้วยการนั่ง/นอนสบาย",
    "สูบบุหรี่หรือบุหรี่ไฟฟ้าประจำหรือไม่",
    "ดื่มแอลกอฮอล์เป็นประจำหรือไม่",
  ];

  const bpLabels = {
    beforeProgram1: "ก่อนโครงการ ครั้งที่ 1",
    beforeProgram2: "ก่อนโครงการ ครั้งที่ 2",
    afterProgram1: "หลังโครงการ ครั้งที่ 1",
    afterProgram2: "หลังโครงการ ครั้งที่ 2",
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const scriptURL = "https://script.google.com/macros/s/AKfycby1rU8FYvST49GUHrT6QGDr2lLoAo3QQEBDs-3iOsVHrnkh3pcIaPxzuthLy7KG8rcS/exec";
      const flatData: Record<string, string> = {};

      const flattenObject = (obj: Record<string, unknown>, prefix = '') => {
        Object.entries(obj).forEach(([key, value]) => {
          const newKey = prefix ? `${prefix}_${key}` : key;
          if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            flattenObject(value as Record<string, unknown>, newKey);
          } else {
            flatData[newKey] = String(value);
          }
        });
      };

      flattenObject(formData.section1, "section1");
      flattenObject(formData.section2, "section2");
      flattenObject(formData.section3, "section3");
      Object.entries(formData.section4.bloodPressure).forEach(([period, bpData]) => {
        Object.entries(bpData).forEach(([field, value]) => {
          flatData[`section4_${period}_${field}`] = value;
        });
      });

      const urlSearchParams = new URLSearchParams(flatData);

      const res = await fetch(scriptURL, { method: "POST", body: urlSearchParams });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const json = await res.json();
      setResult(json.success ? "✅ บันทึกข้อมูลเรียบร้อยแล้ว" : "❌ เกิดข้อผิดพลาดจาก Apps Script: " + (json.error || "ไม่ทราบข้อผิดพลาด"));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setResult("❌ การส่งข้อมูลล้มเหลว: " + err.message);
      } else {
        setResult("❌ การส่งข้อมูลล้มเหลว: ไม่ทราบข้อผิดพลาด");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-full">
              <Heart className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            แบบฟอร์มสำรวจความดันโลหิต
          </h1>
          <p className="text-gray-600">กรุณากรอกข้อมูลให้ครบถ้วนและตรงตามความเป็นจริง</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: ข้อมูลส่วนตัว */}
          <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-pink-500" /> ข้อมูลส่วนตัว
            </h2>
            {["fullName", "ageYears", "ageMonths", "gender", "weight", "height"].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="font-medium text-gray-700">{field}</label>
                <input
                  type="text"
                  value={formData.section1[field] || ""}
                  onChange={(e) => handleChange("section1", field, e.target.value)}
                  className="border rounded px-3 py-2"
                />
              </div>
            ))}
          </div>

          {/* Section 2: Motivation Questions */}
          <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-pink-500" /> แบบสอบถามทัศนคติ
            </h2>
            {motivationQuestions.map((q, i) => (
              <div key={i} className="flex flex-col">
                <label>{q}</label>
                <select
                  value={formData.section2[`q${i}`] || ""}
                  onChange={(e) => handleSection2Change(`q${i}`, e.target.value)}
                  className="border rounded px-3 py-2"
                >
                  <option value="">เลือก</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            ))}
          </div>

          {/* Section 3: Behavior Questions */}
          <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-pink-500" /> แบบสอบถามพฤติกรรม
            </h2>
            {behaviorQuestions.map((q, i) => (
              <div key={i} className="flex flex-col">
                <label>{q}</label>
                <select
                  value={formData.section3[`b${i}`] || ""}
                  onChange={(e) => handleSection3Change(`b${i}`, e.target.value)}
                  className="border rounded px-3 py-2"
                >
                  <option value="">เลือก</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            ))}
          </div>

          {/* Section 4: Blood Pressure */}
          <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-pink-500" /> ความดันโลหิต
            </h2>
            {Object.entries(formData.section4.bloodPressure).map(([period, bpData]) => (
              <div key={period} className="p-4 border rounded space-y-2">
                <h3 className="font-medium">{bpLabels[period as keyof typeof bpLabels]}</h3>
                {Object.entries(bpData).map(([field, value]) => (
                  <div key={field} className="flex flex-col">
                    <label className="capitalize">{field}</label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleBloodPressureChange(period, field, e.target.value)}
                      className="border rounded px-3 py-2"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "กำลังส่ง..." : "ส่งข้อมูล"}
            </button>
            {result && <p className="mt-4">{result}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
